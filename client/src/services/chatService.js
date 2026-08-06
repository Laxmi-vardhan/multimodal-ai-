import api from './api';

export const createChatApi = async (data) => {
  const res = await api.post('/chat/chats', data);
  return res.data;
};

export const getChatsApi = async () => {
  const res = await api.get('/chat/chats');
  return res.data;
};

export const getMessagesApi = async (chatId) => {
  const res = await api.get(`/chat/chats/${chatId}/messages`);
  return res.data;
};

export const sendMessageApi = async (data) => {
  const res = await api.post('/chat/messages', data);
  return res.data;
};

export const deleteChatApi = async (chatId) => {
  const res = await api.delete(`/chat/chats/${chatId}`);
  return res.data;
};
