import { Server as WebSocketServer, WebSocket } from 'ws';
import { Server as HTTPSServer } from 'https';

let wss: WebSocketServer;

export function initWebSocketServer(server: HTTPSServer) {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Cliente conectado via WebSocket');

    ws.send(JSON.stringify({ tipo: 'conexao', mensagem: 'Bem-vindo!' }));

    const interval = setInterval(() => {
      ws.send(JSON.stringify({ tipo: 'updatePedidos' }));
    }, 5000);

    ws.on('close', () => {
      console.log('Cliente desconectado');
      clearInterval(interval);
    });
  });
}

export function broadcast(data: any) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
