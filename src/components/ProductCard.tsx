"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { BiPlus } from "react-icons/bi";

import { IProductCardProps } from "@/interfaces/IProductCardProps";

import { useStatusQuery } from "@/hooks/useStatusQuery";
import { formatCurrencyBRL } from "@/utils/validators";

export const ProductCard = ({ product }: IProductCardProps) => {
  const { storeOpen } = useStatusQuery();
  const router = useRouter();

  const handleBuyProduct = (link: string) => {
    if (storeOpen) {
      router.push(link);
    } else {
      toast.error(
        "A Loja está fechada no momento. \n Tente novamente mais tarde!",
      );
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-lg">
      <div
        className="bg-purple-principal-500 h-32 w-full rounded-t-xl relative flex items-center justify-center cursor-pointer"
        title={product.name}
        onClick={() => handleBuyProduct(`/produto/${product.slug}`)}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${product.image_url}`}
          alt={product.name}
          width={150}
          height={150}
          className="absolute -bottom-14 rounded-xl"
        />
      </div>
      <div className="px-4 pt-20 pb-4 flex flex-col">
        <div className="flex flex-col flex-1">
          <h2 className="font-medium text-xl mb-2 text-center">
            {product.name}
          </h2>
          <p className="text-zinc-700 md:min-h-20 text-center">
            {product.description}
          </p>
        </div>
        <section className="flex justify-between items-center mt-auto">
          <div className="text-lg font-medium text-green-principal-900">
            Desde {formatCurrencyBRL(Number(product.price))}
          </div>
          <button
            onClick={() => handleBuyProduct(`/produto/${product.slug}`)}
            title="Adicionar ao carrinho"
          >
            <div className="bg-purple-principal-500 flex items-center justify-center w-8 h-8 rounded-full text-white shadow-md shadow-zinc-400 cursor-pointer">
              <BiPlus size={18} />
            </div>
          </button>
        </section>
      </div>
    </section>
  );
};
