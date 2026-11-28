"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import {
  FiClock,
  FiExternalLink,
  FiFacebook,
  FiInstagram,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiMessageSquare,
  FiPrinter,
  FiTrash2,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";
import { TituloAdmin } from "@/components/admin/TituloAdmin";
import { Container } from "@/components/Container";
import { ErrorState, LoadingState } from "@/components/ui/QueryState";
import type { OpeningHour, Settings } from "@/types/config";
import {
  useOpeningHoursQuery,
  useRemoveOpeningHour,
  useSaveOpeningHours,
  useSaveSettings,
  useSettingsQuery,
  useStoreStatusQuery,
} from "@/queries/config";

const SETTINGS_VAZIO: Settings = {
  fechado_manual: "0",
  mensagem_rodape: "",
  facebook_url: "",
  instagram_url: "",
  whatsapp_number: "",
  phone_number: "",
  address: "",
  tamanho_bobina: "",
};

const diasSemana = [
  { value: "1", label: "Segunda" },
  { value: "2", label: "Terça" },
  { value: "3", label: "Quarta" },
  { value: "4", label: "Quinta" },
  { value: "5", label: "Sexta" },
  { value: "6", label: "Sábado" },
  { value: "7", label: "Domingo" },
];

/** Larguras comuns de bobina de impressora térmica. */
const LARGURAS_BOBINA = ["58mm", "80mm", "86mm"];
const OUTRA = "Outra";
const LIMITE_RODAPE = 300;

const campoClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-purple-principal-500 focus:ring-2 focus:ring-purple-principal-500/20";

/** "09:30:00" → "09:30" (o input de hora e a comparação usam HH:MM). */
const hhmm = (hora: string) => (hora ?? "").slice(0, 5);

/** Só os campos editáveis, para saber se algo mudou desde o servidor. */
const assinaturaHorarios = (lista: OpeningHour[]) =>
  JSON.stringify(
    [...lista]
      .sort((a, b) => Number(a.dia_semana) - Number(b.dia_semana))
      .map((h) => [h.dia_semana, hhmm(h.horario_abertura), hhmm(h.horario_fechamento), h.observacao ?? ""]),
  );
const assinaturaSettings = (s: Settings) =>
  JSON.stringify(Object.keys(SETTINGS_VAZIO).map((k) => s[k as keyof Settings] ?? ""));

/* ---------- Peças visuais ---------- */

const Cartao = ({
  icone,
  titulo,
  descricao,
  children,
}: {
  icone: ReactNode;
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) => (
  <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <header className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-principal-500/10 text-lg text-purple-principal-700">
        {icone}
      </span>
      <div>
        <h2 className="font-semibold text-zinc-900">{titulo}</h2>
        {descricao && <p className="text-sm text-zinc-500">{descricao}</p>}
      </div>
    </header>
    {children}
  </section>
);

const Campo = ({
  id,
  rotulo,
  dica,
  icone,
  children,
}: {
  id: string;
  rotulo: string;
  dica?: string;
  icone?: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
      {icone && <span className="text-zinc-400">{icone}</span>}
      {rotulo}
    </label>
    {children}
    {dica && <p className="text-xs text-zinc-500">{dica}</p>}
  </div>
);

/** Link para conferir se a URL digitada abre o lugar certo. */
const Testar = ({ url }: { url: string }) =>
  /^https?:\/\//i.test(url.trim()) ? (
    <a
      href={url.trim()}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-1 text-xs font-medium text-purple-principal-700 hover:underline"
    >
      Abrir link <FiExternalLink aria-hidden />
    </a>
  ) : null;

/* ---------- Página ---------- */

const Config = () => {
  const settingsQuery = useSettingsQuery();
  const horariosQuery = useOpeningHoursQuery();
  const status = useStoreStatusQuery();
  const settingsServidor = settingsQuery.data;
  const horariosServidor = horariosQuery.data;
  const saveSettings = useSaveSettings();
  const saveOpeningHours = useSaveOpeningHours();
  const removeOpeningHourMutation = useRemoveOpeningHour();

  // Estado do formulário: começa com o que veio do servidor e é editado aqui.
  const [storeSettings, setStoreSettings] = useState<Settings>(SETTINGS_VAZIO);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [salvando, setSalvando] = useState(false);
  // Largura fora das opções comuns: mostra o campo para digitar
  const [bobinaOutra, setBobinaOutra] = useState(false);
  // Dias já apagados na API nesta visita (a lista do servidor só recarrega ao salvar)
  const [diasRemovidos, setDiasRemovidos] = useState<string[]>([]);

  useEffect(() => {
    if (settingsServidor) {
      setStoreSettings(settingsServidor);
      setBobinaOutra(
        !!settingsServidor.tamanho_bobina && !LARGURAS_BOBINA.includes(settingsServidor.tamanho_bobina),
      );
    }
  }, [settingsServidor]);

  useEffect(() => {
    if (horariosServidor) {
      setOpeningHours(horariosServidor);
      setDiasRemovidos([]);
    }
  }, [horariosServidor]);

  const setSettings = (parcial: Partial<Settings>) =>
    setStoreSettings((atual) => ({ ...atual, ...parcial }));

  const alterado = useMemo(
    () =>
      !!settingsServidor &&
      !!horariosServidor &&
      (assinaturaSettings(storeSettings) !== assinaturaSettings(settingsServidor) ||
        assinaturaHorarios(openingHours) !==
          assinaturaHorarios(horariosServidor.filter((h) => !diasRemovidos.includes(h.dia_semana)))),
    [storeSettings, openingHours, settingsServidor, horariosServidor, diasRemovidos],
  );

  // Avisa antes de sair da página com alterações não salvas
  useEffect(() => {
    if (!alterado) return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [alterado]);

  /* ---------- Horários ---------- */

  const horarioDoDia = (dia: string) => openingHours.find((h) => h.dia_semana === dia);

  const abrirDia = (dia: string) =>
    setOpeningHours((atual) => [
      ...atual,
      { horario_abertura: "09:30", horario_fechamento: "15:30", dia_semana: dia, observacao: "" },
    ]);

  const alterarHorario = <K extends keyof OpeningHour>(dia: string, campo: K, valor: OpeningHour[K]) =>
    setOpeningHours((atual) => atual.map((h) => (h.dia_semana === dia ? { ...h, [campo]: valor } : h)));

  const fecharDia = (dia: string) => {
    const item = horarioDoDia(dia);
    if (!item) return;
    const nomeDia = diasSemana.find((d) => d.value === dia)?.label ?? "este dia";
    const tirarDaTela = () => setOpeningHours((atual) => atual.filter((h) => h.dia_semana !== dia));

    // Ainda não salvo: só sai da tela
    if (!item.id) {
      tirarDaTela();
      return;
    }

    if (!confirm(`Remover o horário de ${nomeDia}? A loja ficará fechada nesse dia.`)) return;

    removeOpeningHourMutation.mutate(Number(dia), {
      onSuccess: () => {
        tirarDaTela();
        setDiasRemovidos((atual) => [...atual, dia]);
        toast.success(`Horário de ${nomeDia} removido. A loja fica fechada nesse dia.`);
      },
      onError: () => toast.error("Não foi possível remover o horário."),
    });
  };

  /* ---------- Salvar ---------- */

  const handleSave = async () => {
    const invalido = openingHours.find(
      (h) =>
        !hhmm(h.horario_abertura) ||
        !hhmm(h.horario_fechamento) ||
        hhmm(h.horario_fechamento) <= hhmm(h.horario_abertura),
    );
    if (invalido) {
      const nome = diasSemana.find((d) => d.value === invalido.dia_semana)?.label;
      toast.warn(`Confira o horário de ${nome}: o fechamento precisa ser depois da abertura.`);
      return;
    }

    setSalvando(true);
    try {
      await saveSettings.mutateAsync(storeSettings);
      // Ao terminar, a lista é recarregada e os itens novos recebem o id
      await saveOpeningHours.mutateAsync(openingHours);
      toast.success("Configurações salvas com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar as configurações");
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  // Salvar o formulário vazio (dados não carregaram) apagaria as configurações
  const erroAoCarregar =
    (settingsQuery.isError && !settingsServidor) || (horariosQuery.isError && !horariosServidor);
  const carregando = settingsQuery.isPending || horariosQuery.isPending;

  if (erroAoCarregar || carregando) {
    return (
      <Container styleRow="bg-zinc-100" styleContainer="min-h-screen mb-10">
        <div className="py-4">
          <TituloAdmin title="Configurações da Loja" />
        </div>
        {erroAoCarregar ? (
          <ErrorState
            mensagem="Não foi possível carregar as configurações. Nada foi alterado."
            onRetry={() => {
              settingsQuery.refetch();
              horariosQuery.refetch();
            }}
            tentando={settingsQuery.isFetching || horariosQuery.isFetching}
          />
        ) : (
          <LoadingState mensagem="Carregando configurações..." />
        )}
      </Container>
    );
  }

  const fechadoManual = storeSettings.fechado_manual === "1";
  const diasAbertos = openingHours.length;

  return (
    <Container styleRow="bg-zinc-100" styleContainer="min-h-screen pb-28">
      <div className="py-4">
        <TituloAdmin title="Configurações da Loja" />
      </div>

      <div className="flex flex-col gap-5">
        {/* ---------- Status da loja ---------- */}
        <section
          className={`flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
            fechadoManual ? "border-red-200 bg-red-50" : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 shrink-0 rounded-full ${
                status.loading ? "bg-zinc-300" : status.storeOpen ? "bg-green-500" : "bg-red-500"
              }`}
              aria-hidden
            />
            <div>
              <p className="font-semibold text-zinc-900">
                {status.loading
                  ? "Verificando..."
                  : status.storeOpen
                    ? "Loja aberta agora"
                    : "Loja fechada agora"}
              </p>
              <p className="text-sm text-zinc-600">
                Calculado pelos horários abaixo e pela opção de fechar manualmente.
              </p>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 self-start sm:self-auto">
            <span className="text-right text-sm">
              <span className="block font-medium text-zinc-900">Fechar a loja manualmente</span>
              <span className="block text-zinc-500">
                {fechadoManual ? "Ninguém consegue pedir" : "Segue os horários"}
              </span>
            </span>
            <input
              type="checkbox"
              role="switch"
              className="peer sr-only"
              checked={fechadoManual}
              onChange={(e) => setSettings({ fechado_manual: e.target.checked ? "1" : "0" })}
            />
            <span className="relative h-7 w-12 shrink-0 rounded-full bg-zinc-300 transition peer-checked:bg-red-600 peer-focus-visible:ring-2 peer-focus-visible:ring-red-400 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
          </label>
        </section>

        {/* ---------- Horários ---------- */}
        <Cartao
          icone={<FiClock />}
          titulo="Horários de funcionamento"
          descricao={`Aberta ${diasAbertos} ${diasAbertos === 1 ? "dia" : "dias"} por semana. Dia sem horário = loja fechada.`}
        >
          <ul className="divide-y divide-zinc-100">
            {diasSemana.map(({ value: dia, label }) => {
              const item = horarioDoDia(dia);
              return (
                <li
                  key={dia}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="w-24 shrink-0 font-medium text-zinc-900">{label}</span>

                  {item ? (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          aria-label={`Abertura de ${label}`}
                          className={`${campoClass} w-32`}
                          value={hhmm(item.horario_abertura)}
                          onChange={(e) => alterarHorario(dia, "horario_abertura", e.target.value)}
                        />
                        <span className="text-zinc-400">até</span>
                        <input
                          type="time"
                          aria-label={`Fechamento de ${label}`}
                          className={`${campoClass} w-32`}
                          value={hhmm(item.horario_fechamento)}
                          onChange={(e) => alterarHorario(dia, "horario_fechamento", e.target.value)}
                        />
                      </div>
                      <input
                        type="text"
                        aria-label={`Observação de ${label}`}
                        placeholder="Observação (opcional)"
                        className={`${campoClass} sm:flex-1`}
                        value={item.observacao ?? ""}
                        onChange={(e) => alterarHorario(dia, "observacao", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => fecharDia(dia)}
                        disabled={removeOpeningHourMutation.isPending}
                        className="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                      >
                        <FiTrash2 aria-hidden />
                        Fechar
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-sm text-zinc-500">
                        Fechado
                      </span>
                      <button
                        type="button"
                        onClick={() => abrirDia(dia)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-purple-principal-700 transition hover:bg-purple-principal-500/10"
                      >
                        <FiPlus aria-hidden />
                        Abrir neste dia
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Cartao>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* ---------- Contato ---------- */}
          <Cartao icone={<FiPhone />} titulo="Contato" descricao="Aparece no rodapé do site e nos pedidos.">
            <div className="flex flex-col gap-4">
              <Campo
                id="whatsapp_number"
                rotulo="WhatsApp"
                icone={<FaWhatsapp />}
                dica="Recebe os pedidos dos clientes. Com DDD, ex.: 11 99999-9999."
              >
                <input
                  id="whatsapp_number"
                  inputMode="tel"
                  className={campoClass}
                  value={storeSettings.whatsapp_number ?? ""}
                  onChange={(e) => setSettings({ whatsapp_number: e.target.value })}
                />
              </Campo>
              <Campo id="phone_number" rotulo="Telefone" icone={<FiPhone />}>
                <input
                  id="phone_number"
                  inputMode="tel"
                  className={campoClass}
                  value={storeSettings.phone_number ?? ""}
                  onChange={(e) => setSettings({ phone_number: e.target.value })}
                />
              </Campo>
              <Campo
                id="address"
                rotulo="Endereço"
                icone={<FiMapPin />}
                dica="Mostrado para quem escolhe retirar na loja."
              >
                <input
                  id="address"
                  className={campoClass}
                  value={storeSettings.address ?? ""}
                  onChange={(e) => setSettings({ address: e.target.value })}
                />
              </Campo>
            </div>
          </Cartao>

          {/* ---------- Redes sociais ---------- */}
          <Cartao icone={<FiInstagram />} titulo="Redes sociais" descricao="Links do rodapé e da página de agradecimento.">
            <div className="flex flex-col gap-4">
              <Campo id="instagram_url" rotulo="Instagram" icone={<FiInstagram />}>
                <input
                  id="instagram_url"
                  type="url"
                  placeholder="https://instagram.com/..."
                  className={campoClass}
                  value={storeSettings.instagram_url ?? ""}
                  onChange={(e) => setSettings({ instagram_url: e.target.value })}
                />
                <Testar url={storeSettings.instagram_url ?? ""} />
              </Campo>
              <Campo id="facebook_url" rotulo="Facebook" icone={<FiFacebook />}>
                <input
                  id="facebook_url"
                  type="url"
                  placeholder="https://facebook.com/..."
                  className={campoClass}
                  value={storeSettings.facebook_url ?? ""}
                  onChange={(e) => setSettings({ facebook_url: e.target.value })}
                />
                <Testar url={storeSettings.facebook_url ?? ""} />
              </Campo>
            </div>
          </Cartao>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* ---------- Impressão ---------- */}
          <Cartao
            icone={<FiPrinter />}
            titulo="Impressão"
            descricao="Largura do papel da impressora térmica dos pedidos."
          >
            <div className="flex flex-col gap-3">
              <div role="radiogroup" aria-label="Largura da bobina" className="flex flex-wrap gap-2">
                {[...LARGURAS_BOBINA, OUTRA].map((opcao) => {
                  const ativa = opcao === OUTRA ? bobinaOutra : storeSettings.tamanho_bobina === opcao;
                  return (
                    <button
                      key={opcao}
                      type="button"
                      role="radio"
                      aria-checked={ativa}
                      onClick={() => {
                        if (opcao === OUTRA) {
                          setBobinaOutra(true);
                        } else {
                          setBobinaOutra(false);
                          setSettings({ tamanho_bobina: opcao });
                        }
                      }}
                      className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        ativa
                          ? "border-purple-principal-700 bg-purple-principal-700 text-white"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-purple-principal-500"
                      }`}
                    >
                      {opcao}
                    </button>
                  );
                })}
              </div>
              {bobinaOutra && (
                <Campo id="tamanho_bobina" rotulo="Largura" dica="Com a unidade, ex.: 76mm.">
                  <input
                    id="tamanho_bobina"
                    className={`${campoClass} sm:w-40`}
                    value={storeSettings.tamanho_bobina ?? ""}
                    onChange={(e) => setSettings({ tamanho_bobina: e.target.value })}
                  />
                </Campo>
              )}
              <p className="text-xs text-zinc-500">
                A maioria das impressoras usa 58mm ou 80mm. Confira na etiqueta do rolo de papel.
              </p>
            </div>
          </Cartao>

          {/* ---------- Rodapé ---------- */}
          <Cartao
            icone={<FiMessageSquare />}
            titulo="Rodapé do site"
            descricao="Texto que aparece embaixo do logo, no fim de todas as páginas."
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="mensagem_rodape" className="sr-only">
                  Mensagem no rodapé
                </label>
                <textarea
                  id="mensagem_rodape"
                  rows={3}
                  maxLength={LIMITE_RODAPE}
                  className={`${campoClass} resize-y`}
                  value={storeSettings.mensagem_rodape ?? ""}
                  onChange={(e) => setSettings({ mensagem_rodape: e.target.value })}
                />
                <p className="self-end text-xs tabular-nums text-zinc-500">
                  {(storeSettings.mensagem_rodape ?? "").length}/{LIMITE_RODAPE}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Prévia</p>
                <div className="rounded-xl bg-green-principal-500 p-4 text-white">
                  <Image src="/logo-footer.svg" alt="" width={150} height={30} />
                  <p className="mt-2 text-sm">
                    {storeSettings.mensagem_rodape || (
                      <span className="italic text-white/70">Sem mensagem</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Cartao>
        </div>
      </div>

      {/* ---------- Barra de salvar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3">
          <p className={`text-sm ${alterado ? "font-medium text-amber-700" : "text-zinc-500"}`}>
            {alterado ? "Você tem alterações não salvas." : "Tudo salvo."}
          </p>
          <button
            onClick={handleSave}
            disabled={!alterado || salvando}
            className="cursor-pointer rounded-lg bg-purple-principal-700 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar configurações"}
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Config;
