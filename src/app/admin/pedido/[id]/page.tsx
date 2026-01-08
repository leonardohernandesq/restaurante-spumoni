"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCheckDouble,
  FaPlus,
  FaUserCheck,
} from "react-icons/fa6";
import { PiPrinter } from "react-icons/pi";
import { FaMotorcycle } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { NfPrint } from "@/components/Printer";
import { Container } from "@/components/Container";
import { pedidoStore } from "@/store/pedidoStore";
import { useStatusColor } from "@/hooks/useStatusColor";
import { formatCurrencyBRL } from "@/utils/validators";

interface PedidoPageProps {
  params: Promise<{ id: string }>;
}

export default function Pedido({ params }: PedidoPageProps) {
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const { getColor, getLabel } = useStatusColor();
  const { getPedidoById, pedido, changeStatus } = pedidoStore();
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    params.then(({ id }) => {
      const numId = parseInt(id);
      setPedidoId(numId);
      getPedidoById(numId);
    });
  }, [params, getPedidoById]);

  const handleBack = () => {
    router.back();
  };

  const handleSendNotification = async (status: number) => {
    if (!pedidoId) return;
    try {
      await changeStatus({ id: pedidoId, status });
      getPedidoById(pedidoId);

      const statusMessages: Record<number, string> = {
        0: `Olá ${pedido?.nome_cliente}, Somos do *Restaurante & Sorveteria Spumoni* :)\nSeu pedido foi *cancelado*. Se tiver dúvidas, estamos à disposição.`,
        1: `Olá ${pedido?.nome_cliente}, Somos do *Restaurante & Sorveteria Spumoni* :)\nRecebemos seu pedido <3 Em breve começaremos o preparo.`,
        2: `Olá ${pedido?.nome_cliente}, Somos do *Restaurante & Sorveteria Spumoni* :)\nSeu pedido está sendo *preparado* <3`,
        3: `Olá ${pedido?.nome_cliente}, Somos do *Restaurante & Sorveteria Spumoni* :)\nSeu pedido *saiu para entrega* <3 Aguarde só mais um pouquinho!`,
        4: `Olá ${pedido?.nome_cliente}, Somos do *Restaurante & Sorveteria Spumoni* :)\nPedido *concluído* com sucesso! <3 Esperamos que tenha gostado. Até a próxima!`,
      };

      const message = statusMessages[status];
      if (message) {
        const whatsappUrl = `https://wa.me/${
          pedido?.telefone
        }?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      }

      router.push("/admin/pedidos");
    } catch (error) {
      console.error("Erro ao mudar status:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
      <header className="relative py-5 flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <button
            className="p-2 bg-white rounded-full cursor-pointer"
            onClick={handleBack}
          >
            <FaArrowLeft />
          </button>
          <h1>Voltar ao Gestor de Pedidos</h1>
        </div>
        <button onClick={handlePrint}>
          <PiPrinter size={30} />
        </button>
      </header>

      <section className="relative py-5 flex flex-col gap-4">
        <div className=" p-2.5 border border-zinc-300 w-full rounded-md">
          {pedido?.status && (
            <div
              className={`my-2 px-3 py-1 ${getColor(
                pedido.status
              )} text-white rounded-md w-fit`}
            >
              {getLabel(pedido.status)}
            </div>
          )}
          <div className="flex items-center">
            <span className="py-1 px-3 bg-green-principal-700 text-white rounded-md">
              Delivery (Entrega)
            </span>
            <span className="py-1 px-3 font-medium">Pedido: {id}</span>
            <div className="bg-purple-principal-700 w-4 h-0.5 rounded-full"></div>
            <span className="py-1 px-3">
              {pedido?.data_pedido &&
                new Date(pedido.data_pedido).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>

          <p className="font-medium mt-3">{pedido?.nome_cliente}</p>
          <p>{pedido?.telefone}</p>
          {pedido?.tipo_entrega === "delivery" && (
            <p>
              {pedido?.endereco_entrega}, {pedido?.numero} {pedido?.complemento}
              - {pedido?.bairro} - {pedido?.cep} - {pedido?.referencia}
            </p>
          )}
        </div>
        <div className="p-2.5 border border-zinc-300 w-full rounded-md">
          {pedido?.produtos.map((produto, index) => {
            const calcularPrecoProduto = () => {
              let precoBase = produto.preco_base;

              const attrQueSubstituiBase = produto.atributos?.find(
                (attr) => attr.preco_incluido === 1
              );
              if (attrQueSubstituiBase) {
                precoBase = attrQueSubstituiBase.preco;
              }

              const adicionais =
                produto.atributos?.filter(
                  (attr) => attr.preco_incluido === 0
                ) || [];
              const totalAdicionais = adicionais.reduce(
                (soma, attr) => soma + Number(attr.preco),
                0
              );

              return (
                (Number(precoBase) + Number(totalAdicionais)) *
                produto.quantidade
              );
            };

            const valorTotal = calcularPrecoProduto();

            return (
              <div
                key={produto.id}
                className={`${index >= 1 && "border-b border-zinc-400"} p-1`}
              >
                <h2 className="font-medium mb-2">
                  {produto.quantidade}x - {produto.produto_nome}
                </h2>

                {produto.atributos?.length > 0 && (
                  <div className="ml-4 mb-2 text-sm text-zinc-700">
                    {produto.atributos.map((attr) => (
                      <p key={attr.id}>
                        • <strong>{attr.nome_atributo}:</strong> {attr.valor}
                        {Number(attr.preco) > 0 &&
                          ` (${formatCurrencyBRL(Number(attr.preco))})`}
                      </p>
                    ))}
                  </div>
                )}

                {produto.observacao && (
                  <p>
                    <strong>Obs.:</strong> {produto.observacao}
                  </p>
                )}

                <p className="font-bold mt-1">
                  Subtotal: {formatCurrencyBRL(valorTotal)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="p-2.5 border border-zinc-300 w-full rounded-md">
          <p>
            Delivery:
            <span className="font-medium">
              {formatCurrencyBRL(Number(pedido?.taxa_entrega))}
            </span>
          </p>
          <p>
            Total:
            <span className="font-medium">
              {formatCurrencyBRL(Number(pedido?.valor_total))}
            </span>
          </p>
          <p>
            Forma de Pagamento: <span className="font-medium"> PIX</span>
          </p>
        </div>

        <div className="w-full rounded-md flex border border-zinc-300">
          <button
            onClick={() => handleSendNotification(0)}
            className="w-full text-center flex flex-col items-center gap-2 border-r border-zinc-300 p-3 cursor-pointer"
          >
            <FaTrashAlt size={20} />
            <p className="text-sm/4 font-medium">Cancelar Pedido</p>
          </button>
          <button
            onClick={() => handleSendNotification(1)}
            className="w-full text-center flex flex-col items-center gap-2 border-r border-zinc-300 p-3 cursor-pointer"
          >
            <FaPlus size={20} />
            <p className="text-sm/4 font-medium">Novo Pedido</p>
          </button>
          <button
            onClick={() => handleSendNotification(2)}
            className="w-full text-center flex flex-col items-center gap-2 border-r border-zinc-300 p-3 cursor-pointer"
          >
            <FaUserCheck size={20} />
            <p className="text-sm/4 font-medium">Preparando Pedido</p>
          </button>
          <button
            onClick={() => handleSendNotification(3)}
            className="w-full text-center flex flex-col items-center gap-2 border-r border-zinc-300 p-3 cursor-pointer"
          >
            <FaMotorcycle size={20} />
            <p className="text-sm/4 font-medium ">Saiu para Entrega</p>
          </button>
          <button
            onClick={() => handleSendNotification(4)}
            className="w-full text-center flex flex-col items-center gap-2 border-r border-zinc-300 p-3 cursor-pointer"
          >
            <FaCheckDouble size={20} />
            <p className="text-sm/4 font-medium">Concluir Pedido</p>
          </button>
        </div>
      </section>
      <NfPrint pedido={pedido} />
    </Container>
  );
}
