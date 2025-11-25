/**
 * Remove todos os caracteres não numéricos de uma string
 */
export const removeNonNumeric = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Valida se o CPF é válido
 */
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

/**
 * Valida se o CNPJ é válido
 */
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

/**
 * Valida se é um CPF ou CNPJ válido
 */
export const isValidCPForCNPJ = (value: string): boolean => {
  const cleanValue = removeNonNumeric(value);

  if (cleanValue.length === 11) {
    return isValidCPF(cleanValue);
  } else if (cleanValue.length === 14) {
    return isValidCNPJ(cleanValue);
  }

  return false;
};

/**
 * Valida se o telefone contém apenas números, espaços, parênteses, hífen e símbolo de +
 */
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = removeNonNumeric(phone);

  // Telefone deve ter entre 10 e 11 dígitos (DDD + número)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return false;
  }

  return true;
};

/**
 * Formata CPF (XXX.XXX.XXX-XX)
 */
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

/**
 * Formata CNPJ (XX.XXX.XXX/XXXX-XX)
 */
export const formatCNPJ = (value: string): string => {
  const cleanValue = removeNonNumeric(value);

  return cleanValue
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

/**
 * Formata CPF ou CNPJ automaticamente
 */
export const formatCPForCNPJ = (value: string): string => {
  const cleanValue = removeNonNumeric(value);

  if (cleanValue.length <= 11) {
    return formatCPF(value);
  } else {
    return formatCNPJ(value);
  }
};

/**
 * Formata telefone (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
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
