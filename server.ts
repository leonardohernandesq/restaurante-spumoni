import { createServer } from "https";
import { parse } from "url";
import next from "next";
import fs from "fs";
import path from "path";

const port = 3000;
const dev = true;
const hostname = process.env.DEV_INTEGRATION_URL;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const certPath = path.join(process.cwd(), "certs", `${hostname}.pem`);
const keyPath = path.join(process.cwd(), "certs", `${hostname}-key.pem`);

try {
  fs.accessSync(certPath, fs.constants.R_OK);
  fs.accessSync(keyPath, fs.constants.R_OK);
  console.log("✅ Certificados encontrados!");
} catch (err) {
  console.error("❌ Erro ao acessar os certificados:", err);
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

app.prepare().then(() => {
  const server = createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, () => {
    console.log(`✅ HTTPS rodando em https://${hostname}:${port}`);
  });
});
