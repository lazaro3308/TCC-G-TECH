const priorities = ["Baixa", "Normal", "Alta", "Urgente"];

function isValidEmail(email) {
  return typeof email === "string" &&
    email.length <= 190 &&
    /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

function validateTicketPayload(body) {
  const { titulo, categoria, prioridade, descricao } = body || {};
  if (
    typeof titulo !== "string" || titulo.trim().length < 4 || titulo.length > 160 ||
    typeof categoria !== "string" || categoria.trim().length < 2 || categoria.length > 80 ||
    !priorities.includes(prioridade) ||
    typeof descricao !== "string" || descricao.trim().length < 10 || descricao.length > 5000
  ) {
    return "Revise os dados do chamado.";
  }
  return null;
}

function isAllowedClientOrigin(requestOrigin, configuredOrigin, production = false) {
  if (!requestOrigin) return true;
  if (requestOrigin === configuredOrigin) return true;
  if (production) return false;

  try {
    const parsed = new URL(requestOrigin);
    return parsed.origin === requestOrigin &&
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");
  } catch {
    return false;
  }
}

module.exports = { isValidEmail, validateTicketPayload, isAllowedClientOrigin };
