import React, { useState, useEffect } from 'react';
import { getHistoryApi } from '../services/searchService';
import Loader from '../components/Loader';
import { History as HistoryIcon, Clock, Sparkles, UploadCloud, MessageSquare, User, ShieldCheck } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistoryApi();
      if (res.success) {
        setHistory(res.history || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'FILE_UPLOAD':
        return <UploadCloud className="w-4 h-4 text-sky-400" />;
      case 'REPORT_GENERATE':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'CHAT_CREATE':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'USER_REGISTER':
      case 'USER_LOGIN':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  if (loading) return <Loader text="Loading History Timeline..." />;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Activity History & Audit Trail</h1>
        <p className="text-sm text-slate-400 mt-1">
          Chronological record of file uploads, AI report syntheses, and chat interactions.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="p-12 rounded-2xl glass-panel text-center text-slate-400">
          No activity logs recorded yet.
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
          {history.map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Bullet Dot */}
              <div className="absolute -left-[31px] top-1 w-8 h-8 rounded-xl glass-card border border-slate-700 flex items-center justify-center bg-slate-900 group-hover:border-indigo-500 transition-colors">
                {getIcon(item.action_type)}
              </div>

              <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {item.action_type}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-200">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
