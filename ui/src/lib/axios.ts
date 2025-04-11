// lib/axios.ts
import axios from 'axios';
import { getAuthToken } from '@/stores/auth.store';
import config from '@/config';

const api = axios.create({
  baseURL: config.api.uri, // ajusta si tienes otro host o puerto
});

api.interceptors.request.use((config) => {
  if (!config.url?.includes('/auth/login')) {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
