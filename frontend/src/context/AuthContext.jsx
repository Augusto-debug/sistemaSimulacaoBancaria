import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Criar instância específica para autenticação (sem interceptors de token)
const authApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // O token será automaticamente aplicado pelo interceptor do api.js
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await authApi.post('/auth/login', { email, senha });
      const { token, userId, nome } = response.data;

      const userData = { id: userId, nome, email };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Erro ao fazer login' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Enviando dados de registro:', userData);
      const response = await authApi.post('/auth/register', userData);
      console.log('Resposta do registro:', response.data);
      
      const { token, userId, nome, email } = response.data;

      const userInfo = { id: userId, nome, email };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setUser(userInfo);

      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      console.error('Resposta do erro:', error.response);
      
      let errorMessage = 'Erro ao registrar usuário';
      
      if (error.response) {
        // Erro do servidor
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (error.response.status === 409) {
          errorMessage = 'Email ou CPF já estão em uso.';
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 