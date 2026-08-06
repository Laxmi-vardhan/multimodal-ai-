import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard, FileCard } from '../components/Cards';
import { CategoryChart, FileTypeChart } from '../components/Charts';
import Viewer from '../components/Viewer';
import Loader from '../components/Loader';
import { getFilesApi, deleteFileApi } from '../services/fileService';
import { getProfileStatsApi } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FileText, MessageSquare, HardDrive, Sparkles, Plus, Search, Folder } from 'lucide-react';

const CATEGORIES = ['All', 'Education', 'Healthcare', 'Legal', 'Research', 'Business', 'Personal'];

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFileForViewer, setSelectedFileForViewer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedCategory]);

  const loadDashboardData = async () => {
    try {
      const [filesRes, statsRes] = await Promise.all([
        getFilesApi(selectedCategory),
        getProfileStatsApi()
      ]);

      if (filesRes.success) setFiles(filesRes.files || []);
      if (statsRes.success) setStats(statsRes.stats || null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const res = await deleteFileApi(fileId);
      if (res.success) {
        showToast('File deleted.', 'info');
        loadDashboardData();
      }
    } catch (err) {
      showToast('Failed to delete file.', 'error');
    }
  };

  if (loading) return <Loader text="Loading Workspace Dashboard..." />;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, <span className="gradient-text">{user?.name || 'Explorer'}</span> 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Multimodal Workspace Overview — Gemini 2.5 Active
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="px-4 py-2.5 rounded-xl font-bold text-white gradient-bg-primary hover:opacity-95 shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all text-sm"
          >
            <Plus className="w-4 h-4" /> Upload Multimodal File
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Uploaded Files"
          value={stats?.totalFiles || 0}
          icon={FileText}
          color="indigo"
          subtitle="PDF, Images, Audio, Video"
        />
        <StatCard
          title="Storage Consumption"
          value={`${stats?.totalStorageMB || '0.00'} MB`}
          icon={HardDrive}
          color="purple"
          subtitle="Vault capacity limit 500MB"
        />
        <StatCard
          title="Active Chat Sessions"
          value={stats?.totalChats || 0}
          icon={MessageSquare}
          color="sky"
          subtitle="Cross-file context chats"
        />
        <StatCard
          title="AI Synthesis Reports"
          value={stats?.totalReports || 0}
          icon={Sparkles}
          color="emerald"
          subtitle="Flashcards & Quizzes generated"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-200">Category Domain Breakdown</h3>
          <CategoryChart data={stats?.categoryBreakdown || {}} />
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-200">File Type Format Distribution</h3>
          <FileTypeChart data={stats?.fileTypeBreakdown || {}} />
        </div>
      </div>

      {/* Files Workspace Vault */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-400" /> Recent Workspace Files
          </h3>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {files.length === 0 ? (
          <div className="p-12 rounded-2xl glass-panel text-center space-y-4 border border-dashed border-slate-800">
            <Sparkles className="w-12 h-12 text-indigo-400 mx-auto opacity-80" />
            <h4 className="text-lg font-bold text-slate-200">No files found in "{selectedCategory}"</h4>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Upload PDF documents, high-res images, audio recordings, or videos to start extracting multimodal insights.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-bg-primary"
            >
              Upload First File
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onView={(f) => setSelectedFileForViewer(f)}
                onDelete={handleDeleteFile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Viewer Modal */}
      {selectedFileForViewer && (
        <Viewer file={selectedFileForViewer} onClose={() => setSelectedFileForViewer(null)} />
      )}
    </div>
  );
};

export default Dashboard;
