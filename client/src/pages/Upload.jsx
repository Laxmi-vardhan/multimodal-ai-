import React, { useState } from 'react';
import UploadZone from '../components/UploadZone';
import AIResponse from '../components/AIResponse';
import { Sparkles, FileText } from 'lucide-react';

const Upload = () => {
  const [recentUploads, setRecentUploads] = useState([]);

  const handleUploadSuccess = (uploadedFiles) => {
    setRecentUploads(uploadedFiles);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Upload Multimodal Assets</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload PDF, Images, Audio, Video, or Text for instant Gemini 2.5 indexing & AI processing.
        </p>
      </div>

      <UploadZone onUploadSuccess={handleUploadSuccess} />

      {/* Auto Insights View if files were processed */}
      {recentUploads.length > 0 && recentUploads[0].insights_json?.summary && (
        <div className="pt-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Auto-Generated AI Analysis
          </h2>
          <AIResponse report={recentUploads[0].insights_json} />
        </div>
      )}
    </div>
  );
};

export default Upload;
