# 🏦 Sistema de Simulação Bancária

Um sistema completo de simulação bancária desenvolvido com Spring Boot (backend) e React (frontend), que permite gerenciar usuários, contas bancárias e movimentações financeiras.

## 📋 Funcionalidades

- **Gestão de Usuários**: Cadastro, listagem, edição e exclusão de usuários
- **Gestão de Contas**: Criação e gerenciamento de contas bancárias
- **Movimentações Financeiras**: Depósitos e saques com controle de saldo
- **Interface Web Responsiva**: Frontend moderno desenvolvido em React

## 🛠 Tecnologias Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.4.4**
- **Spring Data JPA**
- **MySQL**
- **Lombok**
- **Maven**

### Frontend
- **React 19**
- **Vite**
- **Axios**
- **React Router DOM**
- **CSS3**

## 📂 Estrutura do Projeto

```
projetoFullStackSimulaçãoBanco/
├── backend/                 # API REST em Spring Boot
│   ├── src/main/java/
│   │   └── com/augusto/backend/
│   │       ├── controller/  # Controllers REST
│   │       ├── domain/      # Entidades JPA
│   │       ├── repository/  # Repositórios
│   │       └── services/    # Lógica de negócio
│   └── src/main/resources/
│       └── application.properties
├── frontend/                # Interface em React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   └── services/       # Serviços para API
│   └── package.json
└── README.md
```

## 🗃 Modelo de Dados

O sistema possui três entidades principais:

- **Usuario**: Representa os clientes do banco (nome, CPF, endereço)
- **Conta**: Contas bancárias associadas aos usuários (número, saldo)
- **Movimentacao**: Transações financeiras (depósitos/saques) nas contas

## 🚀 Como Executar

### Pré-requisitos

- Java 17+
- Maven 3.6+
- Node.js 16+
- MySQL 8.0+

### Configuração do Banco de Dados

1. Instale e configure o MySQL
2. Crie um banco de dados chamado `financeiro` (ou será criado automaticamente)
3. Configure as credenciais no arquivo `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/financeiro?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=123456789
```

### Executando o Backend

```bash
# Navegue até o diretório do backend
cd backend

# Execute a aplicação
./mvnw spring-boot:run

# Ou no Windows
mvnw.cmd spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

### Executando o Frontend

```bash
# Navegue até o diretório do frontend
cd frontend

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

A aplicação web estará disponível em: `http://localhost:5173`

## 🔌 Endpoints da API

### Usuários
- `GET /usuarios` - Listar todos os usuários
- `POST /usuarios` - Criar novo usuário
- `PUT /usuarios/{id}` - Atualizar usuário
- `DELETE /usuarios/{id}` - Excluir usuário

### Contas
- `GET /contas` - Listar todas as contas
- `POST /contas` - Criar nova conta
- `PUT /contas/{id}` - Atualizar conta
- `DELETE /contas/{id}` - Excluir conta

### Movimentações
- `GET /movimentacoes` - Listar todas as movimentações
- `POST /movimentacoes` - Criar nova movimentação
- `PUT /movimentacoes/{id}` - Atualizar movimentação
- `DELETE /movimentacoes/{id}` - Excluir movimentação

## 🎯 Como Usar

1. **Cadastre Usuários**: Acesse a página de usuários para cadastrar clientes
2. **Crie Contas**: Associe contas bancárias aos usuários cadastrados
3. **Realize Movimentações**: Faça depósitos e saques nas contas criadas
4. **Acompanhe o Saldo**: Visualize o saldo atualizado após cada movimentação

## 🚀 Build para Produção

### Backend
```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por **Augusto Cesar Rezende**

---

⭐ Deixe uma estrela se este projeto foi útil para você! 