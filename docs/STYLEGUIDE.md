# Guia de Estilo - Restaurante Spumoni

Este documento estabelece os padrões de código, UI/UX e boas práticas para o desenvolvimento do projeto Restaurante Spumoni.

## Padrões de Código

### Estilo de Código

- Utilize TypeScript para todo o código JavaScript
- Indentação: 4 espaços
- Use aspas simples (`'`) para strings
- Termine cada instrução com ponto e vírgula (`;`)
- Limite o comprimento das linhas a 100 caracteres
- Use destructuring para acessar propriedades de objetos
- Prefira arrow functions para funções anônimas

### Nomenclatura

- **Componentes**: PascalCase (ex: `ProductCard.tsx`)
- **Arquivos de hooks**: camelCase com prefixo "use" (ex: `useCart.ts`)
- **Arquivos de serviços**: camelCase (ex: `productService.ts`)
- **Interfaces**: Prefixo "I" seguido de PascalCase (ex: `IProduct`)
- **Variáveis e funções**: camelCase (ex: `getUserData`)
- **Constantes globais**: UPPER_SNAKE_CASE (ex: `MAX_ITEMS_PER_PAGE`)

### Estrutura de Componentes

- Defina interfaces para as props do componente
- Utilize a arrow function para criação de componentes
- Exporte o componente como default ao final do arquivo
- Importe e exporte explicitamente (não use o padrão `export * from`)

Exemplo:

```tsx
import React from 'react';

interface ButtonProps {
    text: string;
    onClick: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
    return (
        <button 
            className="bg-purple-principal-500 text-white py-2 px-4 rounded-lg"
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default Button;
```

## UI/UX

### Cores

Use consistentemente as seguintes cores em toda a aplicação:

| Nome                 | Hex       | Uso                       |
|----------------------|-----------|---------------------------|
| Purple Principal     | `#7E57C2` | Identidade visual primária, botões principais |
| Purple Secondary     | `#9575CD` | Elementos secundários, hover states |
| Background Light     | `#F5F5F5` | Fundo geral da aplicação |
| Background White     | `#FFFFFF` | Cards, modais, elementos flutuantes |
| Text Primary         | `#333333` | Texto principal |
| Text Secondary       | `#666666` | Texto secundário, descrições |
| Success              | `#4CAF50` | Estados de sucesso, confirmações |
| Error                | `#F44336` | Estados de erro, alertas |
| Warning              | `#FFC107` | Avisos |

### Tipografia

- **Fonte principal**: Sistema sans-serif (Inter ou equivalente)
- **Tamanhos de fonte**:
  - Títulos principais: 24px
  - Títulos secundários: 20px
  - Texto normal: 16px
  - Texto pequeno: 14px
  - Texto muito pequeno: 12px

### Espaçamento

Use o sistema de espaçamento do Tailwind de maneira consistente:

- `p-2` (0.5rem): Espaçamento interno mínimo
- `p-4` (1rem): Espaçamento interno padrão
- `p-6` (1.5rem): Espaçamento interno amplo
- `m-2` (0.5rem): Margem mínima
- `m-4` (1rem): Margem padrão
- `m-6` (1.5rem): Margem ampla
- `gap-2` (0.5rem): Espaçamento mínimo entre itens
- `gap-4` (1rem): Espaçamento padrão entre itens

### Componentes UI

#### Botões

- **Botão Principal**: `bg-purple-principal-500 text-white py-2 px-4 rounded-lg`
- **Botão Secundário**: `bg-white border border-purple-principal-500 text-purple-principal-500 py-2 px-4 rounded-lg`
- **Botão de Ação**: `bg-success text-white py-2 px-4 rounded-lg`
- **Botão de Perigo**: `bg-error text-white py-2 px-4 rounded-lg`

#### Cards

- Utilize sombra suave: `shadow-md`
- Cantos arredondados: `rounded-lg`
- Padding interno consistente: `p-4`
- Fundo branco: `bg-white`

#### Formulários

- Inputs com altura consistente: `h-10`
- Cantos arredondados: `rounded-md`
- Border na cor cinza quando inativo: `border-gray-300`
- Border na cor principal quando com foco: `focus:border-purple-principal-500`
- Adicione sempre um label descritivo
- Mensagens de erro em vermelho abaixo do campo

#### Modais

- Fundo escuro semi-transparente: `bg-black bg-opacity-50`
- Conteúdo com fundo branco: `bg-white`
- Cantos arredondados: `rounded-lg`
- Sombra pronunciada: `shadow-xl`
- Padding interno amplo: `p-6`

## Responsividade

A aplicação deve ser responsiva seguindo a abordagem mobile-first:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Utilize as classes de breakpoints do Tailwind:
- `sm:` - 640px e acima
- `md:` - 768px e acima
- `lg:` - 1024px e acima
- `xl:` - 1280px e acima

## Acessibilidade

- Utilize atributos `aria-*` apropriados
- Certifique-se de que todos os elementos interativos são acessíveis por teclado
- Mantenha contraste adequado entre texto e fundo
- Adicione textos alternativos a imagens (`alt`)
- Use elementos semânticos (como `<button>` em vez de `<div onClick>`)

## Práticas de Gerenciamento de Estado

- Utilize o Zustand de forma consistente para gerenciamento de estado global
- Mantenha o estado o mais local possível
- Divida stores por domínio da aplicação (carrinho, produtos, usuário)
- Use dados persistidos apenas quando necessário

## Boas Práticas para Performance

- Minimize o número de re-renderizações usando `memo` quando apropriado
- Utilize imagens otimizadas com componente `next/image`
- Prefira carregar dados no servidor com funções assíncronas do Next.js
- Implemente lazy loading para componentes pesados
- Otimize bundle sizes com importações dinâmicas

## Padrões de Commit

Utilize mensagens de commit semânticas:

- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para alterações na documentação
- `style:` para alterações que não afetam a lógica (formatação)
- `refactor:` para refatorações de código
- `test:` para adicionar ou corrigir testes
- `chore:` para alterações em tarefas de build ou ferramentas auxiliares

Exemplo: `feat: adiciona componente de seleção de endereço` 