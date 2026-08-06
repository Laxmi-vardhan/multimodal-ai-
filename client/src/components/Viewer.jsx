import React from 'react';
import { X, Download, FileText, ExternalLink, Image as ImageIcon, Music, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const Viewer = ({ file, onClose }) => {
  if (!file) return null;

  const viewUrl = `/api/upload/${file.id}/view`;

  const renderMedia = () => {
    if (file.mime_type.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center p-4 min-h-[300px]">
          <img src={viewUrl} alt={file.original_name} className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-xl" />
        </div>
      );
    }

    if (file.mime_type.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center p-4">
          <video controls autoPlay className="max-h-[70vh] w-full rounded-xl shadow-2xl">
            <source src={viewUrl} type={file.mime_type} />
            Your browser does not support video playback.
          </video>
        </div>
      );
    }

    if (file.mime_type.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Music className="w-10 h-10 animate-bounce" />
          </div>
          <p className="font-semibold text-slate-200">{file.original_name}</p>
          <audio controls className="w-full max-w-md">
            <source src={viewUrl} type={file.mime_type} />
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }

    if (file.mime_type === 'application/pdf') {
      return (
        <div className="w-full h-[75vh]">
          <iframe src={viewUrl} title={file.original_name} className="w-full h-full rounded-xl border border-slate-800" />
        </div>
      );
    }

    return (
      <div className="p-8 text-center space-y-4">
        <FileText className="w-16 h-16 text-indigo-400 mx-auto" />
        <h4 className="text-lg font-bold text-slate-200">{file.original_name}</h4>
        <p className="text-sm text-slate-400">Preview not directly inline. Download or view via external browser tab.</p>
        <a
          href={viewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg-primary shadow-md"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open File in New Tab</span>
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-semibold text-xs">
              {file.category || 'Personal'}
            </span>
            <h3 className="text-base font-bold text-slate-100 truncate max-w-md">{file.original_name}</h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={viewUrl}
              download={file.original_name}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Download File"
            >
              <Download className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 overflow-y-auto max-h-[80vh] bg-slate-950/50">{renderMedia()}</div>
      </motion.div>
    </div>
  );
};

export default Viewer;
