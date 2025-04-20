import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Usuario from './pages/usuario'
import Conta from './pages/Conta'
import Movimentacao from './pages/Movimentacao'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Usuario />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/conta" element={<Conta />} />
        <Route path="/movimentacao" element={<Movimentacao />} />
      </Routes>
    
    </BrowserRouter>
    
  )
}

export default App
