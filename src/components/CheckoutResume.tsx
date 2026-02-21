import { IPedido } from "@/interfaces/IPedidosData";
import { CheckoutClientData } from "./CheckoutClientData";
import { CheckoutEntregaData } from "./CheckoutEntregaData";
import { CheckoutPagamentoData } from "./CheckoutPagamentoData";
import { CheckoutEnderecoEntrega } from "./CheckoutEnderecoEntrega";
import { CheckoutProductList } from "./CheckoutProductList";
import { CheckoutResumoPedido } from "./CheckoutResumoPedido";

export const CheckoutResume = ({
  pedido,
  restaurantAddress,
}: {
  pedido: IPedido | null;
  restaurantAddress: string;
}) => {
  return (
    <section className="w-full rounded-lg">
      <CheckoutClientData
        nome={pedido?.nome_cliente}
        telefone={pedido?.telefone}
      />
      <CheckoutEntregaData
        tipo_entrega={pedido?.tipo_entrega}
        data_entrega={pedido?.data_entrega}
        entrega={pedido?.entrega}
      />

      {/* TODO */}
      <CheckoutEnderecoEntrega
        pedido={pedido}
        restaurantAddress={restaurantAddress}
      />

      <CheckoutPagamentoData
        forma_pagamento={pedido?.forma_pagamento}
        troco={pedido?.troco}
        nota_fiscal={pedido?.nota_fiscal}
      />
      <CheckoutProductList produtos={pedido?.produtos ?? []} />
      <CheckoutResumoPedido
        total_produtos={pedido?.total_produtos}
        total_entrega={pedido?.taxa_entrega}
        valor_total={pedido?.valor_total}
      />
    </section>
  );
};
