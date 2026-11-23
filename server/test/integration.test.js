const { spawn } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const assert = require("node:assert/strict");

const root = join(__dirname, "..");
const serverEntry = join(root, "index.js");
const port = Number(process.env.TEST_PORT || 3317);
const baseUrl = `http://127.0.0.1:${port}`;
const jwtSecret = "gtech-integration-test-secret-32-characters-minimum";

async function expectStatus(response, expected) {
  if (response.status !== expected) {
    throw new Error(`Esperado HTTP ${expected}, recebido ${response.status}: ${await response.text()}`);
  }
}

function cookieFrom(response) {
  const cookies = response.headers.getSetCookie?.() || [];
  const session = cookies.find(value => value.startsWith("gtech_session="));
  assert.ok(session, "A API deve definir o cookie de sessão.");
  return session.split(";")[0];
}

async function waitForServer(child) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error("A API encerrou antes de iniciar.");
    try {
      const response = await fetch(baseUrl + "/health");
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("A API não iniciou dentro do tempo esperado.");
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    multipleStatements: true,
  });
  try {
    await connection.query(readFileSync(join(root, "database", "schema.sql"), "utf8"));
    const pendingHash = await bcrypt.hash("SenhaPendente123!", 12);
    await connection.execute(
      "INSERT INTO solicitacoes_tecnicos(nome,email,senha_hash,telefone,status) VALUES(?,?,?,?, 'pendente')",
      ["Técnico Migrado", "tecnico.migrado@gtech.test", pendingHash, null],
    );
    await connection.query(readFileSync(join(root, "database", "migrations", "004_ativar_solicitacoes_tecnicos.sql"), "utf8"));
    const [migrated] = await connection.execute(
      "SELECT perfil,ativo FROM usuarios WHERE email=? LIMIT 1",
      ["tecnico.migrado@gtech.test"],
    );
    assert.equal(migrated[0]?.perfil, "tecnico");
    assert.equal(Number(migrated[0]?.ativo), 1);
  } finally {
    await connection.end();
  }

  const child = spawn(process.execPath, [serverEntry], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "test",
      PORT: String(port),
      DB_HOST: process.env.DB_HOST || "127.0.0.1",
      DB_PORT: process.env.DB_PORT || "3306",
      DB_USER: process.env.DB_USER || "root",
      DB_PASSWORD: process.env.DB_PASSWORD || "password",
      DB_NAME: "g_tech_suporte",
      JWT_SECRET: process.env.JWT_SECRET || jwtSecret,
      CLIENT_ORIGIN: "http://localhost:5173",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.on("data", chunk => { logs += chunk.toString(); });
  child.stderr.on("data", chunk => { logs += chunk.toString(); });

  try {
    await waitForServer(child);

    const migratedLogin = await fetch(baseUrl + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "tecnico.migrado@gtech.test",
        senha: "SenhaPendente123!",
        perfil: "tecnico",
      }),
    });
    await expectStatus(migratedLogin, 200);

    const customerResponse = await fetch(baseUrl + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:5175" },
      body: JSON.stringify({
        nome: "Cliente Teste",
        email: "cliente.integracao@gtech.test",
        senha: "SenhaCliente123!",
      }),
    });
    await expectStatus(customerResponse, 201);
    const customerCookie = cookieFrom(customerResponse);

    const ticketResponse = await fetch(baseUrl + "/chamados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:5175",
        Cookie: customerCookie,
      },
      body: JSON.stringify({
        titulo: "Computador não inicia",
        categoria: "Hardware",
        prioridade: "Alta",
        descricao: "O computador de teste não inicia após ser ligado.",
      }),
    });
    await expectStatus(ticketResponse, 201);
    const ticketPayload = await ticketResponse.json();
    assert.ok(ticketPayload.chamado.codigo.startsWith("GT-"));

    const technicianResponse = await fetch(baseUrl + "/auth/register-technician", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:5175" },
      body: JSON.stringify({
        nome: "Técnico Teste",
        email: "tecnico.integracao@gtech.test",
        senha: "SenhaTecnico123!",
        telefone: "38999990000",
      }),
    });
    await expectStatus(technicianResponse, 201);
    const technicianPayload = await technicianResponse.json();
    assert.equal(technicianPayload.usuario.perfil, "tecnico");
    const technicianCookie = cookieFrom(technicianResponse);

    const technicianLogin = await fetch(baseUrl + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "tecnico.integracao@gtech.test",
        senha: "SenhaTecnico123!",
        perfil: "tecnico",
      }),
    });
    await expectStatus(technicianLogin, 200);
    assert.equal((await technicianLogin.json()).usuario.perfil, "tecnico");

    const queueResponse = await fetch(baseUrl + "/chamados", {
      headers: { Cookie: technicianCookie },
    });
    assert.equal(queueResponse.status, 200);
    const queue = await queueResponse.json();
    assert.ok(queue.chamados.some(ticket => ticket.codigo === ticketPayload.chamado.codigo));

    const duplicateResponse = await fetch(baseUrl + "/auth/register-technician", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:5175" },
      body: JSON.stringify({
        nome: "Técnico Duplicado",
        email: "tecnico.integracao@gtech.test",
        senha: "SenhaTecnico456!",
      }),
    });
    assert.equal(duplicateResponse.status, 409);

    const blockedOrigin = await fetch(baseUrl + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://origem-invalida.example" },
      body: JSON.stringify({
        nome: "Origem Inválida",
        email: "origem.invalida@gtech.test",
        senha: "SenhaInvalida123!",
      }),
    });
    assert.equal(blockedOrigin.status, 403);

    console.log("Integração aprovada: cadastro de cliente, abertura de chamado, cadastro/login direto de técnico, fila técnica, duplicidade e política de origem.");
  } finally {
    if (child.exitCode === null) {
      await new Promise(resolve => {
        child.once("exit", resolve);
        child.kill("SIGTERM");
      });
    }
    if (logs && process.env.DEBUG_INTEGRATION === "1") console.log(logs);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
