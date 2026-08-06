import { db } from '../db/index.js';
import { chatWithMultimodalContent } from '../services/geminiService.js';

export const createChat = async (req, res, next) => {
  try {
    const { title, file_ids, category } = req.body;

    const chat = await db.createChat({
      user_id: req.user.id,
      title: title || 'New Multimodal Conversation',
      file_ids: file_ids || [],
      category: category || 'Personal'
    });

    await db.addHistory({
      user_id: req.user.id,
      action_type: 'CHAT_CREATE',
      description: `Created new chat session: "${chat.title}"`,
      resource_id: chat.id
    });

    return res.status(201).json({ success: true, chat });
  } catch (err) {
    next(err);
  }
};

export const getUserChats = async (req, res, next) => {
  try {
    const chats = await db.getUserChats(req.user.id);
    return res.json({ success: true, chats });
  } catch (err) {
    next(err);
  }
};

export const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const messages = await db.getChatMessages(chatId, req.user.id);
    return res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { chat_id, content, file_ids } = req.body;

    // Save user message
    const userMsg = await db.addMessage({
      chat_id,
      user_id: req.user.id,
      sender: 'user',
      content,
      references_json: []
    });

    // Fetch user files associated with this message or chat
    const allUserFiles = await db.getUserFiles(req.user.id);
    const targetFiles = file_ids && file_ids.length > 0
      ? allUserFiles.filter(f => file_ids.includes(f.id))
      : allUserFiles;

    // Fetch existing chat message history for context
    const existingMessages = await db.getChatMessages(chat_id, req.user.id);

    // Call Gemini Multimodal Assistant
    const aiResponse = await chatWithMultimodalContent({
      files: targetFiles,
      chatHistory: existingMessages.slice(-6), // last 6 messages context
      userQuery: content
    });

    // Save AI response message
    const aiMsg = await db.addMessage({
      chat_id,
      user_id: req.user.id,
      sender: 'ai',
      content: aiResponse.reply,
      references_json: aiResponse.references || []
    });

    return res.json({
      success: true,
      userMessage: userMsg,
      aiMessage: aiMsg
    });
  } catch (err) {
    next(err);
  }
};

export const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    await db.deleteChat(chatId, req.user.id);
    return res.json({ success: true, message: 'Chat session deleted.' });
  } catch (err) {
    next(err);
  }
};
