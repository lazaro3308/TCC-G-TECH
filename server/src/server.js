import 'dotenv/config';
import { createServer } from 'node:http';

const PORT = Number(process.env.PORT || 3000);

const server = createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/api/health') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({
      success: true,
      data: { service: 'G-TECH API', status: 'online' }
    }));
    return;
  }

  response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Rota não encontrada.' }
  }));
});

server.listen(PORT, () => {
  console.log(`G-TECH API disponível em http://localhost:${PORT}`);
});
