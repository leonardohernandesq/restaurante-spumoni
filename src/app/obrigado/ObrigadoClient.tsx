"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BiCheck } from "react-icons/bi";
import { RiFacebookFill, RiInstagramFill } from "react-icons/ri";
import { IoLogoWhatsapp } from "react-icons/io5";

import { pedidoStore } from "@/store/pedidoStore";
import { useConfigStore } from "@/store/configStore";
import { Container } from "@/components/Container";
import { CheckoutResume } from "@/components/CheckoutResume";
import { FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";
import { formatCurrencyBRL } from "@/utils/validators";

const ObrigadoClient = () => {
  const searchParams = useSearchParams();

  const { getPedidoById, pedido } = pedidoStore();
  const { fetchSettings, settings } = useConfigStore();

  // const [telefoneDigitado, setTelefoneDigitado] = useState("");
  // const [telefoneConfirmado, setTelefoneConfirmado] = useState(false);
  // const [erroTelefone, setErroTelefone] = useState("");

  const [whatsappSend, setWhatsappSend] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const pedidoId = searchParams.get("pedido_id");
    if (!pedidoId) return;

    const id = Number(pedidoId);
    if (!isNaN(id)) {
      getPedidoById(id);
    }
  }, [searchParams, getPedidoById]);

  // const handleConfirmTelefone = () => {
  //   if (!pedido?.telefone) {
  //     setErroTelefone("Pedido não encontrado.");
  //     return;
  //   }

  //   const normalizar = (v: string) => v.replace(/\D/g, "");

  //   if (normalizar(telefoneDigitado) !== normalizar(pedido.telefone)) {
  //     setErroTelefone(
  //       "Este número de telefone não realizou nenhum pedido hoje."
  //     );
  //     return;
  //   }

  //   setTelefoneConfirmado(true);
  // };
  const handleSendWhatsapp = () => {
    const phone = "5511930854943"; // número com DDI + DDD e sem símbolos

    if (!pedido) return;

    //  <h2 className="font-medium mb-2">
    //           {produto.quantidade}x - {produto.produto_nome}
    //         </h2>

    //         {produto.atributos?.length > 0 && (
    //           <div className="ml-4 mb-2 text-sm text-zinc-700">
    //             {produto.atributos.map((attr) => (
    //               <p key={attr.id}>
    //                 • <strong>{attr.nome_atributo}:</strong> {attr.valor}{" "}
    //                 {Number(attr.preco) > 0 &&
    //                   `(${formatCurrencyBRL(Number(attr.preco))})`}
    //               </p>
    //             ))}
    //           </div>
    //         )}

    const produtosTexto = pedido.produtos
      .map((produto) => {
        const atributosTexto = produto.atributos
          .map((attr) => {
            const precoExtra =
              Number(attr.preco) > 0
                ? ` (${formatCurrencyBRL(Number(attr.preco))})`
                : "";

            return `${attr.nome_atributo}: ${attr.valor}${precoExtra}`;
          })
          .join("\n");

        return `${produto.quantidade}x - ${produto.produto_nome}\n${atributosTexto}`;
      })
      .join("\n\n");

    const message = `
====== 🏷 Pedido ${pedido.id} ======

${produtosTexto}

${
  pedido.tipo_entrega === "delivery"
    ? `Delivery (Entrega) ${formatCurrencyBRL(Number(pedido.taxa_entrega))}`
    : `Retirar pedido em loja`
}
Valor Total: ${formatCurrencyBRL(Number(pedido.valor_total))}
${pedido.forma_pagamento.toUpperCase()}${
      pedido.troco
        ? ` - Troco para ${formatCurrencyBRL(Number(pedido.troco))}`
        : ""
    }

====== Dados do Cliente ======

👤 ${pedido.nome_cliente}
📱 ${pedido.telefone}
📍 ${
      pedido.tipo_entrega === "delivery"
        ? `${pedido.endereco_entrega}, ${pedido.numero} ${
            pedido.complemento || ""
          } - ${pedido.bairro} | CEP: ${pedido.cep} ${pedido.referencia || ""}`
        : "Retirar em Loja"
    }

====== Detalhes do Pedido ======
https://site.restaurantespumoni.com.br/obrigado?pedido_id=${pedido?.id}
`;
    const encodedMessage = encodeURIComponent(message);

    const url = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.open(url, "_blank");

    setWhatsappSend(true);
  };

  if (!whatsappSend) {
    return (
      <Container
        styleRow="bg-green-principal-500"
        styleContainer="flex flex-col w-screen items-center h-screen justify-center text-white"
      >
        <Image src={"/logo-header.svg"} alt="" width={80} height={150} />
        <h2 className="font-bold text-2xl mt-8">O Número do seu pedido é</h2>
        <span className="font-black text-7xl mb-5">{pedido?.id}</span>
        <p className="text-xl">
          Para confirmar seu pedido, clique no botão abaixo e envie-o pelo nosso
          WhatsApp.
        </p>

        <button
          className="flex items-center gap-2 bg-purple-principal-500 py-4 px-12 mt-8 rounded-lg text-lg font-bold uppercase cursor-pointer"
          onClick={() => handleSendWhatsapp()}
        >
          <FaWhatsapp size={25} />
          Finalize o seu pedido
        </button>

        <button
          className="mt-3 text-lg font-bold cursor-pointer py-4 px-12"
          onClick={() => setWhatsappSend(true)}
        >
          Ver resumo do pedido
        </button>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-14 lg:h-screen lg:py-0">
        <BiCheck
          size={100}
          className="mb-4 rounded-full bg-zinc-100 text-green-principal-700 shadow"
        />

        <h1 className="mb-12 text-center text-4xl font-medium text-green-principal-900">
          Obrigado pela sua compra!
        </h1>

        <div className="flex flex-col-reverse items-center gap-10 lg:flex-row">
          <CheckoutResume
            pedido={pedido}
            restaurantAddress={settings.address}
          />

          <section className="flex w-full flex-col">
            <p className="py-2">
              Agradecemos imensamente por escolher o{" "}
              <strong className="text-green-principal-900">
                Restaurante & Sorveteria Spumoni
              </strong>
              . Seu pedido foi recebido com sucesso e está sendo preparado com
              todo carinho e dedicação para garantir a melhor experiência
              gastronômica.
            </p>

            <p className="py-2">
              Fique tranquilo, estamos cuidando de tudo para que sua refeição
              chegue até você com frescor e sabor!
            </p>

            <p className="py-2">
              Aproveite seu momento e, caso queira, não deixe de nos acompanhar
              nas redes sociais para mais novidades e promoções exclusivas!
            </p>

            <div className="flex gap-2 py-2 text-3xl text-purple-principal-500">
              {settings.facebook_url && (
                <Link href={settings.facebook_url} target="_blank">
                  <RiFacebookFill />
                </Link>
              )}

              {settings.instagram_url && (
                <Link href={settings.instagram_url} target="_blank">
                  <RiInstagramFill />
                </Link>
              )}

              {settings.whatsapp_number && (
                <Link
                  href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_number.replace(
                    /\D/g,
                    "",
                  )}`}
                  target="_blank"
                >
                  <IoLogoWhatsapp />
                </Link>
              )}
            </div>

            <h2 className="text-lg font-medium">
              Desejamos a você uma excelente refeição!
            </h2>

            <h2 className="text-lg">
              Equipe{" "}
              <span className="font-medium text-purple-principal-900">
                Spumoni
              </span>
            </h2>
          </section>
        </div>
      </div>
    </Container>
  );
};

export default ObrigadoClient;
