import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Loader = ({ text = 'Analyzing Multimodal AI Content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        className="relative w-16 h-16 flex items-center justify-center rounded-2xl gradient-bg-primary p-0.5 shadow-lg shadow-indigo-500/25 mb-4"
      >
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
      </motion.div>
      <h4 className="text-lg font-semibold text-slate-200 mb-1">{text}</h4>
      <p className="text-sm text-slate-400">Gemini 2.5 Multimodal SDK processing</p>
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="p-6 rounded-2xl glass-card animate-pulse space-y-4">
    <div className="h-6 bg-slate-800 rounded w-1/3"></div>
    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
  </div>
);

export default Loader;
