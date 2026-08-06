import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, LogOut, User, Upload, Search, MessageSquare, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight gradient-text">OmniFusion</span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
            Multimodal AI
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link
              to="/upload"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Quick Upload</span>
            </Link>

            <Link
              to="/chat"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Chat</span>
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <Link to="/profile" className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <span className="hidden md:inline text-sm font-medium text-slate-200">{user?.name || 'User'}</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white rounded-xl gradient-bg-primary hover:opacity-90 shadow-md shadow-indigo-500/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
