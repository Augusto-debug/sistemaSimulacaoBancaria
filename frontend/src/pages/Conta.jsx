import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import './Conta.css';

const Conta = () => {
  const [usuarios, setUsuarios] = useState([]);
  
  const [formData, setFormData] = useState({
    id: null,
    usuarioId: '',
    numeroConta: '',
    saldo: 0
  });
  
  const [formErrors, setFormErrors] = useState({
    numeroConta: ''
  });
  
  const [contas, setContas] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getUsuarios(),
      api.getContas()
    ])
      .then(([usuariosData, contasData]) => {
        setUsuarios(usuariosData);
        setContas(contasData);
        setError(null);
      })
      .catch(err => {
        setError('Erro ao carregar dados');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const contaJaExiste = (numeroConta) => {
    return contas.some(conta => 
      conta.numeroConta === numeroConta && 
      (editMode ? conta.id !== formData.id : true)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';

    if (name === 'numeroConta') {
      newValue = value.replace(/\D/g, '');
      
      if (contaJaExiste(newValue)) {
        error = 'Este número de conta já está em uso';
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
      numeroConta: ''
    };

    if (!formData.numeroConta.trim()) {
      errors.numeroConta = 'Número da conta é obrigatório';
    } else if (contaJaExiste(formData.numeroConta)) {
      errors.numeroConta = 'Este número de conta já está em uso';
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
        await api.updateConta(formData.id, {
          numeroConta: formData.numeroConta
        });
      } else {
        await api.createConta({
          usuarioId: formData.usuarioId,
          numeroConta: formData.numeroConta
        });
      }
      
      const updatedContas = await api.getContas();
      setContas(updatedContas);
      setFormData({ id: null, usuarioId: '', numeroConta: '', saldo: 0 });
      setFormErrors({ numeroConta: '' });
      setEditMode(false);
    } catch (err) {
      setError('Erro ao salvar conta');
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        await api.deleteConta(id);
        const updatedContas = await api.getContas();
        setContas(updatedContas);
      } catch (err) {
        setError('Erro ao remover conta');
        console.error(err);
      }
    }
  };

  const handleEdit = (conta) => {
    setFormData({
      id: conta.id,
      usuarioId: conta.usuario.id,
      numeroConta: conta.numeroConta,
      saldo: conta.saldo
    });
    setFormErrors({ numeroConta: '' });
    setEditMode(true);
  };

  return (
    <div className="conta-container">
      <Header />
      
      <main className="content">
        <h1>Gerenciamento de Contas</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <section className="form-container">
          <h2>{editMode ? 'Editar Conta' : 'Nova Conta'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="usuarioId">Selecione o Cliente:</label>
              <select
                id="usuarioId"
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                required
                className="select-input"
                disabled={editMode}
              >
                <option value="">-- Selecione um cliente --</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome} - CPF: {formatCPF(usuario.cpf)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="numeroConta">Número da Conta:</label>
              <input
                type="text"
                id="numeroConta"
                name="numeroConta"
                value={formData.numeroConta}
                onChange={handleChange}
                required
                placeholder="Ex: 123456"
              />
              {formErrors.numeroConta && <div className="error-text">{formErrors.numeroConta}</div>}
            </div>
            
            <div className="form-group button-group">
              <button type="submit" className="submit-btn">
                {editMode ? 'Atualizar' : 'Cadastrar'}
              </button>
              {editMode && (
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setFormData({ id: null, usuarioId: '', numeroConta: '', saldo: 0 });
                    setFormErrors({ numeroConta: '' });
                    setEditMode(false);
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="table-container">
          <h2>Lista de Contas</h2>
          {loading ? (
            <div className="loading-message">Carregando contas...</div>
          ) : (
            <table className="contas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>CPF</th>
                  <th>Número da Conta</th>
                  <th>Saldo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {contas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">Nenhuma conta encontrada</td>
                  </tr>
                ) : (
                  contas.map(conta => (
                    <tr key={conta.id}>
                      <td>{conta.id}</td>
                      <td>{conta.usuario.nome}</td>
                      <td>{formatCPF(conta.usuario.cpf)}</td>
                      <td>{conta.numeroConta}</td>
                      <td>R$ {parseFloat(conta.saldo).toFixed(2)}</td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(conta)}
                        >
                          Editar
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleRemove(conta.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Conta;