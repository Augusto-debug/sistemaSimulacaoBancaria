import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='wrapper'>
      <div className='nav-links'>
        <ul>
          <li><Link to="/Usuario">Pessoa</Link></li>
        </ul>
        <ul>
          <li><Link to="/Conta">Conta</Link></li>
        </ul>
        <ul>
          <li><Link to="/Movimentacao">Movimentação</Link></li>
        </ul>
      </div>
      
      {user && (
        <div className='user-info'>
          <span>Bem-vindo, {user.nome}</span>
          <button onClick={handleLogout} className='logout-btn'>
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

export default Header