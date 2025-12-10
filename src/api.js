// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// INTERCEPTOR — adiciona automaticamente o token em TODAS as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const verifyUser = (user) => {
  if(user !== null){
    return true;
  }
  return false;
}

export const verifyAdminUser = (user) => {
  try {
    if(user.role === "admin"){
      return true;
    }
    return false;
  } catch (error) {
    return false;
  } 
}


export default api;
