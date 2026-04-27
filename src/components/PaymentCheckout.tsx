import Image from "next/image";

interface IPayment {
  payment: string;
  setPayment: (value: string) => void;
  troco: string | number;
  setTroco: (value: string) => void;
}

export const PaymentCheckout = ({
  payment,
  setPayment,
  troco,
  setTroco,
}: IPayment) => {
  return (
    <section className="flex flex-col border-b border-zinc-200 pb-4">
      <div className="mb-2">
        <p className="font-light text-xs mb-1">OBRIGATÓRIO</p>
        <p>FORMA DE PAGAMENTO</p>
      </div>
      <div className="flex gap-2">
        <label
          htmlFor="pix"
          className={`flex flex-col items-center ${payment === "pix" ? "bg-zinc-800 text-white shadow-lg" : "bg-zinc-200 opacity-50 hover:opacity-60"} p-2 w-full lg:w-48 rounded-md cursor-pointer transition-all shadow-md`}
        >
          <input
            className="hidden"
            type="radio"
            name="payment"
            id="pix"
            checked={payment === "pix"}
            onChange={() => setPayment("pix")}
          />
          <Image
            className={`${payment === "pix" && "invert-100"}`}
            src={"/pix.svg"}
            alt="PIX"
            height={40}
            width={40}
          />

          <span
            className={`${payment === "pix" ? "text-white" : "text-zinc-800"} text-sm mt-1`}
          >
            PIX
          </span>
        </label>
        <label
          htmlFor="cartao"
          className={`flex flex-col items-center ${payment === "cartao" ? "bg-zinc-800 text-white shadow-lg" : "bg-zinc-200 opacity-50 hover:opacity-60"} p-2 w-full lg:w-48 rounded-md cursor-pointer transition-all shadow-md`}
        >
          <input
            className="hidden"
            type="radio"
            name="payment"
            id="cartao"
            checked={payment === "cartao"}
            onChange={() => setPayment("cartao")}
          />
          <Image
            className={`${payment === "cartao" && "invert-100"}`}
            src={"/card.svg"}
            alt="Card"
            height={40}
            width={40}
          />
          <span
            className={`${payment === "cartao" ? "text-white" : "text-zinc-800"} text-sm mt-1`}
          >
            CARTÃO
          </span>
        </label>
        <label
          htmlFor="dinheiro"
          className={`flex flex-col items-center ${payment === "dinheiro" ? "bg-zinc-800 text-white shadow-lg" : "bg-zinc-200 text-zinc-800 opacity-50 hover:opacity-60"} p-2 w-full lg:w-48 rounded-md cursor-pointer transition-all shadow-md`}
        >
          <input
            className="hidden"
            type="radio"
            name="payment"
            id="dinheiro"
            checked={payment === "dinheiro"}
            onChange={() => setPayment("dinheiro")}
          />
          <Image
            className={`${payment === "dinheiro" && "invert-100"}`}
            src={"/money.svg"}
            alt="dinheiro"
            height={40}
            width={40}
          />
          <span
            className={`${payment === "dinheiro" ? "text-white" : "text-zinc-800"} text-sm mt-1`}
          >
            DINHEIRO
          </span>
        </label>
      </div>

      {payment === "dinheiro" && (
        <>
          <label htmlFor="troco" className="mt-5 mb-1">
            PRECISA DE TROCO? <span></span>
          </label>
          <input
            value={troco}
            onChange={(e) => setTroco(e.target.value)}
            name="troco"
            id="troco"
            placeholder="Insira o valor"
            type="number"
            className="w-full p-2 border border-zinc-400 rounded-md"
          />
        </>
      )}
    </section>
  );
};
