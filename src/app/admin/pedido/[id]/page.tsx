"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import { Printer } from "@/components/Printer";
import { Container } from "@/components/Container";
import { PedidoCabecalho } from "@/components/pedido/PedidoCabecalho";
import { PedidoTotais } from "@/components/pedido/PedidoTotais";
import { PedidoCliente } from "@/components/pedido/PedidoCliente";
import { PedidoAcoes } from "@/components/pedido/PedidoAcoes";
import { PedidoExclusao } from "@/components/pedido/PedidoExclusao";
import { ErrorState, LoadingState } from "@/components/ui/QueryState";
import { useChangePedidoStatus, usePedidoQuery } from "@/queries/pedidos";
import { buildWhatsappUrl } from "@/utils/format";
import { calcularTotaisDoPedido } from "@/domain/pricing";
import { PEDIDO_STATUS, PedidoStatus } from "@/domain/pedidoStatus";

interface PedidoPageProps {
  params: Promise<{ id: string }>;
}

export default function Pedido({ params }: PedidoPageProps) {
  const { id } = use(params);
  const pedidoId = parseInt(id);
  const router = useRouter();

  // Abre na hora com os dados da lista; o detalhe completo chega em seguida
  const {
    data: pedido = null,
    isError,
    isFetching,
    isPlaceholderData,
    refetch,
  } = usePedidoQuery(pedidoId);
  const changeStatus = useChangePedidoStatus();

  // Relógio da tela: atualiza o "há X min"
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const totais = pedido
    ? calcularTotaisDoPedido(pedido.produtos ?? [], pedido.taxa_entrega)
    : null;
  const carregandoItens = isPlaceholderData && !pedido?.produtos?.length;

  const handleChangeStatus = async (status: PedidoStatus) => {
    if (!pedidoId || !pedido) return;

    // A aba precisa ser aberta ainda dentro do clique (antes do await),
    // senão o navegador bloqueia como pop-up. O endereço é definido depois.
    const whatsappWindow = window.open("", "_blank");

    try {
      await changeStatus.mutateAsync({ id: pedidoId, status });

      const url = buildWhatsappUrl(
        pedido.telefone,
        PEDIDO_STATUS[status].whatsappMessage(pedido.nome_cliente, {
          numero: pedidoId,
          retirada: pedido.tipo_entrega === "takeaway",
        }),
      );

      if (whatsappWindow) {
        whatsappWindow.location.href = url;
      } else {
        window.open(url, "_blank");
      }

      router.push("/admin/pedidos");
    } catch (error) {
      whatsappWindow?.close();
      console.error("Erro ao mudar status:", error);
      toast.error("Não foi possível alterar o status do pedido.");
    }
  };

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen pb-10">
      <div className="py-4 print:hidden">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-white hover:text-zinc-900"
        >
          <FiArrowLeft aria-hidden /> Voltar aos pedidos
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {isError && !pedido && (
          <ErrorState
            mensagem="Não foi possível carregar este pedido."
            onRetry={() => refetch()}
            tentando={isFetching}
          />
        )}
        {!pedido && !isError && <LoadingState mensagem="Carregando pedido..." />}

        {pedido && totais && (
          <>
            {pedido.excluido && <PedidoExclusao pedido={pedido} />}
            <PedidoCabecalho pedidoId={pedidoId} pedido={pedido} agora={agora} />

            <PedidoAcoes
              pedido={pedido}
              onChangeStatus={handleChangeStatus}
              desabilitado={changeStatus.isPending}
            />

            {/* Cliente, entrega e pagamento primeiro: não somem com pedidos grandes */}
            <PedidoCliente pedido={pedido} total={totais.total} />
            <PedidoTotais
              itens={totais.itens}
              subtotal={totais.subtotal}
              taxaEntrega={totais.taxaEntrega}
              total={totais.total}
              entrega={pedido.tipo_entrega === "delivery"}
              carregando={carregandoItens}
            />
          </>
        )}
      </div>
      <Printer pedido={pedido} />
    </Container>
  );
}
