import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { Sparkles, Cpu, Layers, Search, ShieldCheck, Zap, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen space-y-20 pb-20">
      <Hero />

      {/* Feature Section Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Architecture Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Powered by Gemini Multimodal Intelligence
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Seamlessly combine text, visual diagrams, audio speech, and video clips into a single contextual AI analysis engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Cpu,
              title: 'Unified Multimodal Processing',
              desc: 'Upload PDFs, high-res images, audio MP3s, and MP4 videos simultaneously. Gemini standardizes all formats into one prompt context.'
            },
            {
              icon: Layers,
              title: 'Interactive Study Flashcards & Quizzes',
              desc: 'Automatically generate 3D study flashcards and interactive multiple-choice quizzes with instant grading and mastery tracking.'
            },
            {
              icon: Search,
              title: 'Cross-File Semantic Search',
              desc: 'Query across all your uploaded vault files simultaneously. Receive direct citations, page quotes, and timestamped highlights.'
            },
            {
              icon: FileText,
              title: 'Exportable PDF AI Reports',
              desc: 'Convert extracted insights, summaries, and quizzes into beautifully formatted, downloadable PDF reports with one click.'
            },
            {
              icon: ShieldCheck,
              title: 'Supabase Data Isolation',
              desc: 'Row-Level Security (RLS) policies guarantee your media files and generated AI insights remain completely private and isolated.'
            },
            {
              icon: Zap,
              title: 'Real-time Category Workspaces',
              desc: 'Organize files across Education, Healthcare, Legal, Research, Business, and Personal domain buckets with ease.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl gradient-bg-primary flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-10 rounded-3xl gradient-bg-primary text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Win the AI Hackathon?</h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
            Join OmniFusion AI today and experience zero-friction multimodal file intelligence.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold bg-white text-indigo-900 hover:bg-slate-100 shadow-xl transition-all"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
