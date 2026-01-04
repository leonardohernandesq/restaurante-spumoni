"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { IoWalletOutline } from "react-icons/io5";

import { cartStore } from "@/store/cartStore";

import { Container } from "@/components/Container";
import { useStoreStatus } from "@/hooks/useStoreStatus";
import { SkeletonComponent } from "./SkeletonComponent";
import Link from "next/link";

export const Header = () => {
  const router = useRouter();
  const { storeOpen } = useStoreStatus();
  const { produtos, isLoading } = cartStore();
  const totalItens = produtos.length;

  const handleCart = () => {
    router.push("/carrinho");
  };

  if (isLoading) {
    return skeletonHeader();
  }

  return (
    <Container styleRow="bg-green-principal-500">
      <header className="relative w-full pt-7 pb-12 xl:pb-7 gap-5 flex justify-between items-center text-white">
        <Link href="/">
          <Image
            src={"/logo-header.svg"}
            alt="Logo da empresa Restaurante Spumoni. Um boneco de neve e uma escrita de gelo Restaurante Spumoni"
            width={80}
            height={110}
          />
        </Link>
        <div className="flex flex-col text-center gap-2">
          <h1 className="text-md font-bold md:text-3xl">
            Restaurante <span className="text-purple-principal-700">&</span>{" "}
            Sorveteria{" "}
            <span className="text-purple-principal-700">Spumoni</span>
          </h1>
          <h2 className="text-sm">O melhor restaurante do Alto Tietê</h2>
          <div className="flex items-center justify-center">
            {storeOpen ? (
              <>
                <div className="bg-green-400 h-2.5 w-2.5 rounded-full mr-2"></div>
                <span className="text-md">Aberto</span>
              </>
            ) : (
              <>
                <div className="bg-red-600 h-2.5 w-2.5 rounded-full mr-2"></div>
                <span className="text-md">Fechado</span>
              </>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={handleCart}
            className="bg-white p-3 rounded-full shadow-md cursor-pointer"
          >
            <IoWalletOutline className="text-2xl text-black" />
          </button>
          <div className="bg-purple-principal-700 h-6 w-6 flex items-center justify-center rounded-full text-xs absolute top-[-10px] right-[-5px]">
            {totalItens}
          </div>
        </div>
      </header>
    </Container>
  );
};

const skeletonHeader = () => {
  return (
    <Container styleRow="bg-green-principal-500">
      <header className="relative w-full pt-7 pb-12 xl:pb-7 gap-5 flex justify-between items-center text-white">
        <div>
          <SkeletonComponent height={107} width={80} />
        </div>
        <div className="flex flex-col text-center gap-2 items-center">
          <SkeletonComponent height={36} width={480} />
          <SkeletonComponent height={24} width={200} />
          <SkeletonComponent height={24} width={100} />
        </div>
        <SkeletonComponent height={48} width={48} borderRadius={9999} />
      </header>
    </Container>
  );
};
