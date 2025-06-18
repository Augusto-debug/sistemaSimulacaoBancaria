-- Dados de teste para usuários
INSERT INTO usuarios (id, nome, cpf, endereco) VALUES 
(1, 'João Silva', '12345678901', 'Rua A, 123'),
(2, 'Maria Santos', '98765432109', 'Rua B, 456'),
(3, 'Pedro Oliveira', '11122233344', 'Rua C, 789');

-- Dados de teste para contas
INSERT INTO contas (id, numero_conta, saldo, usuario_id) VALUES 
(1, '123456', 1000.00, 1),
(2, '789012', 2500.50, 2),
(3, '345678', 750.25, 1);

-- Dados de teste para movimentações
INSERT INTO movimentacoes (id, tipo, valor, data, conta_id) VALUES 
(1, 'DEPOSITO', 500.00, '2024-01-15', 1),
(2, 'SAQUE', 200.00, '2024-01-16', 1),
(3, 'DEPOSITO', 1000.00, '2024-01-17', 2); 