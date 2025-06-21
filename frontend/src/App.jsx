import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Usuario from './pages/usuario'
import Conta from './pages/Conta'
import Movimentacao from './pages/Movimentacao'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route 
            path="/usuario" 
            element={
              <ProtectedRoute>
                <Usuario />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/conta" 
            element={
              <ProtectedRoute>
                <Conta />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/movimentacao" 
            element={
              <ProtectedRoute>
                <Movimentacao />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
