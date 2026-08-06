import api from './api';

export const generateReportApi = async (data) => {
  const res = await api.post('/report/generate', data);
  return res.data;
};

export const getReportsApi = async () => {
  const res = await api.get('/report');
  return res.data;
};

export const getReportByIdApi = async (id) => {
  const res = await api.get(`/report/${id}`);
  return res.data;
};

export const deleteReportApi = async (id) => {
  const res = await api.delete(`/report/${id}`);
  return res.data;
};
