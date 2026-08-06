import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Paperclip, Sparkles, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { sendMessageApi, getMessagesApi } from '../services/chatService';
import { getFilesApi } from '../services/fileService';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

const ChatBox = ({ activeChatId, chatTitle }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userFiles, setUserFiles] = useState([]);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    }
  }, [activeChatId]);

  const fetchFiles = async () => {
    try {
      const res = await getFilesApi();
      if (res.success) {
        setUserFiles(res.files || []);
      }
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  };

  const fetchMessages = async (chatId) => {
    setLoading(true);
    try {
      const res = await getMessagesApi(chatId);
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (err) {
      showToast('Failed to load chat history.', 'error');
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || sending) return;

    if (!activeChatId) {
      showToast('Please select or create a chat session first.', 'warning');
      return;
    }

    const currentQuery = input.trim();
    setInput('');
    setSending(true);

    // Optimistic user message append
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      sender: 'user',
      content: currentQuery,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    scrollToBottom();

    try {
      const res = await sendMessageApi({
        chat_id: activeChatId,
        content: currentQuery,
        file_ids: selectedFileIds
      });

      if (res.success && res.aiMessage) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          res.userMessage,
          res.aiMessage
        ]);
        scrollToBottom();
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Error getting response from Gemini.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-2xl glass-panel border border-slate-800/80 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">{chatTitle || 'Multimodal Workspace Chat'}</h3>
            <p className="text-xs text-slate-400">
              {selectedFileIds.length ? `${selectedFileIds.length} file(s) attached` : 'Searching across all vault files'}
            </p>
          </div>
        </div>
      </div>

      {/* File Attachment Selector Bar */}
      {userFiles.length > 0 && (
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
            <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
            Attach Files:
          </span>
          {userFiles.map((file) => {
            const isSelected = selectedFileIds.includes(file.id);
            return (
              <button
                key={file.id}
                type="button"
                onClick={() => toggleFileSelection(file.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span className="max-w-[120px] truncate">{file.original_name}</span>
                {isSelected && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-full text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2">Ask Anything About Your Files</h4>
            <p className="text-sm text-slate-400 max-w-md mb-6">
              Gemini Multimodal analyzes text, visual diagrams in images, video keyframes, and audio speech transcripts together.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-left max-w-lg w-full">
              {[
                'Summarize the core takeaways across attached files',
                'What are the key action items in my uploaded PDF?',
                'Extract text & visual insights from images',
                'Generate flashcards based on this content'
              ].map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInput(prompt);
                  }}
                  className="p-3 rounded-xl glass-card text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center text-white shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl rounded-2xl p-4 space-y-2 ${
                msg.sender === 'user'
                  ? 'gradient-bg-primary text-white shadow-md shadow-indigo-500/20'
                  : 'glass-card border border-slate-800 text-slate-200'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>

                {/* References / Citations */}
                {msg.references_json && Array.isArray(msg.references_json) && msg.references_json.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-slate-700/40 space-y-1">
                    <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block">
                      Sources & Citations:
                    </span>
                    {msg.references_json.map((ref, rIdx) => (
                      <div key={rIdx} className="text-xs bg-slate-900/60 p-2 rounded border border-slate-800 text-slate-400">
                        <span className="font-semibold text-slate-300">{ref.source}:</span> {ref.snippet}
                      </div>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'} text-right`}>
                  {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-1 border border-indigo-500/30 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))
        )}

        {sending && (
          <div className="flex gap-4 items-center text-slate-400 text-sm">
            <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Gemini is generating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900/80 border-t border-slate-800 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your files..."
          className="flex-1 px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="px-5 py-3 rounded-xl font-semibold text-white gradient-bg-primary hover:opacity-90 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
