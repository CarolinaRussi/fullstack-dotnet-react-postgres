# SalesProject – Guia de Instalação Local

Este repositório contém um sistema fullstack dividido em duas pastas:

- `SalesAPI` – Backend em .NET 8
- `SalesWeb` – Frontend em React + Vite

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [PostgreSQL](https://www.postgresql.org/) – ou utilizar um banco externo como [Neon](https://neon.tech)

---

### PASSO A PASSO

### Backend – **SalesAPI** (.NET)

#### 1. Instalar dependências

```bash
cd SalesAPI
dotnet restore - uma boa prática para baixar as dependencias do projeto, mas o dotnet run também faz isso nessa versão.
```

#### 2. Crie um arquivo .env na raiz da pasta SalesAPI seguindo o exemplo do arquivo .env.example no mesmo local

O arquivo .env deve conter a variável CONNECTION_STRING com a connection string do banco PostgreSQL que você deseja usar — pode ser o banco do Neon, um banco local ou outro serviço PostgreSQL.

Exemplo de connection string:
Host=localhost;Port=5432;Database=SalesDb;Username=usuario;Password=senha

#### 3. Rode o servidor

```bash
dotnet run
```

Aqui, o swagger já estará disponível através do caminho [http://localhost:5172/swagger](http://localhost:5172/swagger)

---

### Frontend – **SalesWeb** (React + Vite)

#### 4. Instalar dependências

```bash
cd SalesWeb
npm install
```

#### 5. Rode o projeto

```bash
npm run dev
```

Pronto! Com os dois servidores rodando, você já pode usar a aplicação localmente em [http://localhost:5173](http://localhost:5173)

### O Projeto

O projeto foi feito para simular uma loja simples que pode ser acessada por um cliente ou um administrador.
Para acessar a loja, é necessário realizar um login.
Caso não tenha conta, você pode se registrar.
Por questões de desenvolvimento, na hora do registro você tem a opção de criar um usuario Cliente e Administrador

Na tela principal é possível ver os produtos da loja (estando ou não logado), porém se você clicar em um produto para realizar a compra do mesmo, você precisará realizar o login.
Ao clicar no carrinho, você será redirecionado para o seu carrinho onde pode escolher a quantidade de itens que quer comprar.
Ao clicar em Finalizar a compra, é necessário que você tenha um endereço cadastrado. Se não tiver, uma modal se abrirá para você adicionar seu endereço.

Como cliente também é possível entrar na aba do perfil para editar seus dados e endereço e visualizar o histórico de compras.

No caso de acessar como administrador, você também terá acesso a aba Produtos, onde poderá ver todos os produtos cadastrados, edita-los, excluí-los ou ainda adicionar novos produtos.

Para testar como administrador pode utilizar:

Login: admin@salesapi.com
Senha: 1234

### OBSERVACAO

Ao se registrar no sistema, é necessário colocar um cpf válido.
Aqui deixo alguns cpfs válidos para você utilizar no registro retirados do site geradorcpf.com:

934.417.583-74

219.434.462-45

726.484.971-61
