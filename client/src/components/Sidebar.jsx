import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  MessageSquare,
  Search,
  FileText,
  History,
  User,
  Settings as SettingsIcon,
  Sparkles
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Upload Files', icon: UploadCloud },
  { path: '/chat', label: 'Multimodal Chat', icon: MessageSquare },
  { path: '/search', label: 'Cross-File Search', icon: Search },
  { path: '/reports', label: 'AI Reports', icon: FileText },
  { path: '/history', label: 'History & Activity', icon: History },
  { path: '/profile', label: 'Profile Stats', icon: User },
  { path: '/settings', label: 'Settings', icon: SettingsIcon }
];

const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 hidden lg:block glass-panel border-r border-slate-800/80 min-h-[calc(100vh-65px)] p-4">
      <div className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'gradient-bg-primary text-white shadow-lg shadow-indigo-500/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-2xl glass-card border border-indigo-500/20 bg-indigo-950/20">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Multimodal 2.5</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          OmniFusion unifies PDF, Audio, Video, Images, & Plain Text into single AI context window.
        </p>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-3/4 rounded-full"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
