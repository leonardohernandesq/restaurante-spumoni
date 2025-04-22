// server.ts
import { createServer } from 'https';
import { parse } from 'url';
import next from 'next';
import fs from 'fs';
import path from 'path';
import { initWebSocketServer } from './websocket-server';

const port = 3000;
const dev = true;
const hostname = 'admin.lhdev.com.br';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'admin.lhdev.com.br-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'admin.lhdev.com.br.pem')),
};

app.prepare().then(() => {
  const server = createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  initWebSocketServer(server); // 🔥 Inicializa WebSocket

  server.listen(port, () => {
    console.log(`✅ HTTPS rodando em https://${hostname}:${port}`);
  });
});
