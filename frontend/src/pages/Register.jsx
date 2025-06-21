import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    endereco: '',
    email: '',
    senha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e) => {
    const formattedValue = formatCpf(e.target.value);
    setFormData({
      ...formData,
      cpf: formattedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Remove formatação do CPF antes de enviar
    const cleanedData = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, '')
    };

    const result = await register(cleanedData);
    
    if (result.success) {
      navigate('/usuario');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Cadastro</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              maxLength="14"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço:</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="login-link">
          <p>
            Já tem uma conta? 
            <Link to="/login"> Entre aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 