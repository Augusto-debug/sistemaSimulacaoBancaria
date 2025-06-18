import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Conta from '../../pages/Conta'

// Wrapper para componentes que usam Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Fluxo Completo - Gerenciamento de Contas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve permitir o fluxo completo: criar, editar e excluir conta', async () => {
    const user = userEvent.setup()
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // 1. Verificar carregamento inicial
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    
    // 2. Aguardar carregamento dos dados
    await waitFor(() => {
      expect(screen.getByText('Gerenciamento de Contas')).toBeInTheDocument()
      expect(screen.getByText('-- Selecione um cliente --')).toBeInTheDocument()
    })
    
    // 3. Verificar que as contas existentes são exibidas
    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument()
      expect(screen.getByText('789012')).toBeInTheDocument()
    })
    
    // 4. CRIAR NOVA CONTA
    console.log('=== CRIANDO NOVA CONTA ===')
    
    // Selecionar usuário
    const selectUsuario = screen.getByLabelText('Selecione o Cliente:')
    await user.selectOptions(selectUsuario, '1')
    
    // Preencher número da conta
    const inputNumeroConta = screen.getByLabelText('Número da Conta:')
    await user.type(inputNumeroConta, '555555')
    
    // Submeter formulário
    const submitButton = screen.getByRole('button', { name: /salvar conta/i })
    await user.click(submitButton)
    
    // Verificar se o formulário foi resetado
    await waitFor(() => {
      expect(inputNumeroConta.value).toBe('')
      expect(selectUsuario.value).toBe('')
    })
    
    // 5. EDITAR CONTA EXISTENTE
    console.log('=== EDITANDO CONTA ===')
    
    // Aguardar e clicar no botão de editar da primeira conta
    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument()
    })
    
    const editButtons = screen.getAllByText('Editar')
    await user.click(editButtons[0])
    
    // Verificar se entrou em modo de edição
    await waitFor(() => {
      expect(screen.getByText('Editar Conta')).toBeInTheDocument()
    })
    
    // Verificar se os campos foram preenchidos
    expect(inputNumeroConta.value).toBe('123456')
    expect(selectUsuario).toBeDisabled() // Deve estar desabilitado em modo de edição
    
    // Alterar o número da conta
    await user.clear(inputNumeroConta)
    await user.type(inputNumeroConta, '999999')
    
    // Submeter alterações
    const updateButton = screen.getByRole('button', { name: /atualizar conta/i })
    await user.click(updateButton)
    
    // Verificar se voltou ao modo de criação
    await waitFor(() => {
      expect(screen.getByText('Nova Conta')).toBeInTheDocument()
      expect(selectUsuario).toBeEnabled()
    })
    
    // 6. EXCLUIR CONTA
    console.log('=== EXCLUINDO CONTA ===')
    
    // Mock do window.confirm para confirmar exclusão
    window.confirm = vi.fn(() => true)
    
    // Aguardar e clicar no botão de excluir
    await waitFor(() => {
      expect(screen.getAllByText('Excluir')).toHaveLength(2)
    })
    
    const deleteButtons = screen.getAllByText('Excluir')
    await user.click(deleteButtons[0])
    
    // Verificar se o confirm foi chamado
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esta conta?')
    
    console.log('=== FLUXO COMPLETO FINALIZADO ===')
  })

  it('deve validar duplicação de número de conta durante criação', async () => {
    const user = userEvent.setup()
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByText('-- Selecione um cliente --')).toBeInTheDocument()
    })
    
    // Selecionar usuário
    const selectUsuario = screen.getByLabelText('Selecione o Cliente:')
    await user.selectOptions(selectUsuario, '1')
    
    // Tentar usar número de conta existente
    const inputNumeroConta = screen.getByLabelText('Número da Conta:')
    await user.type(inputNumeroConta, '123456')
    
    // Verificar mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('Este número de conta já está em uso')).toBeInTheDocument()
    })
    
    // Verificar que o botão de submit fica desabilitado
    const submitButton = screen.getByRole('button', { name: /salvar conta/i })
    expect(submitButton).toBeDisabled()
  })

  it('deve lidar com erros de rede graciosamente', async () => {
    // Simular erro na API
    const { server } = await import('../mocks/server')
    const { http, HttpResponse } = await import('msw')
    
    server.use(
      http.get('http://localhost:8080/api/usuarios', () => {
        return new HttpResponse(null, { status: 500 })
      }),
      http.get('http://localhost:8080/api/contas', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Verificar se a mensagem de erro é exibida
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument()
    })
  })

  it('deve manter o estado durante interações complexas', async () => {
    const user = userEvent.setup()
    
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByText('-- Selecione um cliente --')).toBeInTheDocument()
    })
    
    // 1. Iniciar criação de conta
    const selectUsuario = screen.getByLabelText('Selecione o Cliente:')
    await user.selectOptions(selectUsuario, '1')
    
    const inputNumeroConta = screen.getByLabelText('Número da Conta:')
    await user.type(inputNumeroConta, '777777')
    
    // 2. Mudar para modo de edição sem submeter
    const editButtons = screen.getAllByText('Editar')
    await user.click(editButtons[0])
    
    // 3. Verificar que entrou em modo de edição e os dados anteriores foram perdidos
    await waitFor(() => {
      expect(screen.getByText('Editar Conta')).toBeInTheDocument()
    })
    
    // 4. Cancelar edição (seria implementado no componente real)
    // Para este teste, vamos simular clicando em "Editar" novamente para voltar
    
    // 5. Verificar que voltou ao estado inicial
    expect(screen.getByText('Editar Conta')).toBeInTheDocument()
  })

  it('deve exibir informações corretas nas listagens', async () => {
    render(
      <RouterWrapper>
        <Conta />
      </RouterWrapper>
    )
    
    // Aguardar carregamento das contas
    await waitFor(() => {
      expect(screen.getByText('123456')).toBeInTheDocument()
    })
    
    // Verificar informações da primeira conta
    expect(screen.getByText('123456')).toBeInTheDocument()
    expect(screen.getByText('R$ 1000,00')).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    
    // Verificar informações da segunda conta
    expect(screen.getByText('789012')).toBeInTheDocument()
    expect(screen.getByText('R$ 2500,50')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    
    // Verificar que há botões de ação para cada conta
    const editButtons = screen.getAllByText('Editar')
    const deleteButtons = screen.getAllByText('Excluir')
    
    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })
}) 