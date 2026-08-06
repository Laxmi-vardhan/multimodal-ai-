import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfileApi, getProfileStatsApi } from '../services/profileService';
import { User, Mail, Lock, Image as ImageIcon, Save, HardDrive, ShieldCheck, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getProfileStatsApi();
      if (res.success) setStats(res.stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {};
    if (name) payload.name = name;
    if (avatarUrl !== undefined) payload.avatar_url = avatarUrl;
    if (password) payload.password = password;

    try {
      const res = await updateProfileApi(payload);
      if (res.success && res.user) {
        updateUserState(res.user);
        setPassword('');
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Account Profile & Usage</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal details, credentials, and view vault storage statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <div className="p-6 rounded-2xl glass-panel text-center space-y-4 border border-slate-800 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full gradient-bg-primary p-1 shadow-xl">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-indigo-400">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-100">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="w-full pt-4 border-t border-slate-800 space-y-2 text-xs text-left">
            <div className="flex justify-between text-slate-400">
              <span>Member Since:</span>
              <span className="font-semibold text-slate-200">
                {new Date(user?.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Files Stored:</span>
              <span className="font-semibold text-indigo-400">{stats?.totalFiles || 0}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Storage Used:</span>
              <span className="font-semibold text-purple-400">{stats?.totalStorageMB || 0} MB</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 p-8 rounded-2xl glass-panel border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Edit Profile Settings
          </h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">New Password (Leave blank to keep unchanged)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white gradient-bg-primary hover:opacity-95 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
