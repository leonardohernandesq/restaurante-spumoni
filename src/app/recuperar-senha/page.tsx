"use client";

import { Container } from "@/components/Container";
import { useRequestPasswordReset } from "@/hooks/usePasswordRecoveryQuery";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";
import { BsArrowRight } from "react-icons/bs";

export default function RecuperarSenha() {
  const [email, setEmail] = React.useState("");
  const recovery = useRequestPasswordReset();
  const router = useRouter();

  const onHandleRecovery = () => {
    try {
      recovery.mutate(email, {
        onSuccess: () => {
          router.push("/");
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container styleRow="bg-green-principal-500">
      <main className="flex flex-col items-center justify-center min-h-screen px-7 py-5 ">
        <Link href={"/"}>
          <Image
            src={"logo-footer.svg"}
            alt="Logo do Restaurante Spumoni"
            width={300}
            height={100}
          />
        </Link>
        <section className="flex flex-col text-center text-white my-10 bg-green-principal-900 p-8 w-full max-w-lg gap-5 rounded-3xl shadow-2xl">
          <h1 className="text-3xl font-bold">Recuperar Senha</h1>
          <h2 className="">
            Insira o seu email para recuperar a senha. Será enviado um código de
            confirmação para alterar a senha
          </h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="bg-green-950 py-2.5 px-5 placeholder:text-zinc-400 rounded-xl"
            placeholder="Digite seu email: "
          />

          <button
            className="bg-purple-principal-700 py-2.5 px-5 rounded-xl font-medium flex items-center justify-center gap-3 cursor-pointer hover:bg-purple-principal-900 transition-colors"
            onClick={onHandleRecovery}
          >
            <>
              Recuperar <BsArrowRight />
            </>
          </button>
        </section>
      </main>
    </Container>
  );
}
