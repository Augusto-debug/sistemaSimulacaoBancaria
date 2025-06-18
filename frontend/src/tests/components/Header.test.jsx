import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Header from '../../components/Header'

// Wrapper para componentes que usam Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Header Component', () => {
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
    
    expect(screen.getByText('Pessoa')).toBeInTheDocument()
    expect(screen.getByText('Conta')).toBeInTheDocument()
    expect(screen.getByText('Movimentação')).toBeInTheDocument()
  })

  it('deve ter links funcionais', () => {
    render(
      <RouterWrapper>
        <Header />
      </RouterWrapper>
    )
    
    const pessoaLink = screen.getByText('Pessoa').closest('a')
    const contaLink = screen.getByText('Conta').closest('a')
    const movimentacaoLink = screen.getByText('Movimentação').closest('a')
    
    expect(pessoaLink).toHaveAttribute('href', '/Usuario')
    expect(contaLink).toHaveAttribute('href', '/Conta')
    expect(movimentacaoLink).toHaveAttribute('href', '/Movimentacao')
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