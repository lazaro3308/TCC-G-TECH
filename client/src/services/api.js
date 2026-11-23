export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(API_URL + path, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({ mensagem: "Resposta inválida do servidor." }));
  if (!response.ok) throw new Error(data.mensagem || "Falha na comunicação com o servidor.");
  return data;
}

export const getSession = () => {
  try { return JSON.parse(sessionStorage.getItem("gtech_user")); }
  catch { return null; }
};
export const saveSession = user => sessionStorage.setItem("gtech_user", JSON.stringify(user));
export const clearSession = () => sessionStorage.removeItem("gtech_user");

export async function login(email, senha, perfil) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha, perfil }),
  });
  const user = { ...data.usuario, name: data.usuario.nome };
  saveSession(user);
  return user;
}
export async function registerClient(data) {
  const result = await apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) });
  const user = { ...result.usuario, name: result.usuario.nome };
  saveSession(user);
  return user;
}
export async function requestTechnicianAccount(data) {
  return apiRequest("/auth/register-technician", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function getTechnicianRequests(status = "pendente") {
  return (await apiRequest("/admin/solicitacoes?status=" + encodeURIComponent(status))).solicitacoes || [];
}
export async function decideTechnicianRequest(id, decisao, motivo = "") {
  return apiRequest("/admin/solicitacoes/" + encodeURIComponent(id), {
    method: "PATCH",
    body: JSON.stringify({ decisao, motivo }),
  });
}
export async function getAdminTechnicians() {
  return (await apiRequest("/admin/tecnicos")).tecnicos || [];
}
export async function restoreSession() {
  const data = await apiRequest("/auth/me");
  const user = { ...data.usuario, name: data.usuario.nome };
  saveSession(user);
  return user;
}
export async function logout() {
  try { await apiRequest("/auth/logout", { method: "POST" }); }
  finally { clearSession(); }
}

export async function getTickets(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "Todos") params.set(key, value);
  });
  const query = params.toString();
  const rows = (await apiRequest("/chamados" + (query ? `?${query}` : ""))).chamados || [];
  return rows.map(ticket => ({
    ...ticket,
    id: ticket.codigo || String(ticket.id),
    title: ticket.titulo,
    category: ticket.categoria,
    priority: ticket.prioridade,
    description: ticket.descricao,
    date: ticket.criado_em ? String(ticket.criado_em).slice(0, 10) : "",
    updates: 0,
  }));
}
export async function getTicketHistory(id) {
  return (await apiRequest(`/chamados/${encodeURIComponent(id)}/historico`)).historico || [];
}
export async function getTechnicians() {
  return (await apiRequest("/tecnico/responsaveis")).tecnicos || [];
}
export async function createTicket(data) {
  const ticket = (await apiRequest("/chamados", {
    method: "POST",
    body: JSON.stringify({
      titulo: data.title,
      categoria: data.category,
      prioridade: data.priority,
      descricao: data.description,
    }),
  })).chamado;
  return {
    ...ticket,
    id: ticket.codigo || String(ticket.id),
    title: ticket.titulo,
    description: ticket.descricao,
    date: new Date().toISOString().slice(0, 10),
    updates: 0,
  };
}
export function saveTickets() { /* Chamados são persistidos exclusivamente pela API/MySQL. */ }
export function updateProfile() {
  throw new Error("Atualização de perfil será habilitada por endpoint autenticado.");
}
