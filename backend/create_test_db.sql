-- Script para criar banco de dados de teste MySQL
-- Execute antes de rodar os testes

-- Criar o banco de dados de teste (se não existir)
CREATE DATABASE IF NOT EXISTS financeiro_test;

-- Usar o banco de teste
USE financeiro_test;

-- Configurações específicas para testes
SET foreign_key_checks = 1;
SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- Garantir que o usuário root tem acesso
GRANT ALL PRIVILEGES ON financeiro_test.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- Verificar se o banco foi criado
SELECT 'Banco de teste MySQL criado com sucesso!' as status; 