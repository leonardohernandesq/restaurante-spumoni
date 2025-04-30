# Documentação do Projeto Restaurante Spumoni

## Visão Geral

O Restaurante Spumoni é uma aplicação web desenvolvida com Next.js para um restaurante italiano. O sistema permite aos clientes visualizar o cardápio, adicionar produtos ao carrinho, realizar pedidos online e acompanhar o status dos pedidos. Além disso, possui um painel administrativo para gerenciamento de produtos e pedidos.

## Tecnologias Utilizadas

- **Framework Frontend**: Next.js 15.2.4 (App Router)
- **Biblioteca UI**: React 19.0.0
- **Gerenciamento de Estado**: Zustand 5.0.3
- **Estilização**: Tailwind CSS 4
- **Requisições HTTP**: Axios 1.8.4
- **Ícones**: React Icons 5.5.0
- **Notificações**: React Toastify 11.0.5
- **Linguagem**: TypeScript 5

## Estrutura do Projeto

```
restaurante-spumoni/
├── docs/                    # Documentação do projeto
├── public/                  # Arquivos estáticos públicos
├── src/
│   ├── app/                 # Páginas da aplicação (Next.js App Router)
│   │   ├── admin/           # Páginas do painel administrativo
│   │   ├── carrinho/        # Página do carrinho de compras
│   │   ├── finalizar/       # Páginas de finalização de pedido
│   │   ├── obrigado/        # Página de agradecimento pós-pedido
│   │   ├── produto/         # Página de detalhes do produto
│   │   └── ...             # Outras páginas da aplicação
│   ├── components/          # Componentes React reutilizáveis
│   ├── config/              # Configurações da aplicação
│   ├── hooks/               # Hooks personalizados
│   ├── interfaces/          # Interfaces TypeScript
│   ├── middleware.ts        # Middleware para autenticação
│   ├── services/            # Serviços de API
│   ├── store/               # Gerenciamento de estado (Zustand)
│   └── ...                 # Outros diretórios e arquivos
├── server.ts                # Servidor para desenvolvimento HTTPS
├── next.config.ts           # Configuração do Next.js
├── tsconfig.json            # Configuração do TypeScript
├── package.json             # Dependências e scripts
```

## Principais Características

### Frontend do Cliente

1. **Página Inicial**: Exibe categorias e produtos disponíveis
2. **Página de Produto**: Detalhes do produto selecionado
3. **Carrinho de Compras**: Gerenciamento de itens no carrinho
4. **Checkout**: Processo de finalização de pedido
   - Opções de entrega
   - Formulário de endereço
   - Opções de pagamento

### Painel Administrativo

1. **Login**: Autenticação para acessar o painel administrativo
2. **Gerenciamento de Produtos**: Adicionar, listar e editar produtos
3. **Gerenciamento de Pedidos**: Visualizar e gerenciar pedidos recebidos

## Fluxo de Dados

A aplicação utiliza Zustand para gerenciamento de estado, organizados em diferentes stores:

- **cartStore**: Gerencia os produtos no carrinho
- **categoryStore**: Gerencia as categorias de produtos
- **pedidoStore**: Gerencia os dados do pedido
- **produtoStore**: Gerencia os produtos disponíveis
- **userStore**: Gerencia dados do usuário autenticado

## Modelo de Dados

### Produto
```typescript
interface IProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    price: string;
}
```

### Produto no Carrinho
```typescript
interface ProdutoCarrinho {
    id: number;
    nome: string;
    slug: string;
    imagem: string;
    quantidade: number;
    preco: number;
    observacoes?: string;
    atributos: AtributoSelecionado[];
}
```

### Categoria
```typescript
interface ICategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}
```

## Configuração e Execução

### Pré-requisitos

- Node.js (versão recomendada: 20.x ou superior)
- Yarn ou NPM

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `env-example` com as seguintes variáveis:

```
NEXT_PUBLIC_API_URL=https://api.exemplo.com
```

### Instalação

```bash
# Instalar dependências
yarn install

# Iniciar o servidor de desenvolvimento
yarn dev

# Iniciar o servidor de desenvolvimento com HTTPS
yarn dev:https

# Construir para produção
yarn build

# Iniciar o servidor de produção
yarn start
```

## Autenticação

A aplicação utiliza autenticação baseada em cookies para o painel administrativo. O middleware verifica a existência de um token nos cookies para proteger as rotas administrativas.

## API e Integração com Backend

O projeto se comunica com uma API REST através do Axios, com os seguintes serviços principais:

- **auth.ts**: Serviços de autenticação
- **category.ts**: Serviços relacionados às categorias
- **produto.ts**: Serviços relacionados aos produtos
- **pedido.ts**: Serviços relacionados aos pedidos

## Contribuição

Para contribuir com o projeto:

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Melhores Práticas

- Utilize os componentes existentes sempre que possível
- Mantenha a consistência de estilo com o Tailwind
- Siga as convenções de nomenclatura existentes
- Utilize TypeScript para tipagem estática
- Documente novas funcionalidades

## Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Verifique se a API está configurada corretamente para aceitar requisições da origem da aplicação.
2. **Problemas de Autenticação**: Certifique-se de que o token está sendo armazenado e enviado corretamente.
3. **Erro no Carregamento de Dados**: Verifique se as chamadas de API estão configuradas corretamente e se o backend está respondendo.

## Documentação de API

Para documentação detalhada dos endpoints utilizados, consulte a documentação da API.

## Responsabilidades da Equipe

- **Desenvolvedores Frontend**: Manutenção e desenvolvimento de novas funcionalidades na interface
- **Desenvolvedores Backend**: Integração com a API e desenvolvimento de endpoints
- **Designers**: Criação de componentes visuais e experiência do usuário
- **QA**: Testes de interface e funcionalidades

## Ciclo de Desenvolvimento

1. **Planejamento**: Definição de requisitos e prazos
2. **Desenvolvimento**: Implementação das funcionalidades
3. **Testes**: Verificação de bugs e problemas
4. **Deploy**: Publicação das alterações
5. **Feedback**: Coleta de feedback dos usuários 