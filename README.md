# 🔐 Financial Management System — Backend

Este é o backend do sistema de **gestão financeira pessoal**, com autenticação JWT, CRUDs e integração com SQLite via TypeORM.

---

## 🚀 Tecnologias

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
│   ├── interfaces/       # Tipagens
│   ├── middleware/       # authMiddleware
│   ├── services/         # Lógica de negócio (antes chamados de repositories)
│   └── routes/           # Organização das rotas
├── database/
│   ├── data-source.ts    # Conexão com o banco
│   └── migrations/       # Migrations TypeORM
├── tests/                # Testes unitários com Jest
```

---

## 🛠️ Como rodar localmente

### ✅ Pré-requisitos

- Node.js (v18+)
- NPM
- SQLite instalado (ou use o `.sqlite` local que o projeto cria)

---

### 📥 Instalação

```bash
git clone https://github.com/seu-usuario/backend-fms-techlab.git
cd backend-fms-techlab
npm install
```

---

### 🔐 Variáveis de ambiente

Crie um arquivo `.env` com:

```env
JWT_SECRET=sua_chave_secreta
```

---

### 🧱 Banco de dados

O projeto usa **SQLite** como banco local.  
Antes de iniciar, rode a migration para popular com os tipos básicos de conta:

```bash
npm run migration
```

---

### 🏃 Rodar o servidor

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

## 🧪 Testes

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
| POST  | `/user/perfil`      | Retorna perfil do usuário (token) |
| POST  | `/account`          | Criação de conta         |
| DELETE| `/account/:id`      | Soft delete              |
| POST  | `/transaction`      | Criar transferência      |
| GET   | `/transactions`     | Buscar transações        |

---

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

> Veja o [guia completo de deploy no Render aqui](https://render.com/docs/deploy-node-express-app)

---

## 📎 Documentação geral

- [Documentação do Frontend](https://github.com/seu-usuario/frontend-fms-techlab)
- [Especificação oficial (PDF)](./Desafio%20WebApp.pdf)

---

> Projeto desenvolvido para o desafio técnico **Tech4Humans**  
> 🌱 Finalizado com testes, organização RESTful e deploy funcional