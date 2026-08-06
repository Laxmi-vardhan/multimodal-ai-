import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = process.env.VERCEL ? '/tmp/local_store.json' : path.join(__dirname, 'local_store.json');

// Initialize Supabase if credentials present
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Password hash for 'User@123456'
const DEMO_PASSWORD_HASH = '$2b$10$tCgYpqOA38IN6yO.V7sFX.H1nv89FDEUq1fsh4PAd7Q.pERrimHye';

// Local JSON store fallback engine
const defaultData = {
  users: [
    { id: 'u1', name: 'Alex Mercer', email: 'alex.business@omnifusion.ai', password_hash: DEMO_PASSWORD_HASH, avatar_url: '', created_at: new Date().toISOString() },
    { id: 'u2', name: 'Dr. Elena Rostova', email: 'dr.elena@omnifusion.ai', password_hash: DEMO_PASSWORD_HASH, avatar_url: '', created_at: new Date().toISOString() },
    { id: 'u3', name: 'Dr. Sarah Jenkins', email: 'dr.sarah@omnifusion.ai', password_hash: DEMO_PASSWORD_HASH, avatar_url: '', created_at: new Date().toISOString() },
    { id: 'u4', name: 'Marcus Vance', email: 'marcus.legal@omnifusion.ai', password_hash: DEMO_PASSWORD_HASH, avatar_url: '', created_at: new Date().toISOString() },
    { id: 'u5', name: 'Jordan Taylor', email: 'student.demo@omnifusion.ai', password_hash: DEMO_PASSWORD_HASH, avatar_url: '', created_at: new Date().toISOString() }
  ],
  files: [],
  chats: [],
  messages: [],
  ai_reports: [],
  history: [],
  favorites: []
};

const loadData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
      return { ...defaultData };
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db store:', err);
    return { ...defaultData };
  }
};

const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving local db store:', err);
  }
};

export const db = {
  // USERS
  createUser: async (userData) => {
    if (supabase) {
      const { data, error } = await supabase.from('users').insert([userData]).select().single();
      if (!error && data) return data;
    }
    const store = loadData();
    const newUser = {
      id: uuidv4(),
      ...userData,
      avatar_url: userData.avatar_url || '',
      created_at: new Date().toISOString()
    };
    store.users.push(newUser);
    saveData(store);
    return newUser;
  },

  findUserByEmail: async (email) => {
    if (supabase) {
      const { data } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).single();
      if (data) return data;
    }
    const store = loadData();
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: async (id) => {
    if (supabase) {
      const { data } = await supabase.from('users').select('*').eq('id', id).single();
      if (data) return data;
    }
    const store = loadData();
    return store.users.find(u => u.id === id) || null;
  },

  updateUser: async (id, updateData) => {
    if (supabase) {
      const { data } = await supabase.from('users').update(updateData).eq('id', id).select().single();
      if (data) return data;
    }
    const store = loadData();
    const idx = store.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      store.users[idx] = { ...store.users[idx], ...updateData };
      saveData(store);
      return store.users[idx];
    }
    return null;
  },

  // FILES
  createFileRecord: async (fileData) => {
    if (supabase) {
      const { data, error } = await supabase.from('files').insert([fileData]).select().single();
      if (!error && data) return data;
    }
    const store = loadData();
    const newFile = {
      id: uuidv4(),
      processed: true,
      insights_json: {},
      created_at: new Date().toISOString(),
      ...fileData
    };
    store.files.push(newFile);
    saveData(store);
    return newFile;
  },

  getUserFiles: async (userId, category = null) => {
    if (supabase) {
      let query = supabase.from('files').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (category && category !== 'All') query = query.eq('category', category);
      const { data } = await query;
      if (data) return data;
    }
    const store = loadData();
    let userFiles = store.files.filter(f => f.user_id === userId);
    if (category && category !== 'All') {
      userFiles = userFiles.filter(f => f.category === category);
    }
    return userFiles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getFileById: async (fileId, userId) => {
    if (supabase) {
      const { data } = await supabase.from('files').select('*').eq('id', fileId).eq('user_id', userId).single();
      if (data) return data;
    }
    const store = loadData();
    return store.files.find(f => f.id === fileId && f.user_id === userId) || null;
  },

  deleteFile: async (fileId, userId) => {
    if (supabase) {
      await supabase.from('files').delete().eq('id', fileId).eq('user_id', userId);
    }
    const store = loadData();
    store.files = store.files.filter(f => !(f.id === fileId && f.user_id === userId));
    saveData(store);
    return true;
  },

  updateFileInsights: async (fileId, userId, insights) => {
    if (supabase) {
      const { data } = await supabase.from('files').update({ insights_json: insights, processed: true }).eq('id', fileId).eq('user_id', userId).select().single();
      if (data) return data;
    }
    const store = loadData();
    const idx = store.files.findIndex(f => f.id === fileId && f.user_id === userId);
    if (idx !== -1) {
      store.files[idx].insights_json = insights;
      store.files[idx].processed = true;
      saveData(store);
      return store.files[idx];
    }
    return null;
  },

  // CHATS & MESSAGES
  createChat: async (chatData) => {
    if (supabase) {
      const { data } = await supabase.from('chats').insert([chatData]).select().single();
      if (data) return data;
    }
    const store = loadData();
    const newChat = {
      id: uuidv4(),
      file_ids: [],
      category: 'Personal',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...chatData
    };
    store.chats.push(newChat);
    saveData(store);
    return newChat;
  },

  getUserChats: async (userId) => {
    if (supabase) {
      const { data } = await supabase.from('chats').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
      if (data) return data;
    }
    const store = loadData();
    return store.chats.filter(c => c.user_id === userId).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  },

  getChatMessages: async (chatId, userId) => {
    if (supabase) {
      const { data } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
      if (data) return data;
    }
    const store = loadData();
    return store.messages.filter(m => m.chat_id === chatId).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  addMessage: async (msgData) => {
    if (supabase) {
      const { data } = await supabase.from('messages').insert([msgData]).select().single();
      await supabase.from('chats').update({ updated_at: new Date().toISOString() }).eq('id', msgData.chat_id);
      if (data) return data;
    }
    const store = loadData();
    const newMsg = {
      id: uuidv4(),
      references_json: [],
      created_at: new Date().toISOString(),
      ...msgData
    };
    store.messages.push(newMsg);

    const chatIdx = store.chats.findIndex(c => c.id === msgData.chat_id);
    if (chatIdx !== -1) {
      store.chats[chatIdx].updated_at = new Date().toISOString();
    }
    saveData(store);
    return newMsg;
  },

  deleteChat: async (chatId, userId) => {
    if (supabase) {
      await supabase.from('chats').delete().eq('id', chatId).eq('user_id', userId);
    }
    const store = loadData();
    store.chats = store.chats.filter(c => !(c.id === chatId && c.user_id === userId));
    store.messages = store.messages.filter(m => m.chat_id !== chatId);
    saveData(store);
    return true;
  },

  // REPORTS
  createReport: async (reportData) => {
    if (supabase) {
      const { data } = await supabase.from('ai_reports').insert([reportData]).select().single();
      if (data) return data;
    }
    const store = loadData();
    const newReport = {
      id: uuidv4(),
      insights_json: [],
      keywords: [],
      actions: [],
      flashcards_json: [],
      quiz_json: [],
      references_json: [],
      created_at: new Date().toISOString(),
      ...reportData
    };
    store.ai_reports.push(newReport);
    saveData(store);
    return newReport;
  },

  getUserReports: async (userId) => {
    if (supabase) {
      const { data } = await supabase.from('ai_reports').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (data) return data;
    }
    const store = loadData();
    return store.ai_reports.filter(r => r.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getReportById: async (id, userId) => {
    if (supabase) {
      const { data } = await supabase.from('ai_reports').select('*').eq('id', id).eq('user_id', userId).single();
      if (data) return data;
    }
    const store = loadData();
    return store.ai_reports.find(r => r.id === id && r.user_id === userId) || null;
  },

  deleteReport: async (id, userId) => {
    if (supabase) {
      await supabase.from('ai_reports').delete().eq('id', id).eq('user_id', userId);
    }
    const store = loadData();
    store.ai_reports = store.ai_reports.filter(r => !(r.id === id && r.user_id === userId));
    saveData(store);
    return true;
  },

  // HISTORY
  addHistory: async (historyData) => {
    if (supabase) {
      await supabase.from('history').insert([historyData]);
    }
    const store = loadData();
    const newEntry = {
      id: uuidv4(),
      metadata_json: {},
      created_at: new Date().toISOString(),
      ...historyData
    };
    store.history.push(newEntry);
    saveData(store);
    return newEntry;
  },

  getUserHistory: async (userId) => {
    if (supabase) {
      const { data } = await supabase.from('history').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (data) return data;
    }
    const store = loadData();
    return store.history.filter(h => h.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // FAVORITES
  toggleFavorite: async (userId, itemType, itemId) => {
    if (supabase) {
      const { data: existing } = await supabase.from('favorites').select('*').eq('user_id', userId).eq('item_type', itemType).eq('item_id', itemId).single();
      if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
        return { isFavorite: false };
      } else {
        await supabase.from('favorites').insert([{ user_id: userId, item_type: itemType, item_id: itemId }]);
        return { isFavorite: true };
      }
    }
    const store = loadData();
    const idx = store.favorites.findIndex(f => f.user_id === userId && f.item_type === itemType && f.item_id === itemId);
    if (idx !== -1) {
      store.favorites.splice(idx, 1);
      saveData(store);
      return { isFavorite: false };
    } else {
      store.favorites.push({ id: uuidv4(), user_id: userId, item_type: itemType, item_id: itemId, created_at: new Date().toISOString() });
      saveData(store);
      return { isFavorite: true };
    }
  },

  getUserFavorites: async (userId) => {
    if (supabase) {
      const { data } = await supabase.from('favorites').select('*').eq('user_id', userId);
      if (data) return data;
    }
    const store = loadData();
    return store.favorites.filter(f => f.user_id === userId);
  }
};
