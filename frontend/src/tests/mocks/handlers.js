import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8080/api'

const mockUsuarios = [
  { id: 1, nome: 'João Silva', cpf: '12345678901', endereco: 'Rua A, 123' },
  { id: 2, nome: 'Maria Santos', cpf: '98765432109', endereco: 'Rua B, 456' }
]

const mockContas = [
  { id: 1, numeroConta: '123456', saldo: 1000.00, usuario: mockUsuarios[0] },
  { id: 2, numeroConta: '789012', saldo: 2500.50, usuario: mockUsuarios[1] }
]

const mockMovimentacoes = [
  { id: 1, tipo: 'CREDITO', valor: 500.00, data: '2024-01-15', conta: mockContas[0] },
  { id: 2, tipo: 'DEBITO', valor: 200.00, data: '2024-01-16', conta: mockContas[0] }
]

export const handlers = [
  http.get(`${API_URL}/usuarios`, () => {
    return HttpResponse.json(mockUsuarios)
  }),

  http.get(`${API_URL}/usuarios/:id`, ({ params }) => {
    const id = parseInt(params.id)
    const usuario = mockUsuarios.find(u => u.id === id)
    
    if (usuario) {
      return HttpResponse.json(usuario)
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.post(`${API_URL}/usuarios`, async ({ request }) => {
    const novoUsuario = await request.json()
    const usuario = {
      id: mockUsuarios.length + 1,
      ...novoUsuario
    }
    mockUsuarios.push(usuario)
    return HttpResponse.json(usuario, { status: 201 })
  }),

  http.put(`${API_URL}/usuarios/:id`, async ({ params, request }) => {
    const id = parseInt(params.id)
    const dadosAtualizados = await request.json()
    const index = mockUsuarios.findIndex(u => u.id === id)
    
    if (index !== -1) {
      mockUsuarios[index] = { ...mockUsuarios[index], ...dadosAtualizados }
      return HttpResponse.json(mockUsuarios[index])
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.delete(`${API_URL}/usuarios/:id`, ({ params }) => {
    const id = parseInt(params.id)
    const index = mockUsuarios.findIndex(u => u.id === id)
    
    if (index !== -1) {
      mockUsuarios.splice(index, 1)
      return new HttpResponse(null, { status: 204 })
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.get(`${API_URL}/contas`, () => {
    return HttpResponse.json(mockContas)
  }),

  http.get(`${API_URL}/contas/:id`, ({ params }) => {
    const id = parseInt(params.id)
    const conta = mockContas.find(c => c.id === id)
    
    if (conta) {
      return HttpResponse.json(conta)
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.get(`${API_URL}/contas/usuario/:usuarioId`, ({ params }) => {
    const usuarioId = parseInt(params.usuarioId)
    const contas = mockContas.filter(c => c.usuario.id === usuarioId)
    return HttpResponse.json(contas)
  }),

  http.post(`${API_URL}/contas`, async ({ request }) => {
    const novaConta = await request.json()
    const usuario = mockUsuarios.find(u => u.id === novaConta.usuarioId)
    
    if (!usuario) {
      return new HttpResponse(null, { status: 404 })
    }

    const conta = {
      id: mockContas.length + 1,
      numeroConta: novaConta.numeroConta,
      saldo: 0,
      usuario: usuario
    }
    mockContas.push(conta)
    return HttpResponse.json(conta, { status: 201 })
  }),

  http.put(`${API_URL}/contas/:id`, async ({ params, request }) => {
    const id = parseInt(params.id)
    const dadosAtualizados = await request.json()
    const index = mockContas.findIndex(c => c.id === id)
    
    if (index !== -1) {
      mockContas[index] = { ...mockContas[index], ...dadosAtualizados }
      return HttpResponse.json(mockContas[index])
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.delete(`${API_URL}/contas/:id`, ({ params }) => {
    const id = parseInt(params.id)
    const index = mockContas.findIndex(c => c.id === id)
    
    if (index !== -1) {
      mockContas.splice(index, 1)
      return new HttpResponse(null, { status: 204 })
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.get(`${API_URL}/movimentacoes`, () => {
    return HttpResponse.json(mockMovimentacoes)
  }),

  http.get(`${API_URL}/movimentacoes/conta/:contaId`, ({ params }) => {
    const contaId = parseInt(params.contaId)
    const movimentacoes = mockMovimentacoes.filter(m => m.conta.id === contaId)
    return HttpResponse.json(movimentacoes)
  }),

  http.post(`${API_URL}/movimentacoes`, async ({ request }) => {
    const novaMovimentacao = await request.json()
    const conta = mockContas.find(c => c.id === novaMovimentacao.contaId)
    
    if (!conta) {
      return new HttpResponse(null, { status: 404 })
    }

    const movimentacao = {
      id: mockMovimentacoes.length + 1,
      tipo: novaMovimentacao.tipo,
      valor: novaMovimentacao.valor,
      data: novaMovimentacao.data,
      conta: conta
    }
    mockMovimentacoes.push(movimentacao)
    return HttpResponse.json(movimentacao, { status: 201 })
  })
] 