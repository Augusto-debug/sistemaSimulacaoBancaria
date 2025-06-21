-- Script para adicionar colunas de autenticação à tabela usuarios
ALTER TABLE usuarios 
ADD COLUMN email VARCHAR(255) UNIQUE,
ADD COLUMN senha VARCHAR(255);

-- Atualizar usuários existentes com dados temporários (remover após migração)
UPDATE usuarios SET 
    email = CONCAT('user', id, '@temp.com'),
    senha = '$2a$10$N9qo8uLOickgx2ZMRJWYneIpHjO.LWDDA9XG5DqRGIK2XK9MKj7iy' -- senha: 123456
WHERE email IS NULL; 