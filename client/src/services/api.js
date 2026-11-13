
export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const seed = [
  {
    id: "GT-2026-001",
    title: "Computador não inicia",
    category: "Hardware",
    priority: "Alta",
    status: "Em atendimento",
    date: "2026-11-08",
    description: "O computador liga, mas não conclui a inicialização.",
    updates: 3
  },
  {
    id: "GT-2026-002",
    title: "Instalação de software",
    category: "Software",
    priority: "Normal",
    status: "Aguardando atendimento",
    date: "2026-11-06",
    description: "Solicito a instalação de um aplicativo de trabalho.",
    updates: 1
  },
  {
    id: "GT-2026-003",
    title: "Instabilidade na conexão",
    category: "Rede e Internet",
    priority: "Baixa",
    status: "Resolvido",
    date: "2026-11-02",
    description: "A conexão apresenta quedas durante o expediente.",
    updates: 4
  }
];

export const getTickets = () => read("gtech_tickets", seed);
export const saveTickets = value => write("gtech_tickets", value);

export const getSession = () => read("gtech_session", null);
export const saveSession = value => write("gtech_session", value);
export const clearSession = () => localStorage.removeItem("gtech_session");

export async function createTicket(data, user = {}) {
  const ticket = {
    id: `GT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
    title: data.title.trim(),
    category: data.category,
    priority: data.priority,
    status: "Aguardando atendimento",
    date: new Date().toISOString().slice(0, 10),
    description: data.description.trim(),
    updates: 0,
    apiSynced: false
  };

  try {
   
const response = await fetch(`${API_URL}/chamados`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: ticket.title,
    category: ticket.category,
    priority: ticket.priority,
    description: ticket.description,
    empresa: user.company || user.empresa || "Cliente G-TECH",
    email: user.email || ""
  })
});

if (!response.ok) {
  throw new Error("Erro ao enviar chamado para o servidor.");
}

const resultado = await response.json();

console.log("Resposta do servidor:", resultado);

ticket.apiSynced = true;

  } catch (error) {
   console.error("Falha na API:", error);
    throw error;
  }

  const tickets = getTickets();
  saveTickets([ticket, ...tickets]);

  return ticket;
}

export function updateProfile(profile) {
  saveSession({
    ...(getSession() || {}),
    ...profile
  });
}
