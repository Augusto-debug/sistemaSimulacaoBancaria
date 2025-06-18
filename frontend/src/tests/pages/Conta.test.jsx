import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Conta from '../../pages/Conta'

// Wrapper para componentes que usam Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Página de Conta', () => {
  beforeEach(() => {
    // Reset any modifications to the mock data before each test
    vi.clearAllMocks()
  })

  it('deve renderizar o título da página', async () => {
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    expect(screen.getByText('Gerenciamento de Contas')).toBeInTheDocument()
  })

  it('deve carregar e exibir usuários no select', async () => {
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar o carregamento dos dados
    await waitFor(() => {
      expect(screen.getByText('-- Selecione um cliente --')).toBeInTheDocument()
    })

    // Verificar se os usuários foram carregados
    await waitFor(() => {
      expect(screen.getByText('João Silva - CPF: 123.456.789-01')).toBeInTheDocument()
      expect(screen.getByText('Maria Santos - CPF: 987.654.321-09')).toBeInTheDocument()
    })
  })

  it('deve carregar e exibir contas existentes', async () => {
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar o carregamento das contas
    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument()
      expect(screen.getByText('789012')).toBeInTheDocument()
    })
  })

  it('deve permitir criar uma nova conta', async () => {
    const user = userEvent.setup()
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar o carregamento dos dados
    await waitFor(() => {
      expect(screen.getByText('-- Selecione um cliente --')).toBeInTheDocument()
    })

    // Selecionar um usuário
    const selectUsuario = screen.getByLabelText('Selecione o Cliente:')
    await user.selectOptions(selectUsuario, '1')

    // Preencher número da conta
    const inputNumeroConta = screen.getByLabelText('Número da Conta:')
    await user.type(inputNumeroConta, '555555')

    // Submeter o formulário
    const submitButton = screen.getByRole('button', { name: /salvar conta/i })
    await user.click(submitButton)

    // Verificar se a conta foi criada (seria necessário verificar se aparece na lista)
    await waitFor(() => {
      expect(inputNumeroConta.value).toBe('')
    })
  })

  it('deve validar número de conta obrigatório', async () => {
    const user = userEvent.setup()
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar o carregamento
    await waitFor(() => {
      expect(screen.getByText('-- Selecione um cliente --')).toBeInTheDocument()
    })

    // Selecionar usuário sem preencher número da conta
    const selectUsuario = screen.getByLabelText('Selecione o Cliente:')
    await user.selectOptions(selectUsuario, '1')

    // Tentar submeter o formulário
    const submitButton = screen.getByRole('button', { name: /salvar conta/i })
    await user.click(submitButton)

    // O formulário HTML5 deve impedir o submit
    expect(screen.getByLabelText('Número da Conta:')).toBeInvalid()
  })

  it('deve permitir editar uma conta existente', async () => {
    const user = userEvent.setup()
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar o carregamento das contas
    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument()
    })

    // Clicar no botão de editar da primeira conta
    const editButton = screen.getAllByText('Editar')[0]
    await user.click(editButton)

    // Verificar se entrou em modo de edição
    await waitFor(() => {
      expect(screen.getByText('Editar Conta')).toBeInTheDocument()
    })

    // Alterar o número da conta
    const inputNumeroConta = screen.getByLabelText('Número da Conta:')
    await user.clear(inputNumeroConta)
    await user.type(inputNumeroConta, '999999')

    // Submeter as alterações
    const updateButton = screen.getByRole('button', { name: /atualizar conta/i })
    await user.click(updateButton)

    // Verificar se voltou ao modo de criação
    await waitFor(() => {
      expect(screen.getByText('Nova Conta')).toBeInTheDocument()
    })
  })

  it('deve permitir deletar uma conta', async () => {
    const user = userEvent.setup()
    
    // Mock do window.confirm
    window.confirm = vi.fn(() => true)
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar o carregamento das contas
    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument()
    })

    // Clicar no botão de excluir da primeira conta
    const deleteButton = screen.getAllByText('Excluir')[0]
    await user.click(deleteButton)

    // Verificar se o confirm foi chamado
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta conta?')
  })

  it('deve validar duplicação de número de conta', async () => {
    const user = userEvent.setup()
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar o carregamento
    await waitFor(() => {
      expect(screen.getByText('-- Selecione um cliente --')).toBeInTheDocument()
    })

    // Selecionar usuário
    const selectUsuario = screen.getByLabelText('Selecione o Cliente:')
    await user.selectOptions(selectUsuario, '1')

    // Tentar usar um número de conta que já existe
    const inputNumeroConta = screen.getByLabelText('Número da Conta:')
    await user.type(inputNumeroConta, '123456')

    // Verificar se aparece a mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('Este número de conta já está em uso')).toBeInTheDocument()
    })
  })

  it('deve mostrar loading durante o carregamento', () => {
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Inicialmente deve mostrar loading
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('deve mostrar mensagem de erro quando ocorrer falha no carregamento', async () => {
    // Simular erro na API
    const { server } = await import('../mocks/server')
    const { http, HttpResponse } = await import('msw')
    
    server.use(
      http.get('http://localhost:8080/api/usuarios', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar a mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument()
    })
  })
}) 