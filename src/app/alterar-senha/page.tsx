"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense } from "react";
import { useResetPassword } from "@/hooks/usePasswordRecoveryQuery";
import { Container } from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function AlterarSenha() {
  const [newPassword, setNewPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const reset = useResetPassword();
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code") || "";

  const onHandleReset = async () => {
    if (!code) return alert("Code não encontrado!");

    try {
      await reset.mutateAsync({ code, new_password: newPassword });
      router.push("/");
    } catch (err) {
      console.log(err);
      alert("Erro ao alterar senha");
    }
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Container styleRow="bg-green-principal-500">
        <main className="flex flex-col items-center justify-center min-h-screen px-7 py-5">
          <Link href={"/"}>
            <Image
              src={"logo-footer.svg"}
              alt="Logo do Restaurante Spumoni"
              width={300}
              height={100}
            />
          </Link>

          <section className="flex flex-col text-center text-white my-10 bg-green-principal-900 p-8 w-full max-w-lg gap-5 rounded-3xl shadow-2xl">
            <h1 className="text-3xl font-bold">Alterar Senha</h1>

            <div className="relative w-full flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-green-950 py-2.5 px-5 placeholder:text-zinc-400 rounded-xl w-full"
                placeholder="Digite sua nova senha: "
              />
              {showPassword ? (
                <FiEyeOff
                  className="absolute right-5 cursor-pointer text-zinc-400"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FiEye
                  className="absolute right-5 cursor-pointer text-zinc-400"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>

            <button
              disabled={reset.isPending}
              className="bg-purple-principal-700 py-2.5 px-5 rounded-xl font-medium flex items-center justify-center gap-3 cursor-pointer hover:bg-purple-principal-900 transition-colors disabled:opacity-50"
              onClick={onHandleReset}
            >
              Alterar <BsArrowRight />
            </button>
          </section>
        </main>
      </Container>
    </Suspense>
  );
}
