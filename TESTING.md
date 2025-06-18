# 🧪 Guia Completo de Testes

Este documento descreve como executar e entender os testes implementados no projeto Sistema Bancário.

## 📁 Estrutura de Testes

```
projetoFullStackSimulaçãoBanco/
├── backend/
│   ├── src/test/
│   │   ├── java/com/augusto/backend/
│   │   │   ├── controller/         # Testes unitários dos controllers
│   │   │   ├── services/           # Testes unitários dos services
│   │   │   └── integration/        # Testes de integração
│   │   └── resources/
│   │       ├── application-test.properties  # Configurações para teste
│   │       └── data.sql                    # Dados de teste
└── frontend/
    └── src/tests/
        ├── components/             # Testes de componentes
        ├── pages/                  # Testes de páginas
        ├── services/               # Testes de serviços
        ├── integration/            # Testes de integração E2E
        └── mocks/                  # Mocks para APIs
```

## 🚀 Backend - Executando Testes

### Pré-requisitos
- Java 17+
- Maven 3.6+
- MySQL Server (executando)
- Banco de dados `financeiro_test` criado

### Comandos

```bash
# Navegar para a pasta do backend
cd backend

# Executar todos os testes
mvn test

# Executar testes com relatório de cobertura
mvn test jacoco:report

# Executar apenas testes unitários
mvn test -Dtest="*Test"

# Executar apenas testes de integração
mvn test -Dtest="*IntegrationTest"

# Executar testes específicos
mvn test -Dtest="ContaServiceTest"
mvn test -Dtest="ContaControllerTest"
```

### Tipos de Testes Backend

#### 1. **Testes Unitários do Service** (`ContaServiceTest`)
- ✅ Validação de regras de negócio
- ✅ Tratamento de exceções
- ✅ Mocking de repositórios
- ✅ Validação de dados de entrada

**Exemplo de execução:**
```bash
mvn test -Dtest="ContaServiceTest"
```

#### 2. **Testes Unitários do Controller** (`ContaControllerTest`)
- ✅ Endpoints HTTP
- ✅ Serialização/Deserialização JSON
- ✅ Códigos de status HTTP
- ✅ Validação de request/response

**Exemplo de execução:**
```bash
mvn test -Dtest="ContaControllerTest"
```

#### 3. **Testes de Integração** (`ContaIntegrationTest`)
- ✅ Teste completo da API
- ✅ Banco de dados MySQL real
- ✅ Transações reais
- ✅ Fluxo end-to-end

#### 🔧 **Configuração do Banco MySQL para Testes**
**Antes de executar os testes, configure o banco:**

```bash
# 1. Execute o script SQL para criar o banco de teste
mysql -u root -p < backend/create_test_db.sql

# 2. Ou execute manualmente no MySQL:
mysql -u root -p
CREATE DATABASE IF NOT EXISTS financeiro_test;
GRANT ALL PRIVILEGES ON financeiro_test.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

**Configurações usadas:**
- **URL:** `jdbc:mysql://localhost:3306/financeiro_test`
- **Usuário:** `root`
- **Senha:** `123456789` (altere no `application-test.properties` se necessário)

**Exemplo de execução:**
```bash
mvn test -Dtest="ContaIntegrationTest"
```

## 🎨 Frontend - Executando Testes

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação das Dependências
```bash
# Navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install
# ou
yarn install
```

### Comandos

```bash
# Executar todos os testes
npm run test
# ou
yarn test

# Executar testes com interface gráfica
npm run test:ui
# ou
yarn test:ui

# Executar testes com relatório de cobertura
npm run test:coverage
# ou
yarn test:coverage

# Executar testes em modo watch
npm run test -- --watch

# Executar testes específicos
npm run test -- Header.test.jsx
npm run test -- Conta.test.jsx
```

### Tipos de Testes Frontend

#### 1. **Testes de Componentes** (`components/`)
- ✅ Renderização correta
- ✅ Props e estados
- ✅ Interações do usuário
- ✅ Acessibilidade

**Arquivos:**
- `Header.test.jsx` - Testa navegação e links

#### 2. **Testes de Páginas** (`pages/`)
- ✅ Carregamento de dados
- ✅ Formulários
- ✅ Validações
- ✅ Interações complexas

**Arquivos:**
- `Conta.test.jsx` - Testa CRUD completo de contas

#### 3. **Testes de Serviços** (`services/`)
- ✅ Chamadas para API
- ✅ Tratamento de erros
- ✅ Mocking de requisições HTTP

**Arquivos:**
- `api.test.js` - Testa todas as funções da API

#### 4. **Testes de Integração E2E** (`integration/`)
- ✅ Fluxos completos de usuário
- ✅ Estados da aplicação
- ✅ Cenários reais de uso

**Arquivos:**
- `ContaFlow.test.jsx` - Testa fluxo completo de gerenciamento

## 🔧 Configurações de Teste

### Backend - Configurações

#### `application-test.properties`
```properties
# Banco MySQL para testes
spring.datasource.url=jdbc:mysql://localhost:3306/financeiro_test?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=123456789
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.test.database.replace=none
```

#### Profile de Teste
Os testes usam o profile `test` automaticamente, garantindo:
- Banco isolado
- Configurações específicas
- Dados de teste padronizados

### Frontend - Configurações

#### `vitest.config.js`
```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov']
    }
  }
})
```

#### Mocks com MSW
- ✅ Interceptação de requisições HTTP
- ✅ Respostas consistentes
- ✅ Dados de teste padronizados

## 📊 Relatórios de Cobertura

### Backend
```bash
mvn test jacoco:report
# Relatório em: backend/target/site/jacoco/index.html
```

### Frontend
```bash
npm run test:coverage
# Relatório em: frontend/coverage/index.html
```

## ✅ Critérios de Qualidade

### Cobertura de Código
- **Meta:** 80%+ de cobertura
- **Backend:** Testa Services, Controllers e Integração
- **Frontend:** Testa Componentes, Páginas e Serviços

### Tipos de Teste
- **Unitários:** Funções isoladas
- **Integração:** Fluxos completos
- **E2E:** Cenários reais de usuário

### Boas Práticas Implementadas
- ✅ **Arrange-Act-Assert** pattern
- ✅ **Mocking** adequado de dependências
- ✅ **Dados de teste** isolados e limpos
- ✅ **Testes determinísticos** (sem dependências externas)
- ✅ **Nomes descritivos** para testes
- ✅ **Cobertura de casos de erro**

## 🐛 Resolução de Problemas

### Problemas Comuns Backend

#### 1. Erro de Conexão com Banco
```
Solução: Verificar se o H2 está configurado corretamente
Comando: mvn clean test
```

#### 2. Testes Não Executam
```
Solução: Verificar profile de teste ativo
Comando: mvn test -Dspring.profiles.active=test
```

### Problemas Comuns Frontend

#### 1. Dependências Não Encontradas
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 2. Testes Muito Lentos
```bash
# Executar testes específicos
npm run test -- --run Conta.test.jsx
```

#### 3. Mocks Não Funcionam
```bash
# Verificar se MSW está configurado
npm run test -- --reporter=verbose
```

## 🎯 Executando Todos os Testes

### Script Completo
```bash
#!/bin/bash

echo "🧪 Executando todos os testes do projeto..."

# Backend
echo "📊 Testando Backend..."
cd backend
mvn clean test
cd ..

# Frontend
echo "🎨 Testando Frontend..."
cd frontend
npm test -- --run
cd ..

echo "✅ Todos os testes concluídos!"
```

### CI/CD
Os testes são executados automaticamente em:
- Pull requests
- Commits na branch main
- Builds de produção

## 📈 Métricas de Qualidade

### Indicadores
- ✅ **Cobertura de código:** >80%
- ✅ **Tempo de execução:** <2min (backend), <1min (frontend)
- ✅ **Testes passando:** 100%
- ✅ **Casos de teste:** 50+ cenários cobertos

### Relatórios Disponíveis
- Coverage HTML detalhado
- Logs de execução
- Métricas de performance
- Relatório de casos de erro

---

**💡 Dica:** Execute os testes regularmente durante o desenvolvimento para garantir a qualidade contínua do código! 