# SalesProject – Guia de Instalação Local

Este repositório contém um sistema fullstack dividido em duas pastas:

- `SalesAPI` – Backend em .NET 8
- `SalesWeb` – Frontend em React + Vite

O projeto foi feito para simular uma loja simples que pode ser acessada por um cliente ou um administrador.
Para acessar a loja, é necessário realizar um login. Caso não tenha conta, você pode se registrar.

Para testar como cliente pode utilazar:

Login: cliente@salesapi.com
Senha: 1234

Na tela principal é possível ver os produtos da loja (estando ou não logado), porém se você clicar em um produto para realizar a compra do mesmo, vc precisará realizar o login.
Ao clicar no carrinho, você será redirecionado para o seu carrinho onde pode escolher a quantidade de itens que quer comprar.
Ao clicar em Finalizar a compra, é necessário que você tenha um endereço cadastrado. Se não tiver, uma modal se abrirá para você adicionar seu endereço.

Como cliente também é possível entrar na aba do perfil para editar seus dados e endereço e viasualizar o histórico de compras.

No caso de acessar como administrador, você também terá acesso a aba Produtos, onde poderá ver todos os Produtos cadastrados, edita-los, excluí-los ou ainda adicionar novos produtos.

Para testar como administrador pode utilazar:

Login: admin@salesapi.com
Senha: 1234

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [PostgreSQL](https://www.postgresql.org/) – ou utilizar um banco externo como [Neon](https://neon.tech)

---

### Backend – **SalesAPI** (.NET)

#### Instalar dependências

```bash
cd SalesAPI
dotnet restore
```

#### Crie um arquivo .env seguindo o exemplo do arquivo .env.example

#### Rode o servidor

```bash
dotnet run
```

---

### Frontend – **SalesWeb** (React + Vite)

#### Instalar dependências

```bash
cd SalesWeb
npm install
```

#### Crie um arquivo .env com o seguinte conteúdo:

VITE_API_URL=http://localhost:5172

#### Rode o projeto

```bash
npm run dev
```

Pronto! Com os dois servidores rodando, você já pode usar a aplicação localmente.

### OBSERVACAO

Ao se registrar no sistema, é necessário colocar um cpf válido.
Aqui deixo alguns cpfs válidos para vc utilizar no registro retirados do site geradorcpf.com:

934.417.583-74

219.434.462-45

726.484.971-61
