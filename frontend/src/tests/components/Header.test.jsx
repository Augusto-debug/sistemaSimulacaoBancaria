import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Header from '../../components/Header'

// Wrapper para componentes que usam Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Componente Header', () => {
  it('deve renderizar o título corretamente', () => {
    render(
      <RouterWrapper>
        <Header />
      </RouterWrapper>
    )
    
    expect(screen.getByText('Sistema Bancário')).toBeInTheDocument()
  })

  it('deve renderizar todos os links de navegação', () => {
    render(
      <RouterWrapper>
        <Header />
      </RouterWrapper>
    )
    
    expect(screen.getByText('Usuários')).toBeInTheDocument()
    expect(screen.getByText('Contas')).toBeInTheDocument()
    expect(screen.getByText('Movimentações')).toBeInTheDocument()
  })

  it('deve ter links com href corretos', () => {
    render(
      <RouterWrapper>
        <Header />
      </RouterWrapper>
    )
    
    const linkUsuarios = screen.getByRole('link', { name: 'Usuários' })
    const linkContas = screen.getByRole('link', { name: 'Contas' })
    const linkMovimentacoes = screen.getByRole('link', { name: 'Movimentações' })
    
    expect(linkUsuarios).toHaveAttribute('href', '/usuarios')
    expect(linkContas).toHaveAttribute('href', '/contas')
    expect(linkMovimentacoes).toHaveAttribute('href', '/movimentacoes')
  })

  it('deve ter a estrutura HTML correta', () => {
    render(
      <RouterWrapper>
        <Header />
      </RouterWrapper>
    )
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('header')
  })
}) 