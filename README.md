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

Ao se registrar no sistema, é necessário colocar um cpf válido.
Aqui deixo alguns cpfs válidos para vc utilizar no registro retirados do site geradorcpf.com:

934.417.583-74
219.434.462-45
726.484.971-61
