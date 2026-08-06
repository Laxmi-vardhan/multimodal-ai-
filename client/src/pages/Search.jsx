import React, { useState } from 'react';
import { searchApi } from '../services/searchService';
import { FileCard } from '../components/Cards';
import Viewer from '../components/Viewer';
import AIResponse from '../components/AIResponse';
import { useToast } from '../context/ToastContext';
import { Search as SearchIcon, FileText, Sparkles, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Education', 'Healthcare', 'Legal', 'Research', 'Business', 'Personal'];

const Search = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFileForViewer, setSelectedFileForViewer] = useState(null);

  const { showToast } = useToast();

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) {
      showToast('Please enter a search query.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await searchApi({ query, category });
      if (res.success) {
        setResults(res.results);
      }
    } catch (err) {
      showToast('Search failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Cross-File Semantic Search</h1>
        <p className="text-sm text-slate-400 mt-1">
          Instant search across all your media files, extracted OCR text, and AI report summaries.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts, keywords, file titles, or extracted insights..."
              className="w-full pl-12 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-bold text-white gradient-bg-primary hover:opacity-90 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <SearchIcon className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 overflow-x-auto">
          <Filter className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-400 shrink-0">Filter Domain:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </form>

      {/* Search Results Display */}
      {results && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">
              Found {results.filesCount} File(s) and {results.reportsCount} AI Report(s)
            </h3>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Query: "{results.query || query}"
            </span>
          </div>

          {/* Files Matches */}
          {results.files && results.files.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Matching Files
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {results.files.map((file) => (
                  <FileCard key={file.id} file={file} onView={(f) => setSelectedFileForViewer(f)} onDelete={() => {}} />
                ))}
              </div>
            </div>
          )}

          {/* Reports Matches */}
          {results.reports && results.reports.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Matching AI Syntheses
              </h4>
              <div className="space-y-6">
                {results.reports.map((report) => (
                  <AIResponse key={report.id} report={report} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Viewer Modal */}
      {selectedFileForViewer && (
        <Viewer file={selectedFileForViewer} onClose={() => setSelectedFileForViewer(null)} />
      )}
    </div>
  );
};

export default Search;
