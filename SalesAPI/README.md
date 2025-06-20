# SalesAPI

# Backend

API RESTful para gerenciamento de clientes, endereços, produtos e vendas. Desenvolvida com **.NET 8**, **Entity Framework Core** e **PostgreSQL (Neon)**, com autenticação via **JWT**.

---

## Tecnologias utilizadas

- ASP.NET Core 8
- Entity Framework Core 9
- PostgreSQL (Neon)
- DotNetEnv
- JWT (Json Web Token)
- BCrypt.Net (hash de senhas)
- Swagger/OpenAPI

---

## 1. Models

Modelos principais da aplicação:

- **Customer**: Documento, nome, email, telefone, senha (hash), tipo de usuário e lista de endereços.
- **Address**: Rua, número, cidade, estado, CEP e chave estrangeira para Customer.
- **Product**: Código único, nome, imagem, tamanho e preço.
- **Sale**: Data da venda, cliente e lista de itens.
- **SaleItem**: Produto, quantidade e preço unitário no momento da venda.

Todos os relacionamentos foram configurados no `DbContext` e incluem `Cascade Delete` para dependências como `Address` e `Sale`.

---

## 2. DbContext e Migrations

- A classe `SalesDbContext` configura os `DbSet<>` e relacionamentos.
- Conexão com o PostgreSQL via variável de ambiente no `.env`.

---

## 3. DTOs

DTOs foram criados para separar os dados de entrada e saída:

- `AddressDTO`, `PostPutAddressDTO`
- `CustomerDTO`, `PostCustomerDTO`, `PutCustomerDTO`
- `ProductDTO`, `PostPutProductDTO`
- `SaleDTO`, `SaleItemDTO`, `PostSaleDTO`, `PostPutSaleItemDTO`

---

## 4. Autenticação e Autorização

- Implementado login via **JWT**.
- O token JWT inclui também a propriedade `userType` (ex: `"admin"` ou `"customer"`), usada pelo front-end para controlar acesso a páginas administrativas.
- Endpoint de login em `/api/auth/login`.
- Clientes são registrados com senha hasheada (`BCrypt`).
- Rotas protegidas com `[Authorize]`:
  - CustomerController (exceto POST)
  - AddressController
  - SaleController
  - ProductController (exceto GEts)
