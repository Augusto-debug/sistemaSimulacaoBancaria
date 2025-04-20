import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import './usuario.css';

const Usuario = () => {
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    cpf: '',
    endereco: ''
  });

  const [formErrors, setFormErrors] = useState({
    nome: '',
    cpf: '',
    endereco: ''
  });

  const [usuarios, setUsuarios] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await api.getUsuarios();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar nome (primeira letra de cada palavra maiúscula)
  const formatNome = (nome) => {
    return nome
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(' ');
  };

  // Função para formatar CPF com máscara xxx.xxx.xxx-xx
  const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cpf.length > 11) cpf = cpf.slice(0, 11); // Limita a 11 dígitos
    
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  // Verifica se nome contém números
  const nomeContemNumeros = (nome) => {
    return /\d/.test(nome);
  };

  // Valida formato do CPF
  const validaCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';

    if (name === 'nome') {
      if (nomeContemNumeros(value)) {
        error = 'O nome não pode conter números';
      } else {
        newValue = formatNome(value);
      }
    } 
    else if (name === 'cpf') {
      newValue = formatCPF(value);
      if (newValue.replace(/\D/g, '').length > 0 && !validaCPF(newValue)) {
        error = 'CPF deve conter 11 dígitos';
      }
    }

    setFormData({
      ...formData,
      [name]: newValue
    });

    setFormErrors({
      ...formErrors,
      [name]: error
    });
  };

  const validateForm = () => {
    const errors = {
      nome: '',
      cpf: '',
      endereco: ''
    };

    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    } else if (nomeContemNumeros(formData.nome)) {
      errors.nome = 'O nome não pode conter números';
    }

    if (!formData.cpf.trim()) {
      errors.cpf = 'CPF é obrigatório';
    } else if (!validaCPF(formData.cpf)) {
      errors.cpf = 'CPF inválido';
    }

    if (!formData.endereco.trim()) {
      errors.endereco = 'Endereço é obrigatório';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (editMode) {
        await api.updateUsuario(formData.id, formData);
      } else {
        await api.createUsuario(formData);
      }
      
      fetchUsuarios();
      setFormData({ id: null, nome: '', cpf: '', endereco: '' });
      setFormErrors({ nome: '', cpf: '', endereco: '' });
      setEditMode(false);
    } catch (err) {
      setError('Erro ao salvar usuário');
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.deleteUsuario(id);
        fetchUsuarios();
      } catch (err) {
        setError('Erro ao remover usuário');
        console.error(err);
      }
    }
  };

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setFormErrors({ nome: '', cpf: '', endereco: '' });
    setEditMode(true);
  };

  return (
    <div className="usuario-container">
      <Header />
      
      <main className="content">
        <h1>Cadastro de Usuário</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <section className="form-container">
          <h2>{editMode ? 'Editar Usuário' : 'Novo Usuário'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
              {formErrors.nome && <div className="error-text">{formErrors.nome}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cpf">CPF:</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                maxLength="14"
                required
              />
              {formErrors.cpf && <div className="error-text">{formErrors.cpf}</div>}
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
              {formErrors.endereco && <div className="error-text">{formErrors.endereco}</div>}
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn-submit">
                {editMode ? 'Atualizar' : 'Cadastrar'}
              </button> 
              
              {editMode && (
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setFormData({ id: null, nome: '', cpf: '', endereco: '' });
                    setFormErrors({ nome: '', cpf: '', endereco: '' });
                    setEditMode(false);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
        
        <section className="users-container">
          <h2>Usuários Cadastrados</h2>
          {loading ? (
            <p>Carregando usuários...</p>
          ) : usuarios.length === 0 ? (
            <p>Nenhum usuário cadastrado.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Endereço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nome}</td>
                    <td>{user.cpf}</td>
                    <td>{user.endereco}</td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(user)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleRemove(user.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Usuario;