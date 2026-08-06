import api from './api';

export const uploadFilesApi = async (formData, onUploadProgress) => {
  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
  return res.data;
};

export const getFilesApi = async (category) => {
  const res = await api.get('/upload', { params: { category } });
  return res.data;
};

export const getFileByIdApi = async (id) => {
  const res = await api.get(`/upload/${id}`);
  return res.data;
};

export const deleteFileApi = async (id) => {
  const res = await api.delete(`/upload/${id}`);
  return res.data;
};
