import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  return (
    <div className='wrapper'>
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
  )
}

export default Header