"use client";

import { IProduct } from "@/interfaces/IProductAll";
import { productStore } from "@/store/produtoStore";
import { formatCurrencyBRL } from "@/utils/validators";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPencil, FaX } from "react-icons/fa6";
import { toast } from "react-toastify";

interface ListProductsItemProps {
  product: IProduct;
}

export const ListProductsItem = ({ product }: ListProductsItemProps) => {
  const { deleteProductApi } = productStore();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/editarprodutos/${product.slug}`);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Tem certeza que deseja eliminar este produto?")) {
      await deleteProductApi(id);
      toast.success(`Produto ${product.name} foi eliminado com sucesso!`);
    }
  };

  if (!product) {
    return <p>Erro ao carregar produto!</p>;
  }

  const hoje = new Date().getDay(); // 0 = domingo ... 6 = sábado
  const hojeMap = hoje === 0 ? 1 : hoje + 1;

  const isAvailableToday = product.available_days?.includes(hojeMap);

  return (
    <section className="relative py-5 gap-4 flex items-center border-b border-zinc-200">
      <div className="w-18 relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${product.image_url}`}
          className="rounded-full opacity-80 w-full shadow-lg"
          alt={product.name || "Produto inválido"}
          width={80}
          height={80}
        />
        <span
          className={`absolute top-0 -right-1 rounded-full w-4 h-4 shadow-2xl border border-zinc-500 cursor-pointer ${
            !product.active
              ? "bg-red-500"
              : isAvailableToday
                ? "bg-green-principal-500"
                : "bg-yellow-500"
          }`}
          title={
            !product.active
              ? "Inativo"
              : isAvailableToday
                ? "Ativo e disponível hoje"
                : "Ativo, mas indisponível hoje"
          }
        />
      </div>
      <div className="w-full">
        <h2 className="text-lg font-medium">{product.name}</h2>
        <p className="text-sm/4.5 text-zinc-700 mt-2 mb-1">
          {product.description}
        </p>
        <p className="font-medium">
          {formatCurrencyBRL(Number(product.price))}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={handleEdit}
          className="text-yellow-600 p-2 cursor-pointer"
        >
          <FaPencil />
        </button>
        <button
          onClick={() => handleDelete(product.id)}
          className="text-red-600 p-2 cursor-pointer"
        >
          <FaX />
        </button>
      </div>
    </section>
  );
};
