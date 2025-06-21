import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções da API
const apiService = {
  async getUsuarios() {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async getUsuarioById(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async createUsuario(usuario) {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  async updateUsuario(id, usuario) {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  async deleteUsuario(id) {
    await api.delete(`/usuarios/${id}`);
    return true;
  },

  async getContas() {
    const response = await api.get('/contas');
    return response.data;
  },

  async getContaById(id) {
    const response = await api.get(`/contas/${id}`);
    return response.data;
  },

  async getContasByUsuarioId(usuarioId) {
    const response = await api.get(`/contas/usuario/${usuarioId}`);
    return response.data;
  },

  async createConta(conta) {
    const response = await api.post('/contas', conta);
    return response.data;
  },

  async updateConta(id, conta) {
    const response = await api.put(`/contas/${id}`, conta);
    return response.data;
  },

  async deleteConta(id) {
    await api.delete(`/contas/${id}`);
    return true;
  },

  async getMovimentacoes() {
    const response = await api.get('/movimentacoes');
    return response.data;
  },

  async getMovimentacoesByContaId(contaId) {
    const response = await api.get(`/movimentacoes/conta/${contaId}`);
    return response.data;
  },

  async createMovimentacao(movimentacao) {
    const response = await api.post('/movimentacoes', movimentacao);
    return response.data;
  },
};

export default apiService;