import api from './api';

export const searchApi = async (searchData) => {
  const res = await api.post('/search', searchData);
  return res.data;
};

export const getHistoryApi = async () => {
  const res = await api.get('/history');
  return res.data;
};

export const toggleFavoriteApi = async (data) => {
  const res = await api.post('/history/favorites', data);
  return res.data;
};

export const getFavoritesApi = async () => {
  const res = await api.get('/history/favorites');
  return res.data;
};
