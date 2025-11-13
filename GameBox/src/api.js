// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // teu backend
});

// interceptador: adiciona o token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // salva o token no login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
