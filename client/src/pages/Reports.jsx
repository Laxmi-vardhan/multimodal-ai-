import React, { useState, useEffect } from 'react';
import { getReportsApi, deleteReportApi } from '../services/reportService';
import AIResponse from '../components/AIResponse';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { Sparkles, Trash2, FileText } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getReportsApi();
      if (res.success) {
        setReports(res.reports || []);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const res = await deleteReportApi(reportId);
      if (res.success) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        showToast('Report deleted.', 'info');
      }
    } catch (err) {
      showToast('Error deleting report.', 'error');
    }
  };

  if (loading) return <Loader text="Loading AI Reports..." />;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">AI Synthesis Reports</h1>
          <p className="text-sm text-slate-400 mt-1">
            Executive summaries, flashcards, interactive quizzes, & downloadable PDF reports.
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="p-12 rounded-2xl glass-panel text-center space-y-3">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-slate-200">No Reports Generated Yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Upload files with auto-analysis enabled or run multimodal prompts in chat to generate reports.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {reports.map((report) => (
            <div key={report.id} className="relative group">
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={() => handleDeleteReport(report.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <AIResponse report={report} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
