import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/^﻿/, '').trim() || 'https://server-production-79cc.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
