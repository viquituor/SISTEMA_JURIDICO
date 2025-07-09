# 📝 Projeto - Sistema de Gestão para Escritório de Advocacia

Este projeto consiste em um sistema completo para gerenciamento de um escritório de advocacia, com Frontend em React e Backend em Node.js + Express + MySQL.

## 📋 Pré-requisitos

Node.js (v18 ou superior)
MySQL (ou MariaDB)
Git (opcional)

## 🚀 Instalação e Configuração

### 1. Clone o repositório (ou baixe os arquivos)

```bash
git clone [URL do repositório]  
cd [nome-da-pasta-do-projeto]  
```

### 2. Configure o Backend

#### Instale as dependências - Backend

```bash
cd BACK-END  
npm install  
```

#### Configure o banco de dados

Crie um banco MySQL chamado advocacia.
Importe o script SQL (database.sql) para criar as tabelas.
Edite o arquivo config/database.js com suas credenciais do MySQL.

### 3. Configure o Frontend

#### Instale as dependências - Frontend

```bash
cd FRONT-END  
npm install  
```

## ⚙️ Iniciando o Sistema

### Opção 1: Iniciar Frontend e Backend separadamente

#### Backend (Node.js)

```bash
cd BACK-END  
npm run dev  # Inicia com nodemon (reload automático)  
```

Acesse a API em: <http://localhost:3001>

#### Frontend (React)

```bash
cd FRONT-END  
npm start  
```

Acesse o sistema em: <http://localhost:3000>

### Opção 2: Iniciar ambos simultaneamente (recomendado)

```bash
npm run dev  # Execute na raiz do projeto  
```

#### Isso inicia Frontend (React) e Backend (Node.js) ao mesmo tempo usando concurrently

## 🌐 Endpoints da API (Backend)

|Rota|Método|Descrição|
|----|------|---------|
|---|-ADVOGADOS-|---|
|/advogados |GET |Lista todos os advogados|
|/advogados/:oab |GET| Busca dados de um advogado|
|/advogados |POST| Cadastra um novo advogado|
|/advogados/:oab |PUT| Atualiza um advogado|
|/advogados/:oab |DELETE| Remove um advogado|
|---|-CLIENTES-|---|
|/advogados/:oab/Clientes |GET| Lista clientes de um advogado|
|/advogados/:oab/Clientes/:cpf |DELETE| Remove um cliente|
|/advogados/:oab/Clientes |POST| Cadastra um novo cliente|
|/advogados/:oab/Clientes/:cpf |PUT| Atualiza um cliente|
|---|-CONTRATOS-|---|
|/advogados/:oab/Contratos |GET| Lista contratos de um advogado|
|/advogados/:oab/Contratos/:cod_contrato |DELETE| Remove um contrato|
|/advogados/:oab/Contratos |POST| Cadastra um novo contrato|
|/advogados/:oab/Contratos/:cod_contrato |PUT| Atualiza um contrato|
|/advogados/:oab/Contratos/:cod_contrato |GET| Busca listas de pagamentos, documentos e compromissos de um contrato|
|---|-DOCUMENTOS-|---|
|/advogados/:oab/Contratos/:cod_contrato/doc |POST| Cadastra um novo documento|
|/advogados/:oab/documentos/:cod_doc |GET| Abri o documento em uma nova pagina|
|/advogados/:oab/documentos/:cod_doc |DELETE| Remove um documento|
|---|-AGENDA-|---|
|/advogados/:oab/Agenda |GET| Lista compromissos de um advogado|
|/advogados/:oab/Agenda |POST| Agenda um novo compromisso|
|/advogados/:oab/Agenda/:cod_compromisso |DELETE| Remove um compromisso|
|/advogados/:oab/Agenda/:cod_compromisso |PUT| Atualiza um compromisso|
|---|-PAGAMEMTOS-|---|
|/advogados/:oab/Pagamentos |GET| Lista pagamentos de um advogado|
|/advogados/:oab/Pagamentos/:cod_contrato |GET| Lista pagamentos por contrato|
|/advogados/:oab/Pagamentos |POST| Agenda um novo pagamento|
|/advogados/:oab/Pagamentos/:cod_pagamento |DELETE| Remove um pagamento|
|/advogados/:oab/Pagamentos/:cod_pagamento |PUT| Atualiza um pagamento|
|---|-PROCESSOS-|---|
|/advogados/:oab/Processos |GET| Lista processos de um advogado|
|/advogados/:oab/Processos/:num_processo/Prazos |GET| Lista prazos de um processo|
|/advogados/:oab/Processos/:num_processo |DELETE| Remove um processo|
|/advogados/:oab/Processos/:num_processo |PUT| Atualiza um processo|
|/advogados/:oab/Processos |POST| Cadastra um novo processo|
|---|-PRAZOS DE PROCESSOS-|---|
|/advogados/:oab/Prazo |GET| Lista prazos de processos de um advogado|
|/advogados/:oab/Prazo/:cod_prapro |DELETE| Remove um prazo|
|/advogados/:oab/Prazo |POST| Agenda um novo prazo|
|/advogados/:oab/Prazo/:cod_prapro |PUT| Atualiza um prazo|

## 🛠 Estrutura do Projeto

```bash
📦 **advocacia-web/**  
├── 📂 **SQL/**              → Scripts dop bando de dados  
├── 📂 **FRONT-END/**        → Aplicação React
│   ├── 📂 public/  
│   ├── 📂 src/  
│   │   ├── 📂 public/  
│   │   ├── 📂 pages/       → Telas do sistema (Advogados, Clientes, Contratos, etc.)  
│   │   ├── 📂 styles/      → CSS modularizado  
│   │   └── 📄 App.js       → Rotas principais  
│   └── 📄 package.json  
│  
├── 📂 **BACK-END/**        → API Node.js  
│   ├── 📂 controllers/ 
│   ├── 📂 routes/          → Rotas da API  
│   ├── 📂 models/          → Modelos do banco de dados  
│   ├── 📂 config/          → Configurações (banco de dados)  
│   └── 📄 app.js           → Servidor principal  
│  
└── 📄 package.json         → Script para iniciar ambos (front + back) 
```

## 📌 Observações

O backend roda na porta 3001 (API REST).

O frontend roda na porta 3000 (React App).

Certifique-se de que o MySQL está rodando antes de iniciar o backend.

Use Ctrl+C para encerrar os servidores.

## 🔧 Solução de Problemas

Erro de conexão com o MySQL: Verifique as credenciais no arquivo BACK-END/config/database.js.

Dependências faltando: Execute npm install novamente na pasta correspondente.

Portas em uso: Feche outros programas usando as portas 3000 ou 3001.

## ✨ Recursos do Sistema

|MODULOS|RECURSOS|
|-------|--------|
| Gestão de Advogados:| Cadastro, edição e exclusão de advogados|
| Gestão de Clientes:| Cadastro e gerenciamento de clientes|
| Contratos:| Criação e acompanhamento de contratos|
| Agenda:| Agendamento de compromissos e prazos|
| Pagamentos:| Registro e acompanhamento de pagamentos|
| Processos:| Cadastro e monitoramento de processos jurídicos|

## ✨ Pronto! O sistema está configurado e pronto para uso
