require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2/promise");
const crypto = require("node:crypto");

const app = express();
const PORT = +(process.env.PORT || 3000);
const secret = process.env.JWT_SECRET;
const production = process.env.NODE_ENV === "production";
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

if (!secret || secret.length < 32) {
  console.error("Configure JWT_SECRET com pelo menos 32 caracteres.");
  process.exit(1);
}

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: +(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "g_tech_suporte",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
});

const cookie = {
  httpOnly: true,
  secure: production || process.env.COOKIE_SECURE === "true",
  sameSite: "lax",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
};
const statuses = [
  "Aguardando atendimento",
  "Em atendimento",
  "Aguardando cliente",
  "Resolvido",
  "Cancelado",
];
const priorities = ["Baixa", "Normal", "Alta", "Urgente"];

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use((req, res, next) => {
  if (
    ["POST", "PATCH", "PUT", "DELETE"].includes(req.method) &&
    req.path !== "/health" &&
    req.get("origin") !== origin
  ) {
    return res.status(403).json({ mensagem: "Origem não autorizada." });
  }
  next();
});

const emailOK = (email) =>
  typeof email === "string" &&
  email.length <= 190 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function issueSession(res, user) {
  const token = jwt.sign(
    { sub: String(user.id), perfil: user.perfil },
    secret,
    { expiresIn: "8h", issuer: "gtech-api", audience: "gtech-client" },
  );
  res.cookie("gtech_session", token, cookie);
}

function auth(req, res, next) {
  try {
    const payload = jwt.verify(req.cookies.gtech_session, secret, {
      issuer: "gtech-api",
      audience: "gtech-client",
    });
    req.user = { id: +payload.sub, perfil: payload.perfil };
    next();
  } catch {
    return res.status(401).json({ mensagem: "Faça login novamente." });
  }
}

const technician = (req, res, next) =>
  req.user.perfil === "tecnico"
    ? next()
    : res.status(403).json({ mensagem: "Acesso exclusivo da equipe técnica." });

function ticketLookup(id) {
  const value = String(id || "");
  if (/^\d+$/.test(value)) return { sql: "c.id = ?", value: Number(value) };
  return { sql: "c.codigo = ?", value };
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/auth/register", authLimit, async (req, res) => {
  const { nome, email, senha, empresa, telefone } = req.body || {};
  if (
    typeof nome !== "string" || nome.trim().length < 2 || nome.length > 120 ||
    !emailOK(email) ||
    typeof senha !== "string" || senha.length < 12 || senha.length > 128
  ) {
    return res.status(400).json({
      mensagem: "Informe nome, e-mail válido e senha entre 12 e 128 caracteres.",
    });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO usuarios(nome,email,senha_hash,empresa,telefone,perfil) VALUES(?,?,?,?,?,'cliente')",
      [
        nome.trim(),
        email.trim().toLowerCase(),
        await bcrypt.hash(senha, 12),
        typeof empresa === "string" ? empresa.trim().slice(0, 160) : null,
        typeof telefone === "string" ? telefone.trim().slice(0, 30) : null,
      ],
    );
    const user = {
      id: result.insertId,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      perfil: "cliente",
      empresa: empresa || "",
    };
    issueSession(res, user);
    return res.status(201).json({ usuario: user });
  } catch (error) {
    return res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
      mensagem: error.code === "ER_DUP_ENTRY"
        ? "E-mail já cadastrado."
        : "Falha ao cadastrar cliente.",
    });
  }
});

app.post("/auth/login", authLimit, async (req, res) => {
  const { email, senha, perfil } = req.body || {};
  if (!emailOK(email) || typeof senha !== "string" || !["cliente", "tecnico"].includes(perfil)) {
    return res.status(400).json({ mensagem: "Dados inválidos." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id,nome,email,senha_hash,perfil,empresa,ativo FROM usuarios WHERE email=? LIMIT 1",
      [email.trim().toLowerCase()],
    );
    const user = rows[0];
    const passwordMatches = user ? await bcrypt.compare(senha, user.senha_hash) : false;
    if (!user || !passwordMatches || !user.ativo || user.perfil !== perfil) {
      return res.status(401).json({ mensagem: "E-mail, senha ou perfil incorretos." });
    }
    issueSession(res, user);
    return res.json({
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        empresa: user.empresa || "",
      },
    });
  } catch (error) {
    console.error("Login:", error.code);
    return res.status(500).json({ mensagem: "Falha na autenticação." });
  }
});

app.post("/auth/logout", (_req, res) => {
  res.clearCookie("gtech_session", { ...cookie, maxAge: undefined });
  return res.status(204).end();
});

app.get("/auth/me", auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id,nome,email,perfil,empresa FROM usuarios WHERE id=? AND ativo=1",
      [req.user.id],
    );
    if (!rows[0]) return res.status(401).json({ mensagem: "Conta indisponível." });
    return res.json({ usuario: rows[0] });
  } catch (error) {
    console.error("Sessão:", error.code);
    return res.status(500).json({ mensagem: "Falha ao consultar a sessão." });
  }
});

app.post("/chamados", auth, async (req, res) => {
  if (req.user.perfil !== "cliente") {
    return res.status(403).json({ mensagem: "Somente clientes podem abrir chamados." });
  }

  const { titulo, categoria, prioridade, descricao } = req.body || {};
  if (
    typeof titulo !== "string" || titulo.trim().length < 4 || titulo.length > 160 ||
    typeof categoria !== "string" || categoria.trim().length < 2 || categoria.length > 80 ||
    !priorities.includes(prioridade) ||
    typeof descricao !== "string" || descricao.trim().length < 10 || descricao.length > 5000
  ) {
    return res.status(400).json({ mensagem: "Revise os dados do chamado." });
  }

  const codigo = "GT-" + new Date().getFullYear() + "-" +
    crypto.randomBytes(4).toString("hex").toUpperCase();
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "INSERT INTO chamados(codigo,cliente_id,titulo,categoria,prioridade,descricao) VALUES(?,?,?,?,?,?)",
      [codigo, req.user.id, titulo.trim(), categoria.trim(), prioridade, descricao.trim()],
    );
    await connection.execute(
      "INSERT INTO historico_chamados(chamado_id,autor_id,mensagem) VALUES(?,?,?)",
      [result.insertId, req.user.id, "Chamado aberto pelo cliente."],
    );
    await connection.commit();
    return res.status(201).json({
      chamado: {
        id: result.insertId,
        codigo,
        titulo: titulo.trim(),
        categoria: categoria.trim(),
        prioridade,
        status: "Aguardando atendimento",
        descricao: descricao.trim(),
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Chamado:", error.code);
    return res.status(500).json({ mensagem: "Não foi possível registrar o chamado." });
  } finally {
    connection.release();
  }
});

app.get("/chamados", auth, async (req, res) => {
  try {
    if (req.user.perfil === "tecnico") {
      const { status, prioridade, tecnico_id: technicianId } = req.query;
      if (status && !statuses.includes(status)) {
        return res.status(400).json({ mensagem: "Filtro de status inválido." });
      }
      if (prioridade && !priorities.includes(prioridade)) {
        return res.status(400).json({ mensagem: "Filtro de prioridade inválido." });
      }
      if (technicianId && technicianId !== "sem_responsavel" &&
          (!/^\d+$/.test(String(technicianId)) || Number(technicianId) < 1)) {
        return res.status(400).json({ mensagem: "Filtro de responsável inválido." });
      }

      const conditions = [];
      const values = [];
      if (status) { conditions.push("c.status=?"); values.push(status); }
      if (prioridade) { conditions.push("c.prioridade=?"); values.push(prioridade); }
      if (technicianId === "sem_responsavel") {
        conditions.push("c.tecnico_id IS NULL");
      } else if (technicianId) {
        conditions.push("c.tecnico_id=?");
        values.push(Number(technicianId));
      }
      const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
      const [rows] = await db.execute(
        `SELECT c.*,u.nome cliente_nome,u.email cliente_email,t.nome tecnico_nome
         FROM chamados c
         JOIN usuarios u ON u.id=c.cliente_id
         LEFT JOIN usuarios t ON t.id=c.tecnico_id
         ${where}
         ORDER BY FIELD(c.prioridade,'Urgente','Alta','Normal','Baixa'), c.criado_em DESC
         LIMIT 250`,
        values,
      );
      return res.json({ chamados: rows });
    }

    const [rows] = await db.execute(
      "SELECT c.*,t.nome tecnico_nome FROM chamados c LEFT JOIN usuarios t ON t.id=c.tecnico_id WHERE c.cliente_id=? ORDER BY c.criado_em DESC LIMIT 250",
      [req.user.id],
    );
    return res.json({ chamados: rows });
  } catch (error) {
    console.error("Lista:", error.code);
    return res.status(500).json({ mensagem: "Falha ao listar chamados." });
  }
});

app.get("/chamados/:id/historico", auth, async (req, res) => {
  const lookup = ticketLookup(req.params.id);
  try {
    const [ticketRows] = await db.execute(
      `SELECT c.id,c.cliente_id FROM chamados c WHERE ${lookup.sql} LIMIT 1`,
      [lookup.value],
    );
    const ticket = ticketRows[0];
    if (!ticket) return res.status(404).json({ mensagem: "Chamado não encontrado." });
    if (req.user.perfil === "cliente" && Number(ticket.cliente_id) !== Number(req.user.id)) {
      return res.status(404).json({ mensagem: "Chamado não encontrado." });
    }
    const [history] = await db.execute(
      `SELECT h.id,h.status_anterior,h.status_novo,h.mensagem,h.criado_em,
              u.nome autor_nome,u.perfil autor_perfil
       FROM historico_chamados h
       JOIN usuarios u ON u.id=h.autor_id
       WHERE h.chamado_id=?
       ORDER BY h.criado_em ASC,h.id ASC`,
      [ticket.id],
    );
    return res.json({ historico: history });
  } catch (error) {
    console.error("Histórico:", error.code);
    return res.status(500).json({ mensagem: "Falha ao consultar o histórico." });
  }
});

app.get("/tecnico/responsaveis", auth, technician, async (_req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id,nome,email FROM usuarios WHERE perfil='tecnico' AND ativo=1 ORDER BY nome ASC",
    );
    return res.json({ tecnicos: rows });
  } catch (error) {
    console.error("Responsáveis:", error.code);
    return res.status(500).json({ mensagem: "Falha ao listar técnicos." });
  }
});

app.patch("/chamados/:id", auth, technician, async (req, res) => {
  const lookup = ticketLookup(req.params.id);
  const body = req.body || {};
  const hasStatus = Object.prototype.hasOwnProperty.call(body, "status");
  const hasReply = Object.prototype.hasOwnProperty.call(body, "resposta");
  const hasTechnician = Object.prototype.hasOwnProperty.call(body, "tecnico_id");

  if (
    (!hasStatus && !hasReply && !hasTechnician) ||
    (hasStatus && !statuses.includes(body.status)) ||
    (hasReply && (typeof body.resposta !== "string" || body.resposta.length > 3000)) ||
    (hasTechnician && body.tecnico_id !== null &&
      (!Number.isSafeInteger(Number(body.tecnico_id)) || Number(body.tecnico_id) < 1))
  ) {
    return res.status(400).json({ mensagem: "Atualização inválida." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [ticketRows] = await connection.execute(
      `SELECT c.id,c.status,c.tecnico_id,c.resposta_tecnica FROM chamados c WHERE ${lookup.sql} FOR UPDATE`,
      [lookup.value],
    );
    const current = ticketRows[0];
    if (!current) {
      await connection.rollback();
      return res.status(404).json({ mensagem: "Chamado não encontrado." });
    }

    const currentTechnicianId = current.tecnico_id === null ? null : Number(current.tecnico_id);
    let nextTechnicianId = currentTechnicianId;
    let nextTechnicianName = null;
    if (hasTechnician) {
      nextTechnicianId = body.tecnico_id === null ? null : Number(body.tecnico_id);
      if (nextTechnicianId !== null) {
        const [technicians] = await connection.execute(
          "SELECT id,nome FROM usuarios WHERE id=? AND perfil='tecnico' AND ativo=1 LIMIT 1",
          [nextTechnicianId],
        );
        if (!technicians[0]) {
          await connection.rollback();
          return res.status(400).json({ mensagem: "O responsável selecionado não é um técnico ativo." });
        }
        nextTechnicianName = technicians[0].nome;
      }
    }

    const nextStatus = hasStatus ? body.status : current.status;
    const nextReply = hasReply ? body.resposta.trim() : current.resposta_tecnica;
    await connection.execute(
      "UPDATE chamados SET status=?,tecnico_id=?,resposta_tecnica=? WHERE id=?",
      [nextStatus, nextTechnicianId, nextReply || null, current.id],
    );

    if (hasStatus && nextStatus !== current.status) {
      await connection.execute(
        "INSERT INTO historico_chamados(chamado_id,autor_id,status_anterior,status_novo,mensagem) VALUES(?,?,?,?,?)",
        [current.id, req.user.id, current.status, nextStatus, `Status alterado de "${current.status}" para "${nextStatus}".`],
      );
    }
    if (hasTechnician && nextTechnicianId !== currentTechnicianId) {
      const message = nextTechnicianId === null
        ? "Responsável técnico removido do chamado."
        : `Chamado atribuído ao técnico ${nextTechnicianName}.`;
      await connection.execute(
        "INSERT INTO historico_chamados(chamado_id,autor_id,mensagem) VALUES(?,?,?)",
        [current.id, req.user.id, message],
      );
    }
    if (hasReply && body.resposta.trim() && body.resposta.trim() !== (current.resposta_tecnica || "")) {
      await connection.execute(
        "INSERT INTO historico_chamados(chamado_id,autor_id,mensagem) VALUES(?,?,?)",
        [current.id, req.user.id, "Resposta técnica registrada: " + body.resposta.trim()],
      );
    }

    await connection.commit();
    return res.json({ mensagem: "Chamado atualizado com sucesso." });
  } catch (error) {
    await connection.rollback();
    console.error("Atualização:", error.code);
    return res.status(500).json({ mensagem: "Falha ao atualizar chamado." });
  } finally {
    connection.release();
  }
});

app.get("/tecnico/resumo", auth, technician, async (_req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) total,SUM(status='Aguardando atendimento') aguardando,SUM(status='Em atendimento') andamento,SUM(status='Resolvido') resolvidos FROM chamados",
    );
    return res.json({ resumo: rows[0] });
  } catch (error) {
    console.error("Resumo:", error.code);
    return res.status(500).json({ mensagem: "Falha ao consultar indicadores." });
  }
});

app.use((error, _req, res, _next) => {
  console.error("API:", error.message);
  return res.status(500).json({ mensagem: "Erro interno do servidor." });
});

db.getConnection()
  .then((connection) => {
    connection.release();
    app.listen(PORT, () => console.log("G-TECH API ativa na porta " + PORT));
  })
  .catch((error) => {
    console.error("MySQL indisponível:", error.code);
    process.exit(1);
  });
