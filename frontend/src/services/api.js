import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = {
  getUsuarios: async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },
  
  getUsuarioById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com ID ${id}:`, error);
      throw error;
    }
  },
  
  createUsuario: async (usuarioData) => {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, usuarioData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
  
  updateUsuario: async (id, usuarioData) => {
    try {
      const response = await axios.put(`${API_URL}/usuarios/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteUsuario: async (id) => {
    try {
      await axios.delete(`${API_URL}/usuarios/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir usuário com ID ${id}:`, error);
      throw error;
    }
  },
  
  // Contas
  getContas: async () => {
    try {
      const response = await axios.get(`${API_URL}/contas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      throw error;
    }
  },
  
  getContaById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/contas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar conta com ID ${id}:`, error);
      throw error;
    }
  },
  
  getContasByUsuarioId: async (usuarioId) => {
    try {
      const response = await axios.get(`${API_URL}/contas/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar contas do usuário com ID ${usuarioId}:`, error);
      throw error;
    }
  },
  
  createConta: async (contaData) => {
    try {
      const response = await axios.post(`${API_URL}/contas`, contaData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  },
  
  updateConta: async (id, contaData) => {
    try {
      const response = await axios.put(`${API_URL}/contas/${id}`, contaData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar conta com ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteConta: async (id) => {
    try {
      await axios.delete(`${API_URL}/contas/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir conta com ID ${id}:`, error);
      throw error;
    }
  },
  
  // Movimentações
  getMovimentacoes: async () => {
    try {
      const response = await axios.get(`${API_URL}/movimentacoes`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error);
      throw error;
    }
  },
  
  getMovimentacaoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/movimentacoes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar movimentação com ID ${id}:`, error);
      throw error;
    }
  },
  
  getMovimentacoesByContaId: async (contaId) => {
    try {
      const response = await axios.get(`${API_URL}/movimentacoes/conta/${contaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar movimentações da conta com ID ${contaId}:`, error);
      throw error;
    }
  },
  
  createMovimentacao: async (movimentacaoData) => {
    try {
      const response = await axios.post(`${API_URL}/movimentacoes`, movimentacaoData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      throw error;
    }
  },
  
  updateMovimentacao: async (id, movimentacaoData) => {
    try {
      const response = await axios.put(`${API_URL}/movimentacoes/${id}`, movimentacaoData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar movimentação com ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteMovimentacao: async (id) => {
    try {
      await axios.delete(`${API_URL}/movimentacoes/${id}`);
      return true;
    } catch (error) {
      console.error(`Erro ao excluir movimentação com ID ${id}:`, error);
      throw error;
    }
  }
};

export default api;