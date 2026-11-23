require("dotenv").config();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

(async () => {
  const rl = readline.createInterface({ input, output });
  const nome = (await rl.question("Nome do administrador: ")).trim();
  const email = (await rl.question("E-mail: ")).trim().toLowerCase();
  const senha = await rl.question("Senha forte (mínimo 12 caracteres): ");
  rl.close();

  if (nome.length < 2 || nome.length > 120 ||
      !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) ||
      senha.length < 12 || senha.length > 128) {
    console.error("Dados inválidos. Confira nome, e-mail e senha.");
    process.exit(1);
  }

  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "g_tech_suporte",
  });

  try {
    const [admins] = await db.execute("SELECT id FROM usuarios WHERE perfil='admin' LIMIT 1");
    if (admins.length) {
      console.error("Já existe um administrador. A criação adicional foi bloqueada.");
      process.exitCode = 1;
      return;
    }
    const hash = await bcrypt.hash(senha, 12);
    await db.execute(
      "INSERT INTO usuarios(nome,email,senha_hash,perfil,ativo) VALUES(?,?,?,'admin',1)",
      [nome, email, hash],
    );
    console.log("Administrador inicial criado com sucesso.");
  } catch (error) {
    console.error(error.code === "ER_DUP_ENTRY" ? "Este e-mail já está cadastrado." : "Falha ao criar administrador.");
    process.exitCode = 1;
  } finally {
    await db.end();
  }
})().catch(() => {
  console.error("Não foi possível criar o administrador. Confira a conexão com o MySQL.");
  process.exit(1);
});
