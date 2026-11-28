"use client";

import type { Estatisticas } from "@/domain/estatisticas";
import { CartaoGrafico, GraficoBarras, GraficoLinha, TabelaDados, fmt } from "./graficos";
import { Indicador } from "./Indicador";
import { AJUDA } from "./ajudas";

interface AbaProps {
  e: Estatisticas;
  /** Ex.: "mês anterior", para os comparativos. */
  nomeAnterior: string;
}

const TOP = 10;

const Vazio = ({ texto = "Nenhum pedido no período." }: { texto?: string }) => (
  <p className="py-8 text-center text-zinc-600">{texto}</p>
);

const nomeGranularidade = { dia: "por dia", semana: "por semana", mes: "por mês" } as const;

const Grade = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-4 lg:grid-cols-2">{children}</div>
);

/* ---------- Visão geral ---------- */

export const AbaVisaoGeral = ({ e, nomeAnterior }: AbaProps) => {
  const r = e.resumo;
  const a = e.anterior;
  const melhorDia = [...e.diasSemana].sort((x, y) => y.mediaPedidos - x.mediaPedidos)[0];
  const pratoTop = e.pratos[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Indicador
          titulo="Faturamento"
          ajuda={AJUDA.faturamento}
          valor={fmt.moeda(r.faturamento)}
          variacao={e.variacao.faturamento}
          anterior={nomeAnterior}
        />
        <Indicador
          titulo="Pedidos"
          ajuda={AJUDA.pedidos}
          valor={fmt.inteiro(r.pedidos)}
          detalhe={`${fmt.decimal(r.pedidosPorDia)} por dia`}
          variacao={e.variacao.pedidos}
          anterior={nomeAnterior}
        />
        <Indicador
          titulo="Ticket médio"
          ajuda={AJUDA.ticketMedio}
          valor={fmt.moeda(r.ticketMedio)}
          variacao={e.variacao.ticketMedio}
          anterior={nomeAnterior}
        />
        <Indicador
          titulo="Cancelamentos"
          ajuda={AJUDA.cancelamentos}
          valor={fmt.percentual(r.taxaCancelamento)}
          detalhe={`${fmt.inteiro(r.cancelados)} pedidos · ${fmt.moeda(r.valorCancelado)}`}
          variacao={
            a.taxaCancelamento > 0 ? (r.taxaCancelamento - a.taxaCancelamento) / a.taxaCancelamento : null
          }
          subirEhRuim
          anterior={nomeAnterior}
        />
      </div>

      {r.pedidos === 0 ? (
        <Vazio />
      ) : (
        <>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <Indicador
              titulo="Em produtos"
              ajuda={AJUDA.emProdutos}
              valor={fmt.moeda(r.faturamentoProdutos)}
              detalhe={`${fmt.inteiro(r.itensVendidos)} itens vendidos`}
            />
            <Indicador
              titulo="Taxas de entrega"
              ajuda={AJUDA.taxasEntrega}
              valor={fmt.moeda(r.taxasEntrega)}
              detalhe={`${fmt.percentual(r.faturamento ? r.taxasEntrega / r.faturamento : 0)} do faturamento`}
            />
            <Indicador
              titulo="Prato mais vendido"
              ajuda={AJUDA.pratoTop}
              valor={pratoTop?.nome ?? "—"}
              detalhe={pratoTop ? `${fmt.inteiro(pratoTop.quantidade)} unidades` : undefined}
            />
            <Indicador
              titulo="Melhor dia da semana"
              ajuda={AJUDA.melhorDia}
              valor={melhorDia?.mediaPedidos ? melhorDia.label : "—"}
              detalhe={
                melhorDia?.mediaPedidos
                  ? `${fmt.decimal(melhorDia.mediaPedidos)} pedidos em média`
                  : undefined
              }
            />
          </div>

          <CartaoGrafico
            titulo={`Faturamento ${nomeGranularidade[e.granularidade]}`}
            ajuda={AJUDA.serieFaturamento}
            tabela={{
              linhas: e.serie,
              chave: (p) => p.chave,
              colunas: [
                { titulo: "Período", valor: (p) => p.detalhe },
                { titulo: "Pedidos", valor: (p) => fmt.inteiro(p.pedidos), numerico: true },
                { titulo: "Faturamento", valor: (p) => fmt.moeda(p.faturamento), numerico: true },
              ],
            }}
          >
            <GraficoLinha
              dados={e.serie}
              categoria="label"
              valor="faturamento"
              formato={fmt.moeda}
              rotuloValor="Faturamento"
              extras={{ pedidos: { rotulo: "Pedidos", formato: fmt.inteiro } }}
            />
          </CartaoGrafico>

          <Grade>
            <CartaoGrafico titulo="Faturamento por forma de pagamento" ajuda={AJUDA.pagamentos}>
              <GraficoBarras
                dados={e.pagamentos}
                categoria="label"
                valor="faturamento"
                formato={fmt.moeda}
                rotuloValor="Faturamento"
                extras={{ pedidos: { rotulo: "Pedidos", formato: fmt.inteiro } }}
                horizontal
              />
            </CartaoGrafico>
            <CartaoGrafico
              titulo="Entrega x retirada"
              ajuda={AJUDA.tiposEntrega}
              descricao={`${fmt.inteiro(r.agendados)} pedidos agendados no período`}
            >
              <GraficoBarras
                dados={e.tiposEntrega}
                categoria="label"
                valor="pedidos"
                formato={fmt.inteiro}
                rotuloValor="Pedidos"
                extras={{ faturamento: { rotulo: "Faturamento", formato: fmt.moeda } }}
                horizontal
              />
            </CartaoGrafico>
          </Grade>
        </>
      )}
    </div>
  );
};

/* ---------- Faturamento ---------- */

export const AbaFaturamento = ({ e }: AbaProps) => {
  if (e.resumo.pedidos === 0) return <Vazio />;
  const melhor = [...e.serie].sort((x, y) => y.faturamento - x.faturamento)[0];

  return (
    <div className="flex flex-col gap-4">
      <CartaoGrafico
        titulo={`Faturamento ${nomeGranularidade[e.granularidade]}`}
        ajuda={AJUDA.serieFaturamento}
        descricao={melhor ? `Melhor: ${melhor.label} (${fmt.moeda(melhor.faturamento)})` : undefined}
      >
        <GraficoBarras
          dados={e.serie}
          categoria="label"
          valor="faturamento"
          formato={fmt.moeda}
          rotuloValor="Faturamento"
          extras={{ pedidos: { rotulo: "Pedidos", formato: fmt.inteiro } }}
          mostrarValores={e.serie.length <= 14}
          altura={300}
        />
      </CartaoGrafico>

      <CartaoGrafico titulo={`Pedidos ${nomeGranularidade[e.granularidade]}`} ajuda={AJUDA.seriePedidos}>
        <GraficoBarras
          dados={e.serie}
          categoria="label"
          valor="pedidos"
          formato={fmt.inteiro}
          rotuloValor="Pedidos"
          mostrarValores={e.serie.length <= 14}
        />
      </CartaoGrafico>

      <CartaoGrafico
        titulo="Faturamento por categoria"
        ajuda={AJUDA.categorias}
        tabela={{
          linhas: e.categorias,
          chave: (c) => c.nome,
          colunas: [
            { titulo: "Categoria", valor: (c) => c.nome },
            { titulo: "Itens", valor: (c) => fmt.inteiro(c.quantidade), numerico: true },
            { titulo: "Faturamento", valor: (c) => fmt.moeda(c.faturamento), numerico: true },
            {
              titulo: "% dos produtos",
              valor: (c) =>
                fmt.percentual(e.resumo.faturamentoProdutos ? c.faturamento / e.resumo.faturamentoProdutos : 0),
              numerico: true,
            },
          ],
        }}
      >
        <GraficoBarras
          dados={e.categorias}
          categoria="nome"
          valor="faturamento"
          formato={fmt.moeda}
          rotuloValor="Faturamento"
          extras={{ quantidade: { rotulo: "Itens", formato: fmt.inteiro } }}
          horizontal
        />
      </CartaoGrafico>

      <TabelaDados
        aberta
        linhas={e.serie}
        chave={(p) => p.chave}
        colunas={[
          { titulo: "Período", valor: (p) => p.label },
          { titulo: "Pedidos", valor: (p) => fmt.inteiro(p.pedidos), numerico: true },
          { titulo: "Faturamento", valor: (p) => fmt.moeda(p.faturamento), numerico: true },
          {
            titulo: "Ticket médio",
            valor: (p) => (p.pedidos ? fmt.moeda(p.faturamento / p.pedidos) : "—"),
            numerico: true,
          },
        ]}
      />
    </div>
  );
};

/* ---------- Pratos ---------- */

export const AbaPratos = ({ e }: AbaProps) => {
  if (!e.pratos.length) return <Vazio />;
  const porFaturamento = [...e.pratos].sort((x, y) => y.faturamento - x.faturamento).slice(0, TOP);

  return (
    <div className="flex flex-col gap-4">
      <Grade>
        <CartaoGrafico titulo={`Top ${TOP} em quantidade`} ajuda={AJUDA.topQuantidade}>
          <GraficoBarras
            dados={e.pratos.slice(0, TOP)}
            categoria="nome"
            valor="quantidade"
            formato={fmt.inteiro}
            rotuloValor="Unidades"
            extras={{ faturamento: { rotulo: "Faturamento", formato: fmt.moeda } }}
            horizontal
          />
        </CartaoGrafico>
        <CartaoGrafico titulo={`Top ${TOP} em faturamento`} ajuda={AJUDA.topFaturamento}>
          <GraficoBarras
            dados={porFaturamento}
            categoria="nome"
            valor="faturamento"
            formato={fmt.moeda}
            rotuloValor="Faturamento"
            extras={{ quantidade: { rotulo: "Unidades", formato: fmt.inteiro } }}
            horizontal
          />
        </CartaoGrafico>
      </Grade>

      <CartaoGrafico titulo="Todos os produtos vendidos" descricao="Ordenados por quantidade." ajuda={AJUDA.todosProdutos}>
        <TabelaDados
          aberta
          linhas={e.pratos}
          chave={(p) => p.produtoId}
          colunas={[
            { titulo: "Produto", valor: (p) => p.nome },
            { titulo: "Categoria", valor: (p) => p.categoria },
            { titulo: "Unidades", valor: (p) => fmt.inteiro(p.quantidade), numerico: true },
            { titulo: "Pedidos", valor: (p) => fmt.inteiro(p.pedidos), numerico: true },
            { titulo: "Faturamento", valor: (p) => fmt.moeda(p.faturamento), numerico: true },
            {
              titulo: "% do total",
              valor: (p) =>
                fmt.percentual(e.resumo.faturamentoProdutos ? p.faturamento / e.resumo.faturamentoProdutos : 0),
              numerico: true,
            },
          ]}
        />
      </CartaoGrafico>
    </div>
  );
};

/* ---------- Dias e horários ---------- */

export const AbaDiasHorarios = ({ e }: AbaProps) => {
  if (e.resumo.pedidos === 0) return <Vazio />;
  const pico = [...e.horas].sort((x, y) => y.pedidos - x.pedidos)[0];

  return (
    <div className="flex flex-col gap-4">
      <Grade>
        <CartaoGrafico
          titulo="Média de pedidos por dia da semana"
          ajuda={AJUDA.mediaPedidosDia}
          descricao="Total do dia dividido por quantas vezes ele aparece no período."
          tabela={{
            linhas: e.diasSemana,
            chave: (d) => d.dia,
            colunas: [
              { titulo: "Dia", valor: (d) => d.label },
              { titulo: "Pedidos", valor: (d) => fmt.inteiro(d.pedidos), numerico: true },
              { titulo: "Média/dia", valor: (d) => fmt.decimal(d.mediaPedidos), numerico: true },
              { titulo: "Faturamento", valor: (d) => fmt.moeda(d.faturamento), numerico: true },
              { titulo: "Média/dia (R$)", valor: (d) => fmt.moeda(d.mediaFaturamento), numerico: true },
            ],
          }}
        >
          <GraficoBarras
            dados={e.diasSemana}
            categoria="label"
            valor="mediaPedidos"
            formato={fmt.decimal}
            rotuloValor="Média de pedidos"
            extras={{ pedidos: { rotulo: "Total de pedidos", formato: fmt.inteiro } }}
          />
        </CartaoGrafico>
        <CartaoGrafico titulo="Faturamento médio por dia da semana" ajuda={AJUDA.mediaFaturamentoDia}>
          <GraficoBarras
            dados={e.diasSemana}
            categoria="label"
            valor="mediaFaturamento"
            formato={fmt.moeda}
            rotuloValor="Média de faturamento"
            extras={{ faturamento: { rotulo: "Total", formato: fmt.moeda } }}
          />
        </CartaoGrafico>
      </Grade>

      <CartaoGrafico
        titulo="Pedidos por horário"
        ajuda={AJUDA.horas}
        descricao={pico ? `Pico às ${pico.label} (${fmt.inteiro(pico.pedidos)} pedidos)` : undefined}
        tabela={{
          linhas: e.horas,
          chave: (h) => h.hora,
          colunas: [
            { titulo: "Horário", valor: (h) => h.label },
            { titulo: "Pedidos", valor: (h) => fmt.inteiro(h.pedidos), numerico: true },
            { titulo: "Faturamento", valor: (h) => fmt.moeda(h.faturamento), numerico: true },
          ],
        }}
      >
        <GraficoBarras
          dados={e.horas}
          categoria="label"
          valor="pedidos"
          formato={fmt.inteiro}
          rotuloValor="Pedidos"
          extras={{ faturamento: { rotulo: "Faturamento", formato: fmt.moeda } }}
        />
      </CartaoGrafico>
    </div>
  );
};

/* ---------- Clientes e bairros ---------- */

export const AbaClientes = ({ e, nomeAnterior }: AbaProps) => {
  const r = e.resumo;
  if (r.pedidos === 0) return <Vazio />;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Indicador
          titulo="Clientes diferentes"
          ajuda={AJUDA.clientesUnicos}
          valor={fmt.inteiro(r.clientesUnicos)}
          variacao={
            e.anterior.clientesUnicos
              ? (r.clientesUnicos - e.anterior.clientesUnicos) / e.anterior.clientesUnicos
              : null
          }
          anterior={nomeAnterior}
        />
        <Indicador
          titulo="Voltaram no período"
          ajuda={AJUDA.recorrentes}
          valor={fmt.inteiro(r.clientesRecorrentes)}
          detalhe="clientes com 2 ou mais pedidos"
        />
        <Indicador
          titulo="Pedidos de quem voltou"
          ajuda={AJUDA.pedidosDeRecorrentes}
          valor={fmt.percentual(r.pedidosDeRecorrentes)}
          detalhe="do total de pedidos"
        />
        <Indicador
          titulo="Pedidos por cliente"
          ajuda={AJUDA.pedidosPorCliente}
          valor={fmt.decimal(r.clientesUnicos ? r.pedidos / r.clientesUnicos : 0)}
          detalhe="em média"
        />
      </div>

      {e.bairros.length === 0 ? (
        <Vazio texto="Nenhuma entrega no período." />
      ) : (
        <CartaoGrafico
          titulo={`Bairros com mais entregas (top ${TOP})`}
          ajuda={AJUDA.bairros}
          tabela={{
            linhas: e.bairros,
            chave: (b) => b.nome,
            colunas: [
              { titulo: "Bairro", valor: (b) => b.nome },
              { titulo: "Pedidos", valor: (b) => fmt.inteiro(b.pedidos), numerico: true },
              { titulo: "Faturamento", valor: (b) => fmt.moeda(b.faturamento), numerico: true },
              { titulo: "Taxas", valor: (b) => fmt.moeda(b.taxas), numerico: true },
              {
                titulo: "Ticket médio",
                valor: (b) => fmt.moeda(b.faturamento / b.pedidos),
                numerico: true,
              },
            ],
          }}
        >
          <GraficoBarras
            dados={e.bairros.slice(0, TOP)}
            categoria="nome"
            valor="pedidos"
            formato={fmt.inteiro}
            rotuloValor="Pedidos"
            extras={{ faturamento: { rotulo: "Faturamento", formato: fmt.moeda } }}
            horizontal
          />
        </CartaoGrafico>
      )}

      <p className="text-xs text-zinc-500">
        Clientes são identificados pelo telefone, que não sai do servidor (vem só um código).
      </p>
    </div>
  );
};
