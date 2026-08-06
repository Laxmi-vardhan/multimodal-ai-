import React, { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import { getChatsApi, createChatApi, deleteChatApi } from '../services/chatService';
import { useToast } from '../context/ToastContext';
import { MessageSquare, Plus, Trash2, Bot, Sparkles } from 'lucide-react';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await getChatsApi();
      if (res.success) {
        setChats(res.chats || []);
        if (res.chats.length > 0 && !activeChat) {
          setActiveChat(res.chats[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChat = async (e) => {
    e?.preventDefault();
    try {
      const res = await createChatApi({
        title: newTitle || 'Multimodal Workspace Chat',
        category: 'Personal'
      });
      if (res.success && res.chat) {
        setChats((prev) => [res.chat, ...prev]);
        setActiveChat(res.chat);
        setNewTitle('');
        showToast('Started new chat session!', 'success');
      }
    } catch (err) {
      showToast('Failed to create chat session.', 'error');
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      const res = await deleteChatApi(chatId);
      if (res.success) {
        const remaining = chats.filter((c) => c.id !== chatId);
        setChats(remaining);
        if (activeChat?.id === chatId) {
          setActiveChat(remaining[0] || null);
        }
        showToast('Chat deleted.', 'info');
      }
    } catch (err) {
      showToast('Error deleting chat.', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12">
      {/* Sidebar Chat Sessions */}
      <div className="lg:col-span-1 glass-panel rounded-2xl p-4 space-y-4 h-[calc(100vh-140px)] flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" /> AI Sessions
          </h2>
          <button
            onClick={handleCreateChat}
            className="p-2 rounded-xl gradient-bg-primary text-white hover:opacity-90 transition-all shadow-md"
            title="New Chat Session"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {chats.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-2">
              <Bot className="w-8 h-8 text-indigo-400 mx-auto opacity-60" />
              <p>No active sessions yet.</p>
              <button
                onClick={handleCreateChat}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/20"
              >
                Start First Chat
              </button>
            </div>
          ) : (
            chats.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveChat(c)}
                className={`p-3 rounded-xl cursor-pointer text-sm transition-all flex items-center justify-between group ${
                  activeChat?.id === c.id
                    ? 'gradient-bg-primary text-white font-semibold shadow-md'
                    : 'glass-card text-slate-300 hover:text-white'
                }`}
              >
                <div className="truncate">
                  <p className="truncate">{c.title}</p>
                  <p className={`text-[10px] ${activeChat?.id === c.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {new Date(c.updated_at || c.created_at).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeleteChat(c.id, e)}
                  className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="lg:col-span-3">
        <ChatBox activeChatId={activeChat?.id} chatTitle={activeChat?.title} />
      </div>
    </div>
  );
};

export default Chat;
