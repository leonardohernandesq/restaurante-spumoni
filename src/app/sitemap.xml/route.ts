import { api } from "@/config/api";

export async function GET() {
  const baseUrl = "https://restaurantespumoni.com.br/api/public";

  try {
    const response = await api.get("/products");
    const produtos = response.data;

    if (!Array.isArray(produtos)) {
      throw new Error("A resposta da API de produtos não é um array.");
    }

    const urls = produtos
      .map((produto: { slug: string; updatedAt: string }) => {
        const lastModDate = new Date(produto.updatedAt);

        const lastModISOString = isNaN(lastModDate.getTime())
          ? new Date().toISOString()
          : lastModDate.toISOString();

        return `
          <url>
            <loc>${baseUrl}/produto/${produto.slug}</loc>
            <lastmod>${lastModISOString}</lastmod>
            <priority>0.80</priority>
          </url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl}/</loc>
          <priority>1.00</priority>
        </url>
        ${urls}
      </urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error: unknown) {
    console.error("Erro ao gerar sitemap:", error);
    return new Response("Erro ao gerar sitemap.", { status: 500 });
  }
}
