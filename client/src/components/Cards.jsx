import React from 'react';
import { FileText, Image as ImageIcon, Music, Video, Trash2, Eye, Download, Sparkles, Clock, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle }) => {
  const colorStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  return (
    <div className="p-6 rounded-2xl glass-card border flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <h3 className="text-2xl font-extrabold text-white">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export const FileCard = ({ file, onView, onDelete }) => {
  const getIcon = () => {
    const mime = file?.mime_type || '';
    if (mime.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-sky-400" />;
    if (mime.startsWith('audio/')) return <Music className="w-5 h-5 text-amber-400" />;
    if (mime.startsWith('video/')) return <Video className="w-5 h-5 text-emerald-400" />;
    if (mime === 'application/pdf') return <FileText className="w-5 h-5 text-rose-400" />;
    return <FileText className="w-5 h-5 text-indigo-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5 rounded-2xl glass-card space-y-4 flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">{getIcon()}</div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {file?.category || 'Personal'}
          </span>
        </div>

        <h4 className="font-semibold text-sm text-slate-100 truncate" title={file?.original_name || 'File'}>
          {file?.original_name || 'Untitled File'}
        </h4>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{((file?.file_size || 0) / (1024 * 1024)).toFixed(2)} MB</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {file?.created_at ? new Date(file.created_at).toLocaleDateString() : 'Recent'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onView(file)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 flex items-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>

        <button
          onClick={() => onDelete(file.id)}
          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          title="Delete File"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
