"use client";

import { useEffect, useRef } from "react";
import { AdminMenu } from "@/components/AdminMenu";
import { Container } from "@/components/Container";
import { useFreteStore, Frete } from "@/store/freteStore";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

const FreteConfig = () => {
  const {
    fretes,
    setFretes,
    fetchFretes,
    createFrete,
    updateFrete,
    deleteFrete,
  } = useFreteStore();

  const originalFretesRef = useRef<Frete[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchFretes();
      originalFretesRef.current = data.map((f) => ({
        id: f.id,
        bairro: f.bairro ?? "",
        preco: f.preco ?? "",
      }));
    };
    load();
  }, [fetchFretes]);

  const handleAddFrete = () => {
    setFretes([...fretes, { bairro: "", preco: "" }]);
  };

  const handleChange = (
    index: number,
    key: keyof Omit<Frete, "id">,
    value: string
  ) => {
    const updated = [...fretes];
    updated[index] = { ...updated[index], [key]: value };
    setFretes(updated);
  };

  const handleDelete = async (frete: Frete, index: number) => {
    if (!confirm("Tem certeza que deseja deletar este frete?")) return;
    try {
      if (frete.id) await deleteFrete(Number(frete.id));
      setFretes(fretes.filter((_, i) => i !== index));
      toast.success("Frete removido!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao deletar frete");
    }
  };

  const handleSaveAll = async () => {
    try {
      const updatedFretes: Frete[] = await Promise.all(
        fretes.map(async (frete) => {
          if (!frete.id) {
            const created = await createFrete(frete);
            return created;
          }

          const original = originalFretesRef.current.find(
            (f) => f.id === frete.id
          );
          if (
            original &&
            (original.bairro !== frete.bairro || original.preco !== frete.preco)
          ) {
            await updateFrete(frete.id, frete);
          }

          return frete;
        })
      );

      setFretes([...updatedFretes]);

      try {
        const fresh = await fetchFretes();
        setFretes(fresh);
        originalFretesRef.current = fresh.map((f) => ({
          id: f.id,
          bairro: f.bairro ?? "",
          preco: f.preco ?? "",
        }));
      } catch (err) {
        console.error(err);
        originalFretesRef.current = [...updatedFretes];
      }

      toast.success("Fretes salvos com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar fretes");
    }
  };

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen">
      <div className="py-4">
        <AdminMenu title="Configurações de Frete" />
      </div>

      <section className="py-5 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold mb-2">Fretes por Bairro</h2>
        <p className="text-sm text-zinc-600 mb-4">
          Gerencie os valores de entrega por bairro. Lembre-se de salvar quando
          terminar.
        </p>

        <div className="bg-white rounded-md border border-zinc-200 overflow-hidden">
          {fretes.map((frete, index) => (
            <div
              key={frete.id ?? index}
              className="flex gap-3 items-center p-3 last:border-b-0 border-b border-zinc-200"
            >
              <label className="flex-1">
                <span className="block text-[11px] text-zinc-500 mb-1">
                  Bairro
                </span>
                <input
                  type="text"
                  placeholder="Bairro"
                  className="w-full p-2 bg-zinc-100 rounded-md outline-none focus:ring-2 focus:ring-green-principal-500"
                  value={frete.bairro || ""}
                  onChange={(e) =>
                    handleChange(index, "bairro", e.target.value)
                  }
                />
              </label>

              <div className="w-32">
                <span className="block text-[11px] text-zinc-500 mb-1 text-left">
                  Preço
                </span>
                <input
                  type="number"
                  placeholder="Preço"
                  className="w-full p-2 bg-zinc-100 rounded-md outline-none text-left focus:ring-2 focus:ring-green-principal-500"
                  value={frete.preco || ""}
                  onChange={(e) => handleChange(index, "preco", e.target.value)}
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <span className="text-[11px] text-zinc-500 mb-1">Deletar</span>
                <button
                  type="button"
                  onClick={() => handleDelete(frete, index)}
                  className="p-2 text-red-500 rounded hover:bg-red-50 transition cursor-pointer text-center"
                  aria-label="Deletar frete"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 items-center mt-4">
          <button
            type="button"
            onClick={handleAddFrete}
            className="px-4 py-2 bg-purple-principal-700 text-white rounded-md shadow-sm hover:brightness-105 transition cursor-pointer"
          >
            + Adicionar Frete
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:brightness-105 transition cursor-pointer"
          >
            Salvar Tudo
          </button>
        </div>
      </section>
    </Container>
  );
};

export default FreteConfig;
