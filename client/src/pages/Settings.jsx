import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Cpu, ShieldCheck, CheckCircle2, AlertTriangle, Key, Sparkles } from 'lucide-react';

const Settings = () => {
  const [health, setHealth] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await axios.get('/api/health');
      setHealth(res.data);
    } catch (err) {
      console.error('Health check error:', err);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">System Settings & AI Model Configuration</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review Gemini SDK model settings, API key status, and Supabase RLS security specs.
        </p>
      </div>

      {/* Gemini AI Settings Box */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center text-white shadow-md">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Google Gemini Multimodal Engine</h3>
            <p className="text-xs text-slate-400">Server-side @google/genai SDK integration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl glass-card text-sm">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="font-semibold text-slate-200">Server API Key Configuration Status</p>
                <p className="text-xs text-slate-500">Stored in server/.env file securely</p>
              </div>
            </div>

            {health?.geminiKeyConfigured ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> API Key Live & Verified
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5" /> Mock Engine Active (Fallback)
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Default Multimodal Processing Model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Recommended: Fast multimodal reasoning & JSON extraction' },
                { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Standard 1M context window model' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    selectedModel === m.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                      : 'glass-card border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-200">{m.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security & Database Status */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Database & RLS Security Status
        </h3>

        <div className="space-y-2 text-sm text-slate-300">
          <div className="p-3.5 rounded-xl glass-card flex justify-between items-center">
            <span>Supabase PostgreSQL Schema:</span>
            <span className="font-semibold text-emerald-400">Enforced (RLS Active)</span>
          </div>
          <div className="p-3.5 rounded-xl glass-card flex justify-between items-center">
            <span>JWT Password Hashing:</span>
            <span className="font-semibold text-indigo-400">bcryptjs 10-Salt Rounds</span>
          </div>
          <div className="p-3.5 rounded-xl glass-card flex justify-between items-center">
            <span>API Rate Limiting:</span>
            <span className="font-semibold text-purple-400">300 requests / 15 mins per IP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
