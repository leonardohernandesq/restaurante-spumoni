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

const ObrigadoClient = () => {
  const searchParams = useSearchParams();

  const { getPedidoById, pedido } = pedidoStore();
  const { fetchSettings, settings } = useConfigStore();

  const [telefoneDigitado, setTelefoneDigitado] = useState("");
  const [telefoneConfirmado, setTelefoneConfirmado] = useState(false);
  const [erroTelefone, setErroTelefone] = useState("");

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

  const handleConfirmTelefone = () => {
    if (!pedido?.telefone) {
      setErroTelefone("Pedido não encontrado.");
      return;
    }

    const normalizar = (v: string) => v.replace(/\D/g, "");

    if (normalizar(telefoneDigitado) !== normalizar(pedido.telefone)) {
      setErroTelefone(
        "Este número de telefone não realizou nenhum pedido hoje."
      );
      return;
    }

    setTelefoneConfirmado(true);
  };

  if (!telefoneConfirmado) {
    return (
      <Container>
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-2xl border border-gray-200">
            <h2 className="mb-4 text-center text-xl font-medium">
              Confirme seu telefone
            </h2>

            <input
              type="tel"
              placeholder="Digite seu telefone"
              value={telefoneDigitado}
              onChange={(e) => {
                setTelefoneDigitado(e.target.value);
                setErroTelefone("");
              }}
              className="mb-2 w-full rounded border px-3 py-2"
            />

            {erroTelefone && (
              <p className="mb-2 text-sm text-red-600">{erroTelefone}</p>
            )}

            <button
              onClick={handleConfirmTelefone}
              className="w-full rounded bg-green-principal-700 py-2 text-white hover:bg-green-principal-800 cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </div>
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
                    ""
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
