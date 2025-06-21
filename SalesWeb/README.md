## SalesWeb

## Frontend

Aplicação web em **React 18** com **TypeScript**, que consome a API SalesAPI para gerenciamento de clientes, produtos, vendas e autenticação.

---

## Tecnologias utilizadas

- **React 18 com TypeScript**
- **React Router DOM** – Roteamento de páginas
- **Formik** – Gerenciamento de formulários
- **Yup** – Validação de formulários
- **Axios** – Requisições HTTP
- **React Toastify** – Notificações toast
- **SweetAlert2** – Modais e alertas interativos
- **Tailwind CSS** – Estilização rápida e responsiva
- **JWT Decode** – Leitura do token JWT

---

## 1. Estrutura do Projeto

- **src/**
  - **components/** – Componentes reutilizáveis (ex: `Header`, `ModalProduct`)
  - **contexts/** – Contextos React, como `AuthContext` para autenticação
  - **pages/** – Páginas principais da aplicação (`Login`, `Register`, `Home`, `Cart`, `Profile`, `Products`)
  - **services/** – Configuração do Axios para comunicação com a API
  - **routes/** – Rotas protegidas (`AdminRoute`)
  - **App.tsx** – Define rotas principais
  - **main.tsx** – Encapsula o app com `AuthProvider` e outras configurações

---

## 2. Funcionalidades

### 2.1 Autenticação e Controle de Acesso

- Login via **JWT**, com token armazenado em `localStorage`
- `AuthContext` controla:
  - Estado de autenticação
  - Tipo de usuário (`userType`)
  - Ações de login e logout
- Claims do token determinam acesso a páginas
- `AdminRoute` protege rotas exclusivas de administradores
- Usuários logados são redirecionados da tela de login/register

### 2.2 Registro de Usuários

- Tela com validação de campos via **Yup**
- Envio dos dados para a API
- Feedback de sucesso ou erro via **Toastify**

### 2.3 Listagem e Gerenciamento de Produtos (Admin)

- Página **Lista de Produtos** acessível apenas por administradores
- Produtos listados com imagem, nome, código, tamanho e preço
- Modal para **criar ou editar** produtos reutilizável
- Validação de dados no formulário
- Feedback com **Toastify** e bloqueio de campos inválidos
- Exclusão com confirmação via **SweetAlert2**

### 2.4 Home e Experiência do Cliente

- Produtos exibidos em **grid responsivo**
- Visual limpo e acessível
- Ícone dedicado para compra (redireciona ao carrinho)
- Ao tentar comprar sem estar logado, alerta via **SweetAlert2**
- Redirecionamento mantido na página atual para visitantes

### 2.5 Carrinho

- Página de **carrinho** acessada por produto
- Quantidade ajustável e total exibido
- Finaliza compra com envio para API (WIP)
- Se o usuário não tiver endereço cadastrado, uma modal com formulário de endereço é exibida antes de concluir a compra
- Formulário reaproveita o componente AddressForm, com envio via Formik
- Validações de campos e feedbacks de sucesso/erro com Toastify

### 2.6 Perfil do Usuário

- Tela com formulário de **dados pessoais**
- Campo **CPF** visível, mas bloqueado para edição
- Campos de endereço incluídos
- Histórico de compras exibido ao lado do formulário (WIP)

---

## 3. Experiência do Usuário

- Design responsivo com **Tailwind**
- Navegação fluida com **React Router**
- Layout adaptável ao estado de login
- Modais com escurecimento de fundo e rolagem bloqueada
- Validações inline nos formulários
- Mensagens de erro detalhadas (ex: código de produto duplicado)
