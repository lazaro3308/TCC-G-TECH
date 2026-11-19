require("dotenv").config();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

(async () => {
  const rl = readline.createInterface({ input, output });
  const nome = (await rl.question("Nome do técnico: ")).trim();
  const email = (await rl.question("E-mail do técnico: ")).trim().toLowerCase();
  const senha = await rl.question("Senha forte (mínimo 12 caracteres): ");
  rl.close();

  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || senha.length < 12) {
    console.error("Dados inválidos. Informe nome, e-mail válido e senha com pelo menos 12 caracteres.");
    process.exit(1);
  }

  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "g_tech_suporte"
  });

  try {
    const hash = await bcrypt.hash(senha, 12);
    await db.execute(
      "INSERT INTO usuarios (nome,email,senha_hash,perfil) VALUES (?,?,?,'tecnico')",
      [nome, email, hash]
    );
    console.log("Conta de técnico criada. Não compartilhe a senha.");
  } catch (error) {
    console.error(error.code === "ER_DUP_ENTRY" ? "Este e-mail já está cadastrado." : "Não foi possível criar a conta.");
    process.exitCode = 1;
  } finally {
    await db.end();
  }
})().catch(() => { console.error("Falha ao criar técnico."); process.exit(1); });
