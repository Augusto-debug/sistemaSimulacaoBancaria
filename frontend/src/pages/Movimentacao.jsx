import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import './Movimentacao.css';

const Movimentacao = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [contas, setContas] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    usuarioId: '',
    contaId: '',
    tipo: 'DEPOSITO',
    valor: '',
    data: new Date().toISOString().split('T')[0]
  });

  const [formErrors, setFormErrors] = useState({
    contaId: '',
    valor: ''
  });

  const [movimentacoes, setMovimentacoes] = useState([]);
  const [extratoAtual, setExtratoAtual] = useState([]);
  const [contasDoUsuario, setContasDoUsuario] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getUsuarios(),
      api.getContas(),
      api.getMovimentacoes()
    ])
      .then(([usuariosData, contasData, movimentacoesData]) => {
        setUsuarios(usuariosData);
        setContas(contasData);
        setMovimentacoes(movimentacoesData);
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

  useEffect(() => {
    if (formData.usuarioId) {
      const filteredContas = contas.filter(conta => conta.usuario.id === parseInt(formData.usuarioId));
      setContasDoUsuario(filteredContas);
    } else {
      setContasDoUsuario([]);
      setExtratoAtual([]);
      setContaSelecionada(null);
    }
  }, [formData.usuarioId, contas]);

  useEffect(() => {
    if (formData.contaId) {
      const conta = contas.find(c => c.id === parseInt(formData.contaId));
      setContaSelecionada(conta);
      const extrato = movimentacoes.filter(mov => 
        mov.conta.id === parseInt(formData.contaId)
      ).sort((a, b) => new Date(b.data) - new Date(a.data));
      
      setExtratoAtual(extrato);
    } else {
      setExtratoAtual([]);
      setContaSelecionada(null);
    }
  }, [formData.contaId, movimentacoes, contas]);

  const formatCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'usuarioId') {
      setFormData({
        ...formData,
        usuarioId: value,
        contaId: ''
      });
      setFormErrors({
        ...formErrors,
        contaId: ''
      });
      
    } else if (name === 'tipo') {
      // copia o objeto formData e altera o tipo
      setFormData({
        ...formData,
        [name]: value
      });
      // verifica se o tipo é SAQUE e se o valor é maior que o saldo da conta selecionada
      if (value === 'SAQUE' && contaSelecionada && parseFloat(formData.valor || 0) > contaSelecionada.saldo) {
        setFormErrors({
          ...formErrors,
          valor: 'Saldo insuficiente para esta operação'
        });
      } else {
        // se o tipo não for SAQUE ou o valor for menor que o saldo, limpa o erro
        setFormErrors({
          ...formErrors,
          valor: ''
        });
      }
    } else if (name === 'valor') {
      const valorNumerico = parseFloat(value);
      
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        error = 'Valor deve ser maior que zero';
      } else if (formData.tipo === 'SAQUE' && contaSelecionada && valorNumerico > contaSelecionada.saldo) {
        error = 'Saldo insuficiente para esta operação';
      }
      // se o valor for maior que zero, limpa o erro
      setFormData({
        ...formData,
        [name]: value
      });
      // se o valor for menor ou igual a zero, altera o erro
      setFormErrors({
        ...formErrors,
        valor: error
      });
    } else {
      // copia o objeto formData e altera o campo correspondente ao name
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const errors = {
      contaId: '',
      valor: ''
    };

    if (!formData.contaId) {
      errors.contaId = 'Selecione uma conta';
    }

    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      errors.valor = 'Valor deve ser maior que zero';
    } else if (formData.tipo === 'SAQUE' && contaSelecionada && valor > contaSelecionada.saldo) {
      errors.valor = 'Saldo insuficiente para esta operação';
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
        await api.updateMovimentacao(formData.id, {
          data: formData.data
        });
      } else {
        await api.createMovimentacao({
          contaId: formData.contaId,
          tipo: formData.tipo,
          valor: parseFloat(formData.valor),
          data: formData.data
        });
      }
      
      const [updatedContas, updatedMovimentacoes] = await Promise.all([
        api.getContas(),
        api.getMovimentacoes()
      ]);
      
      setContas(updatedContas);
      setMovimentacoes(updatedMovimentacoes);
      
      const usuarioAtual = formData.usuarioId;
      setFormData({
        id: null,
        usuarioId: usuarioAtual,
        contaId: formData.contaId,
        tipo: 'DEPOSITO',
        valor: '',
        data: new Date().toISOString().split('T')[0]
      });
      
      setFormErrors({
        contaId: '',
        valor: ''
      });
      
      setEditMode(false);
    } catch (err) {
      setError('Erro ao processar movimentação');
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta movimentação? Isso afetará o saldo da conta.')) {
      try {
        await api.deleteMovimentacao(id);
        
        const [updatedContas, updatedMovimentacoes] = await Promise.all([
          api.getContas(),
          api.getMovimentacoes()
        ]);
        
        setContas(updatedContas);
        setMovimentacoes(updatedMovimentacoes);
      } catch (err) {
        setError('Erro ao remover movimentação');
        console.error(err);
      }
    }
  };

  const handleEdit = (movimentacao) => {
    const conta = contas.find(c => c.id === movimentacao.conta.id);
    setFormData({
      id: movimentacao.id,
      usuarioId: conta ? conta.usuario.id.toString() : '',
      contaId: movimentacao.conta.id.toString(),
      tipo: movimentacao.tipo,
      valor: movimentacao.valor.toString(),
      data: movimentacao.data
    });
    
    if (conta) {
      const contasUsuario = contas.filter(c => c.usuario.id === conta.usuario.id);
      setContasDoUsuario(contasUsuario);
    }
    
    setEditMode(true);
  };

  const calcularSaldoTotal = () => {
    return contaSelecionada ? contaSelecionada.saldo : 0;
  };

  return (
    <div className="movimentacao-container">
      <Header />

      <main className="content">
        <h1>Movimentações Financeiras</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-layout">
          <section className="form-container">
            <h2>{editMode ? 'Editar Movimentação' : 'Nova Movimentação'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="usuarioId">Selecione o Cliente: <span className="required">*</span></label>
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
                <label htmlFor="contaId">Selecione a Conta: <span className="required">*</span></label>
                <select
                  id="contaId"
                  name="contaId"
                  value={formData.contaId}
                  onChange={handleChange}
                  required
                  className="select-input"
                  disabled={editMode || formData.usuarioId === ''}
                >
                  <option value="">-- Selecione uma conta --</option>
                  {contasDoUsuario.map(conta => (
                    <option key={conta.id} value={conta.id}>
                      Conta: {conta.numeroConta} - Saldo: R$ {conta.saldo.toFixed(2)}
                    </option>
                  ))}
                </select>
                {formErrors.contaId && <div className="error-text">{formErrors.contaId}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo de Movimentação: <span className="required">*</span></label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="select-input"
                  disabled={editMode}
                >
                  <option value="DEPOSITO">Depositar</option>
                  <option value="SAQUE">Retirar</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="valor">Valor: <span className="required">*</span></label>
                <input
                  type="number"
                  id="valor"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  disabled={editMode}
                />
                {formErrors.valor && <div className="error-text">{formErrors.valor}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="data">Data: <span className="required">*</span></label>
                <input
                  type="date"
                  id="data"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={Object.values(formErrors).some(error => error)}
                >
                  {editMode ? 'Atualizar' : 'Registrar'}
                </button>

                {editMode && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setFormData({
                        id: null,
                        usuarioId: formData.usuarioId,
                        contaId: formData.contaId,
                        tipo: 'DEPOSITO',
                        valor: '',
                        data: new Date().toISOString().split('T')[0]
                      });
                      setFormErrors({
                        contaId: '',
                        valor: ''
                      });
                      setEditMode(false);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="extrato-container">
            <h2>Extrato da Conta</h2>
            {!formData.contaId ? (
              <p>Selecione uma conta para visualizar o extrato.</p>
            ) : loading ? (
              <p>Carregando extrato...</p>
            ) : extratoAtual.length === 0 ? (
              <p>Nenhuma movimentação registrada para esta conta.</p>
            ) : (
              <>
                <table className="extrato-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extratoAtual.map((mov) => {
                      const isNegative = mov.tipo === 'SAQUE';
                      return (
                        <tr key={mov.id}>
                          <td>{new Date(mov.data).toLocaleDateString()}</td>
                          <td>{mov.tipo === 'DEPOSITO' ? 'Depósito' : 'Saque'}</td>
                          <td className={isNegative ? 'valor-negativo' : 'valor-positivo'}>
                            {isNegative ? '-' : '+'} R$ {mov.valor.toFixed(2)}
                          </td>
                          <td className="actions">
                            <button
                              className="btn-edit"
                              onClick={() => handleEdit(mov)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleRemove(mov.id)}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="saldo-total">
                  <strong>Saldo Atual:</strong> R$ {calcularSaldoTotal().toFixed(2)}
                </div>
              </>
            )}
          </section>
        </div>

        <section className="movimentacoes-container">
          <h2>Histórico de Todas as Movimentações</h2>
          {loading ? (
            <p>Carregando movimentações...</p>
          ) : movimentacoes.length === 0 ? (
            <p>Nenhuma movimentação registrada.</p>
          ) : (
            <table className="movimentacoes-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Conta</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((mov) => {
                  const isNegative = mov.tipo === 'SAQUE';
                  return (
                    <tr key={mov.id}>
                      <td>{mov.conta.usuario.nome}</td>
                      <td>{mov.conta.numeroConta}</td>
                      <td>{mov.tipo === 'DEPOSITO' ? 'Depósito' : 'Saque'}</td>
                      <td className={isNegative ? 'valor-negativo' : 'valor-positivo'}>
                        R$ {mov.valor.toFixed(2)}
                      </td>
                      <td>{new Date(mov.data).toLocaleDateString()}</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(mov)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleRemove(mov.id)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  )}
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

export default Movimentacao;