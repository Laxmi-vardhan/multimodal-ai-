import React, { useState, useRef } from 'react';
import { UploadCloud, File, Image as ImageIcon, Music, Video, FileText, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { uploadFilesApi } from '../services/fileService';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Education', 'Healthcare', 'Legal', 'Research', 'Business', 'Personal'];

const UploadZone = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('Personal');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-sky-400" />;
    if (file.type.startsWith('audio/')) return <Music className="w-5 h-5 text-amber-400" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-emerald-400" />;
    if (file.type === 'application/pdf') return <FileText className="w-5 h-5 text-rose-400" />;
    return <File className="w-5 h-5 text-indigo-400" />;
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) {
      showToast('Please select at least one file to upload.', 'warning');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));
    formData.append('category', category);
    formData.append('auto_analyze', autoAnalyze);

    try {
      const res = await uploadFilesApi(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      if (res.success) {
        showToast(`Successfully uploaded ${res.count} file(s)!`, 'success');
        setSelectedFiles([]);
        if (onUploadSuccess) onUploadSuccess(res.files);
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to upload files.', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Dropzone area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl p-8 sm:p-12 text-center border-2 border-dashed transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-700/80 hover:border-indigo-500/50 glass-panel'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
          accept="image/*,video/*,audio/*,application/pdf,text/*"
        />

        <div className="w-16 h-16 rounded-2xl gradient-bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
          <UploadCloud className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2">
          Drag & Drop Multimodal Files Here
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
          Supports PDFs, Text, PNG/JPEG Images, Audio (MP3/WAV), and Video (MP4/WEBM) up to 50MB.
        </p>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Click or Drop to Browse Local Storage
        </span>
      </div>

      {/* Upload Controls & Selected Files */}
      {selectedFiles.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold text-slate-200">
                Category Tag & Processing Options
              </h4>
              <p className="text-xs text-slate-400">Select business or academic domain tag for indexing</p>
            </div>

            {/* Category Selector */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    category === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="checkbox"
              id="autoAnalyze"
              checked={autoAnalyze}
              onChange={(e) => setAutoAnalyze(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
            />
            <label htmlFor="autoAnalyze" className="text-sm font-medium text-slate-300 cursor-pointer flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Auto-trigger Gemini Multimodal Extraction (Summary, Flashcards & Quiz)</span>
            </label>
          </div>

          {/* Selected File List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            <AnimatePresence>
              {selectedFiles.map((file, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-3 rounded-xl glass-card text-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {getFileIcon(file)}
                    <div className="truncate">
                      <p className="font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-indigo-300">
                <span>Uploading & Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleUploadSubmit}
            disabled={isUploading}
            className="w-full py-3.5 rounded-xl font-bold text-white gradient-bg-primary hover:opacity-95 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <span>Uploading to OmniFusion Vault...</span>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                <span>Upload & Index {selectedFiles.length} File(s)</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UploadZone;
