import express from 'express';
import { createChat, getUserChats, getChatMessages, sendMessage, deleteChat } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createChatSchema, sendMessageSchema } from '../utils/zodSchemas.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/chats', validate(createChatSchema), createChat);
router.get('/chats', getUserChats);
router.get('/chats/:chatId/messages', getChatMessages);
router.post('/messages', validate(sendMessageSchema), sendMessage);
router.delete('/chats/:chatId', deleteChat);

export default router;
