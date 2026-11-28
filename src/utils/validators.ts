import { removeNonNumeric } from "./format";

/** Valida se o CPF é válido. */
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = removeNonNumeric(cpf);

  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

/** Valida se o CNPJ é válido. */
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = removeNonNumeric(cnpj);

  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

  // Validação do primeiro dígito verificador
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  // Validação do segundo dígito verificador
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};

/** Valida se é um CPF ou CNPJ válido. */
export const isValidCPForCNPJ = (value: string): boolean => {
  const cleanValue = removeNonNumeric(value);

  if (cleanValue.length === 11) return isValidCPF(cleanValue);
  if (cleanValue.length === 14) return isValidCNPJ(cleanValue);

  return false;
};

/** Telefone com DDD: 10 (fixo) ou 11 (celular) dígitos. */
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = removeNonNumeric(phone);
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};
