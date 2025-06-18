import { describe, it, expect, beforeEach, vi } from 'vitest'
import api from '../../services/api'

describe('Serviço de API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Usuários', () => {
    it('deve buscar todos os usuários', async () => {
      const usuarios = await api.getUsuarios()
      
      expect(usuarios).toHaveLength(2)
      expect(usuarios[0]).toEqual({
        id: 1,
        nome: 'João Silva',
        cpf: '12345678901',
        endereco: 'Rua A, 123'
      })
    })

    it('deve buscar usuário por ID', async () => {
      const usuario = await api.getUsuarioById(1)
      
      expect(usuario).toEqual({
        id: 1,
        nome: 'João Silva',
        cpf: '12345678901',
        endereco: 'Rua A, 123'
      })
    })

    it('deve lançar erro ao buscar usuário inexistente', async () => {
      await expect(api.getUsuarioById(999)).rejects.toThrow()
    })

    it('deve criar novo usuário', async () => {
      const novoUsuario = {
        nome: 'Pedro Costa',
        cpf: '11111111111',
        endereco: 'Rua C, 789'
      }

      const usuarioCriado = await api.createUsuario(novoUsuario)
      
      expect(usuarioCriado).toEqual({
        id: 3,
        ...novoUsuario
      })
    })

    it('deve atualizar usuário existente', async () => {
      const dadosAtualizados = {
        nome: 'João Silva Atualizado',
        cpf: '12345678901',
        endereco: 'Rua A, 123 - Atualizada'
      }

      const usuarioAtualizado = await api.updateUsuario(1, dadosAtualizados)
      
      expect(usuarioAtualizado.nome).toBe('João Silva Atualizado')
      expect(usuarioAtualizado.endereco).toBe('Rua A, 123 - Atualizada')
    })

    it('deve deletar usuário', async () => {
      const resultado = await api.deleteUsuario(1)
      expect(resultado).toBe(true)
    })
  })

  describe('Contas', () => {
    it('deve buscar todas as contas', async () => {
      const contas = await api.getContas()
      
      expect(contas).toHaveLength(2)
      expect(contas[0]).toEqual({
        id: 1,
        numeroConta: '123456',
        saldo: 1000.00,
        usuario: {
          id: 1,
          nome: 'João Silva',
          cpf: '12345678901',
          endereco: 'Rua A, 123'
        }
      })
    })

    it('deve buscar conta por ID', async () => {
      const conta = await api.getContaById(1)
      
      expect(conta.numeroConta).toBe('123456')
      expect(conta.saldo).toBe(1000.00)
    })

    it('deve buscar contas por usuário', async () => {
      const contas = await api.getContasByUsuarioId(1)
      
      expect(contas).toHaveLength(1)
      expect(contas[0].usuario.id).toBe(1)
    })

    it('deve criar nova conta', async () => {
      const novaConta = {
        usuarioId: 1,
        numeroConta: '555555'
      }

      const contaCriada = await api.createConta(novaConta)
      
      expect(contaCriada.numeroConta).toBe('555555')
      expect(contaCriada.saldo).toBe(0)
      expect(contaCriada.usuario.id).toBe(1)
    })

    it('deve retornar erro ao criar conta com usuário inexistente', async () => {
      const novaConta = {
        usuarioId: 999,
        numeroConta: '555555'
      }

      await expect(api.createConta(novaConta)).rejects.toThrow()
    })

    it('deve atualizar conta existente', async () => {
      const dadosAtualizados = {
        numeroConta: '999999'
      }

      const contaAtualizada = await api.updateConta(1, dadosAtualizados)
      
      expect(contaAtualizada.numeroConta).toBe('999999')
    })

    it('deve deletar conta', async () => {
      const resultado = await api.deleteConta(1)
      expect(resultado).toBe(true)
    })
  })

  describe('Movimentações', () => {
    it('deve buscar todas as movimentações', async () => {
      const movimentacoes = await api.getMovimentacoes()
      
      expect(movimentacoes).toHaveLength(2)
      expect(movimentacoes[0]).toEqual({
        id: 1,
        tipo: 'CREDITO',
        valor: 500.00,
        data: '2024-01-15',
        conta: {
          id: 1,
          numeroConta: '123456',
          saldo: 1000.00,
          usuario: {
            id: 1,
            nome: 'João Silva',
            cpf: '12345678901',
            endereco: 'Rua A, 123'
          }
        }
      })
    })

    it('deve buscar movimentações por conta', async () => {
      const movimentacoes = await api.getMovimentacoesByContaId(1)
      
      expect(movimentacoes).toHaveLength(2)
      expect(movimentacoes.every(m => m.conta.id === 1)).toBe(true)
    })

    it('deve criar nova movimentação', async () => {
      const novaMovimentacao = {
        contaId: 1,
        tipo: 'CREDITO',
        valor: 1000.00,
        data: '2024-01-20'
      }

      const movimentacaoCriada = await api.createMovimentacao(novaMovimentacao)
      
      expect(movimentacaoCriada.tipo).toBe('CREDITO')
      expect(movimentacaoCriada.valor).toBe(1000.00)
      expect(movimentacaoCriada.conta.id).toBe(1)
    })

    it('deve retornar erro ao criar movimentação com conta inexistente', async () => {
      const novaMovimentacao = {
        contaId: 999,
        tipo: 'CREDITO',
        valor: 1000.00,
        data: '2024-01-20'
      }

      await expect(api.createMovimentacao(novaMovimentacao)).rejects.toThrow()
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve tratar erros de rede adequadamente', async () => {
      // Simular erro de rede
      const { server } = await import('../mocks/server')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://localhost:8080/api/usuarios', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(api.getUsuarios()).rejects.toThrow()
    })

    it('deve logar erros no console', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Simular erro
      const { server } = await import('../mocks/server')
      const { http, HttpResponse } = await import('msw')
      
      server.use(
        http.get('http://localhost:8080/api/usuarios/1', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      try {
        await api.getUsuarioById(1)
      } catch (error) {
        // Erro esperado
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao buscar usuário com ID 1:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })
}) 