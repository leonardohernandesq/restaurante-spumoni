import { NextApiRequest, NextApiResponse } from "next";

const Sitemap = async (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl = "https://lhdev.com.br/restaurante/public/";

  // 1️⃣ Buscar produtos dinamicamente (API fictícia)
  const produtos = await fetch(`${baseUrl}/products`).then((res) => res.json());

  // 2️⃣ Criar lista de URLs dinâmicas
  const urls = produtos
    .map(
      (produto: { slug: string; updatedAt: string }) => `
    <url>
      <loc>${baseUrl}/produto/${produto.slug}</loc>
      <lastmod>${new Date(produto.updatedAt).toISOString()}</lastmod>
      <priority>0.80</priority>
    </url>`
    )
    .join("");

  // 3️⃣ Criar estrutura do sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}/</loc>
      <priority>1.00</priority>
    </url>
    <url>
      <loc>${baseUrl}/about</loc>
      <priority>0.80</priority>
    </url>
    ${urls}
  </urlset>`;

  // 4️⃣ Definir headers e enviar XML
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
};

export default Sitemap;
