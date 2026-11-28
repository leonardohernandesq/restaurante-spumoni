/** Remove todos os caracteres não numéricos de uma string. */
export const removeNonNumeric = (value: string): string =>
  value.replace(/\D/g, "");

export const formatCurrencyBRL = (value: number): string =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

/** Formata CPF (XXX.XXX.XXX-XX). */
export const formatCPF = (value: string): string => {
  const cleanValue = removeNonNumeric(value);

  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return value;
};

/** Formata CNPJ (XX.XXX.XXX/XXXX-XX). */
export const formatCNPJ = (value: string): string =>
  removeNonNumeric(value)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");

/** Formata CPF ou CNPJ conforme a quantidade de dígitos. */
export const formatCPForCNPJ = (value: string): string =>
  removeNonNumeric(value).length <= 11 ? formatCPF(value) : formatCNPJ(value);

/** Formata telefone (XX) XXXXX-XXXX ou (XX) XXXX-XXXX. */
export const formatPhone = (value: string): string => {
  const cleanValue = removeNonNumeric(value);

  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2")
      .replace(/(\d{4})(\d{4})$/, "$1-$2");
  }

  return value;
};

/** Telefone para mostrar: com máscara se tiver DDD (10 ou 11 dígitos); senão, como veio. */
export const exibirTelefone = (telefone?: string | null): string => {
  if (!telefone) return "";
  const digitos = removeNonNumeric(telefone);
  return digitos.length === 10 || digitos.length === 11 ? formatPhone(digitos) : telefone;
};

/**
 * Converte um telefone brasileiro para o formato do wa.me (só dígitos, com DDI 55).
 *
 * - "(11) 98765-4321" → "5511987654321"
 * - "+55 11 98765-4321" → "5511987654321" (já tem DDI)
 */
export const toWhatsappNumber = (telefone: string): string => {
  const digits = removeNonNumeric(telefone);

  // 10 ou 11 dígitos = DDD + número, sem DDI
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
};

/**
 * Link para abrir a conversa com a mensagem pronta. Usa api.whatsapp.com
 * direto: o redirecionamento do wa.me estraga os emojis (viram "�").
 */
export const buildWhatsappUrl = (telefone: string, mensagem: string): string => {
  const url = `https://api.whatsapp.com/send?phone=${toWhatsappNumber(telefone)}`;
  return mensagem ? `${url}&text=${encodeURIComponent(mensagem)}` : url;
};
