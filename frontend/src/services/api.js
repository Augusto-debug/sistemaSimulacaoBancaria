import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = {
  async getUsuarios() {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    return response.json();
  },

  async getUsuarioById(id) {
    const response = await fetch(`${API_URL}/usuarios/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar usuário');
    }
    return response.json();
  },

  async createUsuario(usuario) {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar usuário');
    }
    return response.json();
  },

  async updateUsuario(id, usuario) {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar usuário');
    }
    return response.json();
  },

  async deleteUsuario(id) {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar usuário');
    }
    return true;
  },

  async getContas() {
    const response = await fetch(`${API_URL}/contas`);
    if (!response.ok) {
      throw new Error('Erro ao buscar contas');
    }
    return response.json();
  },

  async getContaById(id) {
    const response = await fetch(`${API_URL}/contas/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar conta');
    }
    return response.json();
  },

  async getContasByUsuarioId(usuarioId) {
    const response = await fetch(`${API_URL}/contas/usuario/${usuarioId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar contas do usuário');
    }
    return response.json();
  },

  async createConta(conta) {
    const response = await fetch(`${API_URL}/contas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conta),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar conta');
    }
    return response.json();
  },

  async updateConta(id, conta) {
    const response = await fetch(`${API_URL}/contas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conta),
    });
    if (!response.ok) {
      throw new Error('Erro ao atualizar conta');
    }
    return response.json();
  },

  async deleteConta(id) {
    const response = await fetch(`${API_URL}/contas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar conta');
    }
    return true;
  },

  async getMovimentacoes() {
    const response = await fetch(`${API_URL}/movimentacoes`);
    if (!response.ok) {
      throw new Error('Erro ao buscar movimentações');
    }
    return response.json();
  },

  async getMovimentacoesByContaId(contaId) {
    const response = await fetch(`${API_URL}/movimentacoes/conta/${contaId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar movimentações da conta');
    }
    return response.json();
  },

  async createMovimentacao(movimentacao) {
    const response = await fetch(`${API_URL}/movimentacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movimentacao),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar movimentação');
    }
    return response.json();
  },
};

export default api;