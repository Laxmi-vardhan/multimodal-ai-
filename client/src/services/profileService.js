import api from './api';

export const updateProfileApi = async (data) => {
  const res = await api.put('/profile', data);
  return res.data;
};

export const getProfileStatsApi = async () => {
  const res = await api.get('/profile/stats');
  return res.data;
};
