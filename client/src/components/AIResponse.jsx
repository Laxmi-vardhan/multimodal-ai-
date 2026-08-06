import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Layers,
  CheckSquare,
  Bookmark,
  Award,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';
import FlashcardDeck from './FlashcardDeck';
import QuizView from './QuizView';
import { useToast } from '../context/ToastContext';

const AIResponse = ({ report }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const { showToast } = useToast();

  if (!report) return null;

  const tabs = [
    { id: 'summary', label: 'Summary & Insights', icon: FileText },
    { id: 'actions', label: 'Action Items & Keywords', icon: CheckSquare },
    { id: 'flashcards', label: 'Study Flashcards', icon: Layers },
    { id: 'quiz', label: 'Interactive Quiz', icon: Award }
  ];

  const pdfDownloadUrl = `/api/report/${report.id}/pdf`;

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Gemini Multimodal Synthesis
            </span>
            <span className="text-xs text-slate-400">
              {new Date(report.created_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100">{report.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={pdfDownloadUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white gradient-bg-primary hover:opacity-90 shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </a>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                activeTab === t.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 rounded-2xl glass-panel min-h-[300px]">
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Executive Summary
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {report.summary}
              </p>
            </div>

            {report.insights_json && Array.isArray(report.insights_json) && report.insights_json.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-purple-400" /> Key Insights & Takeaways
                </h3>
                <div className="space-y-2">
                  {report.insights_json.map((insight, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl glass-card flex items-start gap-3 text-sm text-slate-200">
                      <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" /> Recommended Action Items
              </h3>
              {report.actions && Array.isArray(report.actions) && report.actions.length > 0 ? (
                <div className="space-y-2">
                  {report.actions.map((act, i) => (
                    <div key={i} className="p-3.5 rounded-xl glass-card border border-slate-800 flex items-center gap-3 text-sm text-slate-200">
                      <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No specific action items generated.</p>
              )}
            </div>

            {report.keywords && Array.isArray(report.keywords) && report.keywords.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-3">Extracted Domain Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {report.keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'flashcards' && <FlashcardDeck flashcards={report.flashcards_json} />}

        {activeTab === 'quiz' && <QuizView quiz={report.quiz_json} />}
      </div>
    </div>
  );
};

export default AIResponse;
