/**
 * Textos dos ícones "i" das estatísticas: como cada número é calculado.
 * Mantenha em sincronia com `domain/estatisticas.ts`.
 */

const QUAIS_PEDIDOS = (
  <p>
    Entram os pedidos <strong>feitos no período</strong> (pela data do pedido), menos os cancelados.
    Com &quot;Contar só pedidos finalizados&quot; marcado, entram só os Finalizados. Pedidos
    excluídos no gestor de pedidos nunca entram.
  </p>
);

const VALOR_DO_PEDIDO = (
  <p>
    Valor de um pedido = produtos (preço do produto + opções escolhidas, vezes a quantidade) +
    taxa de entrega. Retirada não soma taxa.
  </p>
);

const COMPARACAO = (
  <p>
    A seta compara com o <strong>mesmo trecho do período anterior</strong>: ex. de 1 a 27 deste mês
    contra 1 a 27 do mês passado. No período personalizado, compara com os dias imediatamente antes,
    do mesmo tamanho.
  </p>
);

export const AJUDA = {
  somenteFinalizados: (
    <>
      <p>
        <strong>Desmarcado:</strong> conta todos os pedidos, menos os cancelados (Novo e
        Finalizado).
      </p>
      <p>
        <strong>Marcado:</strong> conta só os pedidos marcados como Finalizado. Mostra o que de fato
        foi entregue, mas depende da equipe finalizar os pedidos no admin.
      </p>
    </>
  ),

  /* ---------- Visão geral ---------- */
  faturamento: (
    <>
      <p>Soma do valor de todos os pedidos que contam.</p>
      {VALOR_DO_PEDIDO}
      {QUAIS_PEDIDOS}
      {COMPARACAO}
    </>
  ),
  pedidos: (
    <>
      <p>Quantidade de pedidos que contam no período.</p>
      <p>&quot;Por dia&quot; = pedidos ÷ número de dias do período (inclusive dias fechados).</p>
      {QUAIS_PEDIDOS}
      {COMPARACAO}
    </>
  ),
  ticketMedio: (
    <>
      <p>Faturamento ÷ número de pedidos: quanto cada pedido vale, em média (com a taxa de entrega).</p>
      {COMPARACAO}
    </>
  ),
  cancelamentos: (
    <>
      <p>Pedidos cancelados ÷ (pedidos que contam + cancelados).</p>
      <p>O valor ao lado é quanto os cancelados somariam: o que deixou de entrar.</p>
      <p>Aqui, subir é ruim: a seta fica vermelha quando aumenta.</p>
    </>
  ),
  emProdutos: (
    <>
      <p>Faturamento só dos produtos, sem as taxas de entrega.</p>
      <p>&quot;Itens vendidos&quot; soma as quantidades (2x o mesmo prato = 2 itens).</p>
    </>
  ),
  taxasEntrega: (
    <>
      <p>Soma das taxas de entrega dos pedidos de delivery.</p>
      <p>A porcentagem é quanto as taxas representam do faturamento total.</p>
    </>
  ),
  pratoTop: (
    <p>
      O produto com mais <strong>unidades</strong> vendidas no período (somando as quantidades de
      todos os pedidos que contam).
    </p>
  ),
  melhorDia: (
    <p>
      O dia da semana com a maior <strong>média</strong> de pedidos: total de pedidos naquele dia ÷
      quantas vezes ele aparece no período. Usar a média evita favorecer um dia só porque ele
      aconteceu mais vezes.
    </p>
  ),
  serieFaturamento: (
    <>
      <p>Faturamento somado em cada intervalo do período.</p>
      <p>
        O intervalo muda com o tamanho do período: <strong>por dia</strong> até ~2 meses,{" "}
        <strong>por semana</strong> (começando na segunda) até ~6 meses e <strong>por mês</strong>{" "}
        acima disso.
      </p>
      {VALOR_DO_PEDIDO}
    </>
  ),
  seriePedidos: (
    <p>
      Quantidade de pedidos em cada intervalo (por dia, semana ou mês, conforme o tamanho do
      período).
    </p>
  ),
  pagamentos: (
    <p>
      Pedidos separados pela forma de pagamento escolhida no checkout. O valor é o faturamento
      desses pedidos (produtos + taxa).
    </p>
  ),
  tiposEntrega: (
    <>
      <p>Pedidos separados entre entrega (delivery) e retirada na loja.</p>
      <p>&quot;Agendados&quot; são os pedidos marcados para uma data e hora, em vez de &quot;para agora&quot;.</p>
    </>
  ),
  categorias: (
    <>
      <p>Faturamento dos produtos somado pela categoria em que cada produto está hoje.</p>
      <p>Não inclui taxas de entrega. &quot;% dos produtos&quot; = categoria ÷ total em produtos.</p>
    </>
  ),

  /* ---------- Pratos ---------- */
  topQuantidade: (
    <p>
      Os 10 produtos com mais unidades vendidas. Um pedido com 3x o mesmo prato conta 3 unidades.
    </p>
  ),
  topFaturamento: (
    <p>
      Os 10 produtos que mais faturaram: preço do item (produto + opções) × quantidade, somado em
      todos os pedidos. Sem taxas de entrega.
    </p>
  ),
  todosProdutos: (
    <>
      <p>
        <strong>Unidades:</strong> quantidade total vendida. <strong>Pedidos:</strong> em quantos
        pedidos o produto apareceu.
      </p>
      <p>&quot;% do total&quot; = faturamento do produto ÷ faturamento em produtos.</p>
    </>
  ),

  /* ---------- Dias e horários ---------- */
  mediaPedidosDia: (
    <p>
      Total de pedidos em cada dia da semana ÷ quantas vezes esse dia aparece no período. Ex.: num mês
      com 5 sextas e 100 pedidos às sextas, a média é 20.
    </p>
  ),
  mediaFaturamentoDia: (
    <p>
      Faturamento de cada dia da semana ÷ quantas vezes esse dia aparece no período. Mostra quanto
      um dia &quot;típico&quot; fatura.
    </p>
  ),
  horas: (
    <p>
      Pedidos agrupados pela hora em que foram <strong>feitos</strong> no site (horário de
      Brasília), não pela hora da entrega. Ex.: 11h = das 11:00 às 11:59.
    </p>
  ),

  /* ---------- Clientes ---------- */
  clientesUnicos: (
    <>
      <p>Quantos telefones diferentes fizeram pedido no período.</p>
      <p>O telefone é transformado num código no servidor; o número não chega a esta página.</p>
      {COMPARACAO}
    </>
  ),
  recorrentes: <p>Clientes (telefones) com 2 ou mais pedidos dentro do período escolhido.</p>,
  pedidosDeRecorrentes: (
    <p>
      Dos pedidos do período, quantos foram feitos por clientes que pediram 2 ou mais vezes. Mostra
      o peso da clientela fiel.
    </p>
  ),
  pedidosPorCliente: <p>Total de pedidos ÷ número de clientes diferentes.</p>,
  bairros: (
    <>
      <p>Só pedidos de entrega, agrupados pelo bairro informado no endereço.</p>
      <p>
        <strong>Taxas:</strong> soma das taxas de entrega do bairro. <strong>Ticket médio:</strong>{" "}
        faturamento ÷ pedidos do bairro.
      </p>
    </>
  ),
};
