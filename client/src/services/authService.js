import api from './api';

export const loginApi = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const registerApi = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};
