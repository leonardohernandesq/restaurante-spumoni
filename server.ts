// server.js
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

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
    createServer(httpsOptions, (req: { url: any; }, res: any) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, () => {
        console.log(`✅ HTTPS rodando em https://${hostname}:${port}`);
    });
});
