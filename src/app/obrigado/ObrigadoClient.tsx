"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiFacebookFill, RiInstagramFill } from "react-icons/ri";
import { IoLogoWhatsapp } from "react-icons/io5";

import { useSettingsQuery } from "@/queries/config";
import { Container } from "@/components/Container";
import { CheckoutResume } from "@/components/CheckoutResume";
import { CheckAnimado } from "@/components/ui/CheckAnimado";
import { FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";
import type { Pedido } from "@/types/pedido";
import { buildWhatsappUrl } from "@/utils/format";
import { LOJA } from "@/constants/app";
import {
  lerResumoPedido,
  montarMensagemWhatsappLoja,
} from "@/domain/pedidoResumo";

/** Lembra que o WhatsApp já foi enviado (recarregar não pede de novo). */
const chaveEnviado = (id: number) => `pedido_whatsapp_enviado_${id}`;

const lerEnviado = (id: number): boolean => {
  try {
    return sessionStorage.getItem(chaveEnviado(id)) === "1";
  } catch {
    return false;
  }
};

const marcarEnviado = (id: number) => {
  try {
    sessionStorage.setItem(chaveEnviado(id), "1");
  } catch {
    // sem storage: vale só enquanto a página estiver aberta
  }
};

const ObrigadoClient = () => {
  const searchParams = useSearchParams();
  const pedidoIdParam = Number(searchParams.get("pedido_id"));
  const pedidoId =
    Number.isInteger(pedidoIdParam) && pedidoIdParam > 0 ? pedidoIdParam : null;

  const { data: settings } = useSettingsQuery();

  // O resumo vem do sessionStorage salvo no checkout, não da API:
  // GET /order?id= é (ou será) protegido por login (item 1.2 / B1).
  const [pedido, setPedido] = useState<Pedido | null>(null);
  // O resumo só libera depois de abrir o WhatsApp com o pedido
  const [enviado, setEnviado] = useState(false);
  const [verResumo, setVerResumo] = useState(false);
  const [aviso, setAviso] = useState(false);

  useEffect(() => {
    setPedido(pedidoId ? lerResumoPedido(pedidoId) : null);
    setEnviado(pedidoId ? lerEnviado(pedidoId) : false);
  }, [pedidoId]);

  const handleVerResumo = () => {
    if (enviado) setVerResumo(true);
    else setAviso(true);
  };

  const handleSendWhatsapp = () => {
    if (!pedidoId) return;

    const linkDetalhes = `${window.location.origin}/admin/pedido/${pedidoId}`;
    const message = montarMensagemWhatsappLoja(pedidoId, pedido, linkDetalhes);

    const whatsappLoja = settings?.whatsapp_number || LOJA.whatsappFallback;
    window.open(buildWhatsappUrl(whatsappLoja, message), "_blank");

    marcarEnviado(pedidoId);
    setEnviado(true);
    setAviso(false);
  };

  if (!verResumo) {
    return (
      <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-green-principal-500 to-green-principal-900 px-4 py-10 text-white">
        {/* Bolhas decorativas */}
        <span className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <span className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10" />

        <div className="relative flex w-full max-w-md flex-col items-center text-center">
          <Image src="/logo-header.svg" alt="Spumoni" width={64} height={120} />

          <CheckAnimado tamanho={120} variante="claro" className="mt-8" />

          <h1 className="mt-6 text-3xl font-bold">Pedido recebido!</h1>

          <div className="mt-6 w-full rounded-2xl bg-white/15 px-6 py-5 ring-1 ring-white/25 backdrop-blur-sm">
            <p className="text-sm font-medium uppercase tracking-widest text-white/80">
              Número do pedido
            </p>
            <p className="mt-1 text-6xl font-black tabular-nums">
              #{pedidoId}
            </p>
          </div>

          <p className="mt-6 text-lg leading-snug">
            {enviado ? (
              <>
                Pronto! Confira se a mensagem foi <strong>enviada no WhatsApp</strong>.
              </>
            ) : (
              <>
                Falta só um passo: <strong>envie o pedido pelo nosso WhatsApp</strong>{" "}
                para confirmar.
              </>
            )}
          </p>

          <button
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-lg font-bold uppercase text-green-principal-900 shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            onClick={handleSendWhatsapp}
          >
            <FaWhatsapp size={26} />
            {enviado ? "Enviar de novo pelo WhatsApp" : "Enviar pelo WhatsApp"}
          </button>

          {/* aria-disabled (não disabled): o clique ainda mostra o aviso */}
          <button
            type="button"
            aria-disabled={!enviado}
            aria-describedby={aviso ? "aviso-resumo" : undefined}
            className={`mt-3 rounded-xl px-6 py-3 font-semibold underline-offset-4 transition ${
              enviado
                ? "cursor-pointer text-white hover:underline"
                : "cursor-not-allowed text-white/50"
            }`}
            onClick={handleVerResumo}
          >
            Ver resumo do pedido
          </button>

          {aviso && !enviado && (
            <p
              id="aviso-resumo"
              role="alert"
              className="mt-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-green-principal-900 shadow"
            >
              Envie o pedido pelo WhatsApp primeiro para ver o resumo.
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full bg-custom-gray-100">
      <Container styleContainer="flex flex-col items-center py-12 lg:py-16">
        <CheckAnimado tamanho={96} />

        <h1 className="mt-5 text-center text-3xl font-bold text-green-principal-900 lg:text-4xl">
          Obrigado pela sua compra!
        </h1>
        <p className="mt-2 text-center text-zinc-600">
          Pedido <strong className="text-zinc-800">#{pedidoId}</strong> recebido
          com sucesso.
        </p>

        <div className="mt-10 grid w-full gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
            {pedido ? (
              <CheckoutResume
                pedido={pedido}
                restaurantAddress={settings?.address ?? ""}
              />
            ) : (
              <section className="p-6 text-zinc-700">
                <p className="text-lg font-bold text-purple-principal-700">
                  Pedido nº {pedidoId}
                </p>
                <p className="mt-2">
                  O resumo completo fica disponível apenas no aparelho em que o
                  pedido foi feito. Em caso de dúvida, fale com a gente pelo
                  WhatsApp.
                </p>
              </section>
            )}
          </div>

          <section className="flex flex-col gap-3 rounded-2xl bg-white p-6 text-zinc-700 shadow-sm ring-1 ring-zinc-200 lg:sticky lg:top-6">
            <p>
              Agradecemos imensamente por escolher o{" "}
              <strong className="text-green-principal-900">
                Restaurante & Sorveteria Spumoni
              </strong>
              . Seu pedido está sendo preparado com todo carinho e dedicação.
            </p>

            <p>
              Fique tranquilo, estamos cuidando de tudo para que sua refeição
              chegue até você com frescor e sabor!
            </p>

            <div className="mt-2 border-t border-zinc-200 pt-4">
              <p className="text-sm font-medium text-zinc-500">
                Acompanhe novidades e promoções
              </p>
              <div className="mt-3 flex gap-3">
                {settings?.facebook_url && (
                  <Link
                    href={settings.facebook_url}
                    target="_blank"
                    aria-label="Facebook"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-principal-500 text-2xl text-white transition hover:bg-purple-principal-900"
                  >
                    <RiFacebookFill />
                  </Link>
                )}

                {settings?.instagram_url && (
                  <Link
                    href={settings.instagram_url}
                    target="_blank"
                    aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-principal-500 text-2xl text-white transition hover:bg-purple-principal-900"
                  >
                    <RiInstagramFill />
                  </Link>
                )}

                {settings?.whatsapp_number && (
                  <Link
                    href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_number.replace(
                      /\D/g,
                      "",
                    )}`}
                    target="_blank"
                    aria-label="WhatsApp"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-principal-500 text-2xl text-white transition hover:bg-purple-principal-900"
                  >
                    <IoLogoWhatsapp />
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-2 border-t border-zinc-200 pt-4">
              <p className="font-medium text-zinc-800">
                Desejamos a você uma excelente refeição!
              </p>
              <p>
                Equipe{" "}
                <span className="font-semibold text-purple-principal-900">
                  Spumoni
                </span>
              </p>
            </div>

            <Link
              href="/"
              className="mt-2 rounded-xl bg-green-principal-700 px-5 py-3 text-center font-bold text-white transition hover:bg-green-principal-900"
            >
              Voltar ao cardápio
            </Link>
          </section>
        </div>
      </Container>
    </main>
  );
};

export default ObrigadoClient;
