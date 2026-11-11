const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function createTicket({ empresa, email, problema }) {
  let response;
  try {
    response = await fetch(`${API_URL}/chamados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresa, email, problema }),
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Confira se o servidor está ativo em http://localhost:3000.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível registrar o chamado.');
  }
  return data;
}

export { API_URL };
