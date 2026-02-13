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
    pagination,
    setFretes,
    fetchFretes,
    createFrete,
    updateFrete,
    deleteFrete,
  } = useFreteStore();

  const originalFretesRef = useRef<Frete[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetchFretes(1, pagination.perPage);
      // Atualiza o ref com os dados originais
      originalFretesRef.current = response.data.map((f) => ({
        id: f.id,
        bairro: f.bairro ?? "",
        preco: f.preco ?? "",
        cidade: f.cidade ?? "",
      }));
    };
    load();
  }, [fetchFretes, pagination.perPage]);

  const handleAddFrete = () => {
    // Adiciona um novo frete localmente (não persiste até salvar)
    setFretes(
      [
        ...fretes,
        {
          bairro: "",
          preco: "",
          cidade: "",
        },
      ],
      pagination,
    );
  };

  const changePage = async (newPage: number) => {
    const response = await fetchFretes(newPage, pagination.perPage);
    // fetchFretes já atualiza a store; atualiza o ref com os dados recebidos
    originalFretesRef.current = response.data.map((f) => ({
      id: f.id,
      bairro: f.bairro ?? "",
      preco: f.preco ?? "",
      cidade: f.cidade ?? "",
    }));
  };

  const handleChange = (
    index: number,
    key: keyof Omit<Frete, "id">,
    value: string,
  ) => {
    const updated = [...fretes];
    updated[index] = { ...updated[index], [key]: value };
    setFretes(updated, pagination);
  };

  const handleDelete = async (frete: Frete, index: number) => {
    if (!confirm("Tem certeza que deseja deletar este frete?")) return;
    try {
      if (frete.id) await deleteFrete(Number(frete.id));
      setFretes(
        fretes.filter((_, i) => i !== index),
        pagination,
      );
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
            (f) => f.id === frete.id,
          );
          if (
            original &&
            (original.bairro !== frete.bairro || original.preco !== frete.preco)
          ) {
            await updateFrete(frete.id, frete);
          }

          return frete;
        }),
      );

      // Atualiza a store com os fretes atualizados localmente
      setFretes([...updatedFretes], pagination);

      try {
        // Re-fetch para garantir a consistência com o servidor e receber paginação atualizada
        const fresh = await fetchFretes(
          pagination.currentPage,
          pagination.perPage,
        );
        setFretes(fresh.data, fresh.pagination);
        originalFretesRef.current = fresh.data.map((f) => ({
          id: f.id,
          bairro: f.bairro ?? "",
          preco: f.preco ?? "",
          cidade: f.cidade ?? "",
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
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
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
              key={index}
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
              <label className="flex-1">
                <span className="block text-[11px] text-zinc-500 mb-1">
                  Cidade
                </span>
                <input
                  type="text"
                  placeholder="Cidade"
                  className="w-full p-2 bg-zinc-100 rounded-md outline-none focus:ring-2 focus:ring-green-principal-500"
                  value={frete.cidade || ""}
                  onChange={(e) =>
                    handleChange(index, "cidade", e.target.value)
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

        <div className="flex items-center justify-between mt-4 gap-4">
          <div className="flex gap-3">
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className={`px-3 py-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 transition ${
                pagination.currentPage <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              aria-label="Página anterior"
            >
              Anterior
            </button>

            <div className="px-3 py-1 bg-zinc-100 text-sm rounded-md border border-zinc-200">
              Página {pagination.currentPage} de {pagination.totalPages}
            </div>

            <button
              type="button"
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className={`px-3 py-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 transition ${
                pagination.currentPage >= pagination.totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              aria-label="Próxima página"
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default FreteConfig;
