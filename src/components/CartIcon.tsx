import { useRouter } from "next/navigation";
import React from "react";
import { IoWalletOutline } from "react-icons/io5";

export const CartIcon = ({ totalItens }: { totalItens: number }) => {
  const router = useRouter();

  const handleCart = () => {
    router.push("/carrinho");
  };
  return (
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
  );
};
