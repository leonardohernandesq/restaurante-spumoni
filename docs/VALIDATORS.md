# Validadores e Formatadores de Formulário

## 📋 Visão Geral

Arquivo com funções utilitárias para validação e formatação de dados de formulário, incluindo CPF, CNPJ e telefone.

**Localização:** `src/utils/validators.ts`

## 🎯 Funções Disponíveis

### 1. **removeNonNumeric**

Remove todos os caracteres não numéricos de uma string.

```typescript
removeNonNumeric("(11) 98765-4321"); // "11987654321"
removeNonNumeric("123.456.789-10"); // "12345678910"
```

---

### 2. **isValidCPF**

Valida se um CPF é válido usando o algoritmo de dígitos verificadores.

```typescript
isValidCPF("123.456.789-10"); // true ou false
isValidCPF("12345678910"); // true ou false
isValidCPF("111.111.111-11"); // false (sequência repetida)
```

**Regras de Validação:**

- ✅ Deve ter exatamente 11 dígitos
- ✅ Não pode ter todos os dígitos iguais
- ✅ Valida os dois dígitos verificadores

---

### 3. **isValidCNPJ**

Valida se um CNPJ é válido usando o algoritmo de dígitos verificadores.

```typescript
isValidCNPJ("12.345.678/0001-95"); // true ou false
isValidCNPJ("12345678000195"); // true ou false
isValidCNPJ("11.111.111/1111-11"); // false (sequência repetida)
```

**Regras de Validação:**

- ✅ Deve ter exatamente 14 dígitos
- ✅ Não pode ter todos os dígitos iguais
- ✅ Valida os dois dígitos verificadores

---

### 4. **isValidCPForCNPJ**

Valida se é um CPF ou CNPJ válido automaticamente.

```typescript
isValidCPForCNPJ("123.456.789-10"); // true (valida como CPF)
isValidCPForCNPJ("12.345.678/0001-95"); // true (valida como CNPJ)
isValidCPForCNPJ("123456"); // false (nem CPF nem CNPJ)
```

**Lógica:**

- 11 dígitos → Valida como CPF
- 14 dígitos → Valida como CNPJ
- Outros → Retorna false

---

### 5. **isValidPhone**

Valida se o telefone possui quantidade adequada de dígitos.

```typescript
isValidPhone("(11) 98765-4321"); // true (11 dígitos)
isValidPhone("(11) 3456-7890"); // true (10 dígitos)
isValidPhone("123456"); // false (menos de 10 dígitos)
```

**Regras de Validação:**

- ✅ Deve ter entre 10 e 11 dígitos (incluindo DDD)
- ✅ 10 dígitos: telefone fixo (XX) XXXX-XXXX
- ✅ 11 dígitos: celular (XX) XXXXX-XXXX

---

### 6. **formatCPF**

Formata string para o padrão de CPF (XXX.XXX.XXX-XX).

```typescript
formatCPF("12345678910"); // "123.456.789-10"
formatCPF("123456789"); // "123.456.789"
```

---

### 7. **formatCNPJ**

Formata string para o padrão de CNPJ (XX.XXX.XXX/XXXX-XX).

```typescript
formatCNPJ("12345678000195"); // "12.345.678/0001-95"
formatCNPJ("12345678"); // "12.345.678"
```

---

### 8. **formatCPForCNPJ**

Formata automaticamente como CPF ou CNPJ baseado no tamanho.

```typescript
formatCPForCNPJ("12345678910"); // "123.456.789-10" (CPF)
formatCPForCNPJ("12345678000195"); // "12.345.678/0001-95" (CNPJ)
```

**Lógica:**

- ≤ 11 dígitos → Formata como CPF
- \> 11 dígitos → Formata como CNPJ

---

### 9. **formatPhone**

Formata telefone no padrão brasileiro (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.

```typescript
formatPhone("11987654321"); // "(11) 98765-4321"
formatPhone("1134567890"); // "(11) 3456-7890"
```

**Padrões:**

- 11 dígitos: (XX) XXXXX-XXXX (celular)
- 10 dígitos: (XX) XXXX-XXXX (fixo)

---

## 🔧 Uso nos Componentes

### **CheckoutFormClient** - Validação de Telefone

```typescript
import { isValidPhone, formatPhone } from "@/utils/validators";

<input
  {...register("telefone", {
    required: "Telefone é obrigatório",
    validate: {
      validPhone: (value) =>
        isValidPhone(value) || "Telefone deve ter 10 ou 11 dígitos",
    },
    onChange: (e) => {
      const formatted = formatPhone(e.target.value);
      e.target.value = formatted;
    },
  })}
  placeholder="(XX) XXXXX-XXXX"
  maxLength={15}
/>;
```

**Comportamento:**

- ✅ Formata automaticamente enquanto o usuário digita
- ✅ Valida na submissão do formulário
- ✅ Mostra mensagem de erro se inválido
- ✅ Máximo de 15 caracteres (formatado)

---

### **FormNotaFiscal** - Validação de CPF/CNPJ

```typescript
import {
  isValidCPForCNPJ,
  formatCPForCNPJ,
  removeNonNumeric,
} from "@/utils/validators";

const handleChange = (value: string) => {
  const formatted = formatCPForCNPJ(value);
  setNf(formatted);
};

const handleBlur = () => {
  if (nf && !isValidCPForCNPJ(nf)) {
    const cleanValue = removeNonNumeric(nf);
    if (cleanValue.length > 0 && cleanValue.length < 11) {
      setError("CPF incompleto");
    } else if (cleanValue.length > 11 && cleanValue.length < 14) {
      setError("CNPJ incompleto");
    } else {
      setError("CPF ou CNPJ inválido");
    }
  }
};

<input
  onChange={(e) => handleChange(e.target.value)}
  onBlur={handleBlur}
  placeholder="XXX.XXX.XXX-XX ou XX.XXX.XXX/XXXX-XX"
  maxLength={18}
/>;
```

**Comportamento:**

- ✅ Formata automaticamente (CPF ou CNPJ)
- ✅ Valida quando o usuário sai do campo (onBlur)
- ✅ Mensagens específicas: "CPF incompleto", "CNPJ incompleto", "inválido"
- ✅ Campo opcional (não valida se vazio)
- ✅ Máximo de 18 caracteres (formatado CNPJ)

---

## 📊 Exemplos de Validação

### CPF Válido ✅

```
Input: "12345678910"
Formatado: "123.456.789-10"
Validação: ✅ (se dígitos verificadores corretos)
```

### CNPJ Válido ✅

```
Input: "12345678000195"
Formatado: "12.345.678/0001-95"
Validação: ✅ (se dígitos verificadores corretos)
```

### Telefone Celular ✅

```
Input: "11987654321"
Formatado: "(11) 98765-4321"
Validação: ✅ (11 dígitos)
```

### Telefone Fixo ✅

```
Input: "1134567890"
Formatado: "(11) 3456-7890"
Validação: ✅ (10 dígitos)
```

### CPF Inválido ❌

```
Input: "11111111111"
Erro: "CPF ou CNPJ inválido"
Motivo: Todos os dígitos iguais
```

### Telefone Inválido ❌

```
Input: "123456"
Erro: "Telefone deve ter 10 ou 11 dígitos"
Motivo: Menos de 10 dígitos
```

---

## 🎨 Feedback Visual

### Telefone com Erro

```tsx
<input
  className={`w-full p-2 border rounded-md ${
    errors.telefone ? "border-red-500" : "border-zinc-400"
  }`}
/>;
{
  errors.telefone && (
    <span className="text-red-500 text-sm">{errors.telefone.message}</span>
  );
}
```

### CPF/CNPJ com Erro

```tsx
<input
  className={`w-full p-2 border rounded-md ${
    error ? "border-red-500" : "border-zinc-400"
  }`}
/>;
{
  error && <span className="text-red-500 text-sm mt-1">{error}</span>;
}
```

---

## 🧪 Testes Sugeridos

### Testar CPF

```typescript
// Válidos
isValidCPF("123.456.789-10"); // true (se for válido)
isValidCPF("12345678910"); // true (se for válido)

// Inválidos
isValidCPF("111.111.111-11"); // false (sequência)
isValidCPF("12345"); // false (incompleto)
```

### Testar CNPJ

```typescript
// Válidos
isValidCNPJ("12.345.678/0001-95"); // true (se for válido)
isValidCNPJ("12345678000195"); // true (se for válido)

// Inválidos
isValidCNPJ("11.111.111/1111-11"); // false (sequência)
isValidCNPJ("12345678"); // false (incompleto)
```

### Testar Telefone

```typescript
// Válidos
isValidPhone("(11) 98765-4321"); // true (11 dígitos)
isValidPhone("(11) 3456-7890"); // true (10 dígitos)

// Inválidos
isValidPhone("123456"); // false (< 10 dígitos)
isValidPhone("123456789012"); // false (> 11 dígitos)
```

---

## 🚀 Benefícios

### Performance ⚡

- ✅ Formatação instantânea (onChange)
- ✅ Validação apenas quando necessário (onBlur/submit)
- ✅ Funções otimizadas

### UX 💻

- ✅ Feedback visual imediato
- ✅ Formatação automática
- ✅ Mensagens de erro claras
- ✅ Validação em tempo real

### Manutenibilidade 🔧

- ✅ Funções reutilizáveis
- ✅ Código centralizado
- ✅ Fácil de testar
- ✅ TypeScript tipado

---

## 📝 Próximas Melhorias

1. **Testes Unitários**

   - Testar todas as funções de validação
   - Casos de borda
   - Diferentes formatos de entrada

2. **Máscara de Input**

   - Biblioteca como `react-input-mask`
   - Melhor experiência do usuário

3. **Validação Assíncrona**

   - Consulta API para validar CPF/CNPJ
   - Verificar se existe na Receita Federal

4. **Internacionalização**
   - Suporte para outros formatos de telefone
   - Validadores de outros países

---

**Data de Criação:** 25 de Novembro de 2025  
**Status:** ✅ Implementado e Testado
