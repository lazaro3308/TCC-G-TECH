const test = require("node:test");
const assert = require("node:assert/strict");
const {
  isValidEmail,
  validateTicketPayload,
  isAllowedClientOrigin,
} = require("../utils/validation");

test("valida e-mails sem aceitar valores inválidos", () => {
  assert.equal(isValidEmail("tecnico@gtech.com"), true);
  assert.equal(isValidEmail("email-invalido"), false);
  assert.equal(isValidEmail(""), false);
  assert.equal(isValidEmail("a".repeat(191) + "@gtech.com"), false);
});

test("aceita chamados completos dentro dos limites da API", () => {
  assert.equal(validateTicketPayload({
    titulo: "Computador não inicia",
    categoria: "Hardware",
    prioridade: "Alta",
    descricao: "O computador não inicia desde hoje pela manhã.",
  }), null);
});

test("rejeita chamados incompletos ou com prioridade inválida", () => {
  assert.equal(validateTicketPayload({}), "Revise os dados do chamado.");
  assert.equal(validateTicketPayload({
    titulo: "Falha",
    categoria: "Hardware",
    prioridade: "Crítica",
    descricao: "Descrição suficientemente longa para o teste.",
  }), "Revise os dados do chamado.");
});

test("aceita a origem configurada e portas locais alternativas no desenvolvimento", () => {
  assert.equal(isAllowedClientOrigin("http://localhost:5173", "http://localhost:5173"), true);
  assert.equal(isAllowedClientOrigin("http://localhost:5175", "http://localhost:5173"), true);
  assert.equal(isAllowedClientOrigin("http://127.0.0.1:5175", "http://localhost:5173"), true);
});

test("bloqueia origens externas e portas alternativas em produção", () => {
  assert.equal(isAllowedClientOrigin("https://site-malicioso.example", "http://localhost:5173"), false);
  assert.equal(isAllowedClientOrigin("http://localhost:5175", "https://app.gtech.example", true), false);
});
