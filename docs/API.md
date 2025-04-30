# Documentação de API e Integrações

Este documento detalha as integrações de API utilizadas no projeto Restaurante Spumoni.

## Configuração da API

A comunicação com a API é centralizada através do arquivo `src/config/api.ts`, que configura uma instância do Axios:

```typescript
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
```

A URL base da API é definida através da variável de ambiente `NEXT_PUBLIC_API_URL`.

## Serviços de API

### Autenticação (`auth.ts`)

Responsável por gerenciar a autenticação de usuários, principalmente para o acesso ao painel administrativo.

**Principais Endpoints:**
- Login de administrador
- Verificação de sessão
- Logout

### Categorias (`category.ts`)

Gerencia as categorias de produtos disponíveis no cardápio.

**Principais Endpoints:**
- Listar todas as categorias
- Obter categoria por ID/slug
- Criar nova categoria (admin)
- Atualizar categoria (admin)
- Excluir categoria (admin)

### Produtos (`produto.ts`)

Gerencia os produtos disponíveis no cardápio.

**Principais Endpoints:**
- Listar todos os produtos
- Listar produtos por categoria
- Obter produto por ID/slug
- Criar novo produto (admin)
- Atualizar produto (admin)
- Excluir produto (admin)

### Pedidos (`pedido.ts`)

Gerencia os pedidos realizados pelos clientes.

**Principais Endpoints:**
- Criar novo pedido
- Listar pedidos (admin)
- Obter detalhes do pedido
- Atualizar status do pedido (admin)

## Formatos de Dados

### Formato de Produto

```json
{
  "id": "123",
  "name": "Pizza Margherita",
  "slug": "pizza-margherita",
  "description": "Molho de tomate, mussarela, manjericão fresco",
  "image_url": "https://example.com/pizza-margherita.jpg",
  "price": "45.90",
  "category": "pizzas"
}
```

### Formato de Pedido

```json
{
  "id": "order123",
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11999999999"
  },
  "delivery": {
    "type": "delivery",
    "address": {
      "street": "Rua Exemplo",
      "number": "123",
      "complement": "Apto 45",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipcode": "01234567"
    }
  },
  "payment": {
    "method": "credit_card",
    "status": "pending"
  },
  "items": [
    {
      "id": 1,
      "product_id": "123",
      "name": "Pizza Margherita",
      "price": 45.90,
      "quantity": 2,
      "notes": "Sem cebola",
      "attributes": [
        {
          "name": "Tamanho",
          "value": "Grande",
          "price": 0
        }
      ]
    }
  ],
  "status": "preparing",
  "created_at": "2023-10-15T14:30:00Z",
  "total": 91.80
}
```

## Middleware de Autenticação

O middleware de autenticação (`src/middleware.ts`) protege as rotas administrativas verificando a existência de um token nos cookies:

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token');

    if (
        req.nextUrl.pathname.startsWith('/admin') &&
        req.nextUrl.pathname !== '/admin' &&
        !token
    ) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
```

## Gerenciamento de Estado com Zustand

A aplicação utiliza Zustand para gerenciar o estado das interações com a API:

### Exemplo: categoryStore.ts

```typescript
import { create } from 'zustand';
import { ICategory } from '@/interfaces/ICategory';
import { getAllCategory } from '@/services/category';

interface CategoryState {
    categories: ICategory[];
    loading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
}

export const categoryStore = create<CategoryState>((set) => ({
    categories: [],
    loading: false,
    error: null,
    fetchCategories: async () => {
        try {
            set({ loading: true, error: null });
            const categories = await getAllCategory();
            set({ categories, loading: false });
        } catch (error) {
            set({ error: 'Erro ao buscar categorias', loading: false });
        }
    },
}));
```

## Tratamento de Erros

A aplicação deve implementar tratamento de erros consistente em todas as chamadas de API:

1. **Erros de rede**: Tratar problemas de conectividade
2. **Erros de autenticação**: Redirecionar para login quando o token expirar
3. **Erros de validação**: Exibir mensagens de erro específicas ao usuário
4. **Erros de servidor**: Mostrar mensagem genérica e registrar detalhes no console

## Fluxo de Autenticação

1. O usuário acessa a página de login administrativo (`/admin`)
2. Insere credenciais válidas
3. A API retorna um token que é armazenado nos cookies
4. O middleware permite acesso às rotas administrativas
5. As requisições subsequentes incluem automaticamente o cookie de autenticação

## Recomendações para Desenvolvimento

1. Sempre utilize os serviços existentes para comunicação com a API
2. Mantenha o tratamento de erros consistente
3. Utilize TypeScript para garantir a tipagem correta dos dados
4. Implemente testes unitários para os serviços de API
5. Considere adicionar interceptors no Axios para tratamento global de erros 