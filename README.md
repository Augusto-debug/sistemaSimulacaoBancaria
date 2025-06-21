# Sistema de Simulação Bancária com JWT

Este projeto foi atualizado para incluir autenticação JWT, páginas de login e cadastro.

## 🔐 Funcionalidades de Autenticação

### Backend (Spring Boot)
- **JWT Authentication**: Implementação completa com Spring Security
- **Registro de usuários**: Endpoint para criar novos usuários
- **Login**: Autenticação com email e senha
- **Proteção de rotas**: Todas as APIs principais protegidas por JWT
- **Criptografia de senhas**: BCrypt para hash de senhas

### Frontend (React)
- **Página de Login**: Interface moderna e responsiva
- **Página de Cadastro**: Formulário completo com validações
- **Context de Autenticação**: Gerenciamento global do estado de login
- **Rotas Protegidas**: Redirecionamento automático para login
- **Header atualizado**: Exibição do usuário logado e botão de logout

## 🚀 Como executar

### Pré-requisitos
- MySQL configurado
- Node.js instalado
- Java 17+ instalado

### 1. Migração do Banco de Dados
Execute o script `migration.sql` no seu banco MySQL:

```sql
-- Script para adicionar colunas de autenticação à tabela usuarios
ALTER TABLE usuarios 
ADD COLUMN email VARCHAR(255) UNIQUE,
ADD COLUMN senha VARCHAR(255);

-- Atualizar usuários existentes com dados temporários
UPDATE usuarios SET 
    email = CONCAT('user', id, '@temp.com'),
    senha = '$2a$10$N9qo8uLOickgx2ZMRJWYneIpHjO.LWDDA9XG5DqRGIK2XK9MKj7iy' -- senha: 123456
WHERE email IS NULL;
```

### 2. Executar automaticamente (Windows)
```bash
./start-project.bat
```

### 3. Executar manualmente

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Credenciais de Teste

Para usuários existentes que foram migrados:
- **Email**: user[ID]@temp.com (ex: user1@temp.com)
- **Senha**: 123456

Ou crie uma nova conta na página de cadastro.

## 📝 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Cadastro de usuário

### APIs Protegidas (requerem JWT)
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/{id}` - Atualizar usuário
- `DELETE /api/usuarios/{id}` - Deletar usuário
- `GET /api/contas` - Listar contas
- `POST /api/contas` - Criar conta
- `GET /api/movimentacoes` - Listar movimentações
- `POST /api/movimentacoes` - Criar movimentação

## 🔧 Estrutura dos Tokens JWT

Os tokens JWT incluem:
- **Subject**: Email do usuário
- **Issued At**: Data de criação
- **Expiration**: 24 horas
- **Algorithm**: HS256

## 🛡️ Segurança Implementada

1. **Criptografia de senhas** com BCrypt
2. **Validação de entrada** com Bean Validation
3. **CORS configurado** para desenvolvimento
4. **Sessões stateless** com JWT
5. **Verificação de unicidade** de email e CPF
6. **Autorização por token** em todas as rotas protegidas

## 📱 Interface do Usuário

### Páginas Criadas
- `/login` - Página de login
- `/register` - Página de cadastro
- Páginas existentes protegidas por autenticação

### Funcionalidades
- **Formatação automática de CPF** no cadastro
- **Validação em tempo real** dos formulários
- **Feedback visual** para erros e sucessos
- **Design responsivo** e moderno
- **Persistência de login** com localStorage

## 🔄 Fluxo de Autenticação

1. **Usuário acessa o sistema** → Redirecionado para /login
2. **Login ou cadastro** → Recebe JWT token
3. **Token armazenado** no localStorage
4. **Requests automáticos** incluem Authorization header
5. **Logout** → Token removido e redirecionamento

## ⚠️ Notas Importantes

- Execute a migração do banco antes de iniciar
- O token JWT expira em 24 horas
- Usuários existentes recebem emails temporários (user[ID]@temp.com)
- A secret key do JWT deve ser alterada em produção
- CORS está liberado para desenvolvimento

## 🧪 Testes

Os testes existentes foram mantidos. Para executar:

```bash
# Backend
cd backend
./mvnw test

# Frontend
cd frontend
npm test
``` 