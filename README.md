# 💰 Financial Management System — Backend

Este é o backend do sistema de **gestão financeira pessoal**, com autenticação **JWT**, **CRUDs** e integração com **SQLite** via **TypeORM**.

---

## 🖳 Tecnologias

- **Node.js + Express**: servidor rápido e simples
- **TypeORM**: ORM robusto com suporte a SQLite
- **SQLite**: banco de dados leve e prático para aplicações locais
- **Jest**: testes unitários automatizados
- **JWT**: autenticação segura com tokens
- **Express Async Errors**: tratamento centralizado de exceções
- **CORS**: habilitado para permitir comunicação com o frontend

---

## 📁 Estrutura de Pastas

```bash
src/
├── app/
│   ├── controllers/      # Requisições HTTP (camada de entrada)
│   ├── entities/         # Entidades do banco (Account, User, etc.)
│   ├── interfaces/       # Tipagens importantes
│   ├── middleware/       # authMiddleware
│   ├── services/         # Lógica de negócio 
│   ├── repositories/     # Repositórios para acesso ao BD
│   └── routes/           # Organização das rotas
├── database/
│   ├── data-source.ts    # Conexão com o banco
│   └── migrations/       # Migrations TypeORM
├── tests/                # Testes unitário com Jest
├── types/                # Tipos globais adicionados
├── utils/                # Funções de formatação
```

---

## 🛠️ Como rodar localmente

### ✅ Pré-requisitos

- Node.js (v18+)
- NPM
- SQLite instalado (ou use o `.sqlite` local que o projeto cria)
[Clique aqui para instalar o node/npm](https://balta.io/blog/node-npm-instalacao-configuracao-e-primeiros-passos)
[Veja mais sobre o SQLite aqui](https://www.alura.com.br/artigos/sqlite-da-instalacao-ate-primeira-tabela)
---

### 📥 Instalação

```bash
git clone https://github.com/meloluvert/fms-techlab-backend.git
cd fms-techlab-backend
npm install
```
---

### 🔐 Variáveis de ambiente

Use o arquivo `.env` com:

```env
JWT_SECRET=sua_chave_secreta
```
A chave é **essencial** para o funcionamento do projeto, sem ele, o projeto não começa

---

### 🧱 Banco de dados

Acesse o BD em formato de diagrama [Aqui](https://drive.google.com/file/d/1gENQFJfJYmKs3O7DAJMlrRTCQbv6QVsS/view?usp=sharing)
O projeto usa **SQLite** como banco local, ele está localizado em src/database/db.sqlite (se não houver, crie o arquivo)
Antes de iniciar, rode a migration para popular com os tipos básicos de conta:

```bash
npm run migration:run
```


---

### 🗄️ Rodar o servidor

```bash
npm run dev
```

O backend será iniciado em:  
[http://localhost:3000](http://localhost:3000)

---

## 🔐 Autenticação

- As rotas protegidas utilizam **token JWT**
- O token é gerado no login (`/user/login`)
- Deve ser enviado em rotas protegidas com:

```http
Authorization: Bearer SEU_TOKEN
```

---

## 📋 Testes
- estão em src/tests/
- Testes escritos com `Jest`
- Para rodar:

```bash
npx jest
```

Exemplo de teste implementado: `AccountService` (`newAccount`)

---

## 📦 Rotas principais (RESTful)

| Verbo | Rota                | Ação                     |
|-------|---------------------|--------------------------|
| POST  | `/user/register`    | Cadastro de usuário      |
| POST  | `/user/login`       | Login e geração de token |
| GET  | `/user/`      | Retorna perfil do usuário (token) |
| POST  | `/account`          | Criação de conta         |
| DELETE| `/account/:id`      | Soft delete              |
| POST  | `/transactions`      | Criar transferência      |
| GET   | `/transactions`     | Buscar transações        |

---
Todas as rotas exceto de registro e login de usuário **PRECISAM** do token passado no cabeçalho da requsição 

## 🧹 Clean Code & Boas práticas

- Separação de responsabilidades: `controller` → `service`
- Arquivos curtos e objetivos
- Tratamento de erros centralizado
- Uso de `softDelete` com `deleted_at` em todas as entidades
- Tipagem clara com interfaces (`IAccount`, `IUser`, etc.)

---

## 🌍 Deploy

### 🔧 Backend hospedado no [Render](https://render.com)

- Você pode criar um serviço web (Free Tier)
- O SQLite funciona, mas em produção é recomendado Neon (Postgres)

### 🔧 Banco de Dados hospedado no [Neon](https://neon.com/)

- Você pode criar um serviço web (Free Tier)
- O SQLite funciona, mas em produção é recomendado Neon (Postgres)
---

## 📎 Documentação geral

- [Documentação do Frontend](https://github.com/meloluvert/fms-techlab-frontend)
- [Modelagem BD](https://drive.google.com/file/d/1gENQFJfJYmKs3O7DAJMlrRTCQbv6QVsS/view?usp=sharing)
- [Documentação do Desafio](https://github.com/tech4humans-brasil/techlab-ceu/blob/main/Finan%C3%A7as%20(Webapp)/Desafio%20WebApp.pdf)


---

> Projeto desenvolvido para o desafio técnico **Tech4Humans**  
> 🌱 Finalizado com testes, organização RESTful e deploy funcional
