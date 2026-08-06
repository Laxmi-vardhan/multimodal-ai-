import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, FileText, Image as ImageIcon, Video, Music, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8 text-center">
      {/* Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Next-Gen Gemini 2.5 Multimodal AI Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]"
        >
          Upload Any File. <br />
          <span className="gradient-text">Chat & Extract Insights Across All Media.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          OmniFusion AI synthesizes Text, PDFs, High-Res Images, Audio recordings, and Video feeds into a single unified knowledge intelligence workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white gradient-bg-primary hover:opacity-95 shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Launch OmniFusion Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-300 glass-card hover:text-white flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore Dashboard</span>
          </Link>
        </motion.div>

        {/* Media Formats Ribbon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { icon: FileText, label: 'PDFs & Documents', color: 'text-rose-400', bg: 'bg-rose-500/10' },
            { icon: ImageIcon, label: 'Images & OCR', color: 'text-sky-400', bg: 'bg-sky-500/10' },
            { icon: Music, label: 'Audio & Transcripts', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Video, label: 'Video Keyframes', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl glass-card flex flex-col items-center gap-2 text-center">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-200">{item.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
