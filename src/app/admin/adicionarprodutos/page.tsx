import React, { Suspense } from "react";
import { AdicionarProdutosClient } from "@/components/AdicionarProdutosClient";

export default function AdicionarProdutos() {
    return (
        <Suspense fallback={<div>Carregando parâmetros...</div>}>
            <AdicionarProdutosClient />
        </Suspense>
    )
}
