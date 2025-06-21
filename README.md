# SalesProject – Guia de Instalação Local

Este repositório contém um sistema fullstack dividido em duas pastas:

- `SalesAPI` – Backend em .NET 8
- `SalesWeb` – Frontend em React + Vite

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

#### Crie um arquivo .env com o seguinte conteúdo:

Você precisa criar um arquivo `.env` na raiz do projeto backend com as seguintes variáveis:

```env
CONNECTION_STRING=Host=<seu-host>;Database=<seu-banco>;Username=<seu-usuario>;Password=<sua-senha>;SSL Mode=Require;Trust Server Certificate=true
FRONTEND_URL=http://localhost:5173

JWT_KEY=<uma-chave-secreta-para-assinar-o-token>
JWT_ISSUER=<nome-do-issuer-do-token, ex: SalesAPI>
JWT_AUDIENCE=<nome-do-audience-do-token, ex: SalesAPIUsers>
JWT_EXPIRE_MINUTES=<tempo-de-expiracao-do-token-em-minutos, ex: 60>
```

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
