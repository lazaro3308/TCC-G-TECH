const { spawn } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const mysql = require("mysql2/promise");
const assert = require("node:assert/strict");

const root = join(__dirname, "..");
const serverEntry = join(root, "index.js");
const port = Number(process.env.TEST_PORT || 3317);
const baseUrl = `http://127.0.0.1:${port}`;
const jwtSecret = "gtech-integration-test-secret-32-characters-minimum";

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

    const customerResponse = await fetch(baseUrl + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:5175" },
      body: JSON.stringify({
        nome: "Cliente Teste",
        email: "cliente.integracao@gtech.test",
        senha: "SenhaCliente123!",
      }),
    });
    assert.equal(customerResponse.status, 201, await customerResponse.text());
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
    assert.equal(ticketResponse.status, 201, await ticketResponse.text());
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
    assert.equal(technicianResponse.status, 201, await technicianResponse.text());
    const technicianPayload = await technicianResponse.json();
    assert.equal(technicianPayload.usuario.perfil, "tecnico");
    const technicianCookie = cookieFrom(technicianResponse);

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
    child.kill("SIGTERM");
    await new Promise(resolve => child.once("exit", resolve));
    if (logs && process.env.DEBUG_INTEGRATION === "1") console.log(logs);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
