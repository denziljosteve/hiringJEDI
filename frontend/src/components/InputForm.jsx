import { useState } from 'react';
import { Loader2, Sparkles, Upload } from 'lucide-react';
import axios from 'axios';

export default function InputForm({ onSubmit, loading }) {
  const [jd, setJd] = useState('');
  const [resume, setResume] = useState('');
  const [cover, setCover] = useState('');
  const [model, setModel] = useState('openai/gpt-oss-120b');
  const [uploading, setUploading] = useState({ jd: false, resume: false, cover: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jd.trim() || !resume.trim()) return;
    onSubmit({ jd, resume, cover, model });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/extract-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (type === 'jd') setJd(response.data.text);
      if (type === 'resume') setResume(response.data.text);
      if (type === 'cover') setCover(response.data.text);
    } catch (err) {
      console.error("Failed to parse file", err);
      alert("Failed to extract text from file.");
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
      e.target.value = null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-1 min-h-0">
      <div className="flex-1 space-y-4 flex flex-col min-h-0">
        <div className="flex flex-col group shrink-0">
          <label className="block text-xs font-semibold text-emerald-400/80 uppercase tracking-widest mb-2 group-focus-within:text-emerald-400 transition-colors">AI Model</label>
          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value)} 
            className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all shadow-inner"
          >
            <option value="openai/gpt-oss-120b">GPT-OSS 120B (Recommended)</option>
            <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
            <option value="meta-llama/llama-4-scout-17b-16e-instruct">Llama 4 Scout 17B</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col group min-h-0">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <label className="block text-xs font-semibold text-cyan-400/80 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">Job Description <span className="text-pink-500">*</span></label>
            <div className="relative overflow-hidden inline-block">
              <button type="button" className="text-[10px] flex items-center gap-1 font-semibold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 py-1 px-2 rounded-lg transition-colors cursor-pointer" disabled={uploading.jd}>
                {uploading.jd ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3" />}
                Upload File
              </button>
              <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => handleFileUpload(e, 'jd')} disabled={uploading.jd} className="absolute left-0 top-0 opacity-0 cursor-pointer w-full h-full" title="Upload Job Description (.pdf, .docx, .txt)" />
            </div>
          </div>
          <textarea
            required
            value={uploading.jd ? "Extracting text..." : jd}
            onChange={(e) => setJd(e.target.value)}
            disabled={uploading.jd}
            className="w-full flex-1 min-h-0 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-slate-200 placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all resize-none shadow-inner custom-scrollbar"
            placeholder="Paste the target job description or upload..."
          />
        </div>
        
        <div className="flex-1 flex flex-col group min-h-0">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <label className="block text-xs font-semibold text-indigo-400/80 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Resume <span className="text-pink-500">*</span></label>
            <div className="relative overflow-hidden inline-block">
              <button type="button" className="text-[10px] flex items-center gap-1 font-semibold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 py-1 px-2 rounded-lg transition-colors cursor-pointer" disabled={uploading.resume}>
                {uploading.resume ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3" />}
                Upload File
              </button>
              <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => handleFileUpload(e, 'resume')} disabled={uploading.resume} className="absolute left-0 top-0 opacity-0 cursor-pointer w-full h-full" title="Upload Resume (.pdf, .docx, .txt)" />
            </div>
          </div>
          <textarea
            required
            value={uploading.resume ? "Extracting text..." : resume}
            onChange={(e) => setResume(e.target.value)}
            disabled={uploading.resume}
            className="w-full flex-1 min-h-0 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-slate-200 placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all resize-none shadow-inner custom-scrollbar"
            placeholder="Paste your current resume or upload..."
          />
        </div>

        <div className="flex-1 flex flex-col group min-h-0">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <label className="block text-xs font-semibold text-purple-400/80 uppercase tracking-widest group-focus-within:text-purple-400 transition-colors">Cover Letter <span className="text-slate-500 text-[10px]">(Optional)</span></label>
            <div className="relative overflow-hidden inline-block">
              <button type="button" className="text-[10px] flex items-center gap-1 font-semibold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 py-1 px-2 rounded-lg transition-colors cursor-pointer" disabled={uploading.cover}>
                {uploading.cover ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3" />}
                Upload File
              </button>
              <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => handleFileUpload(e, 'cover')} disabled={uploading.cover} className="absolute left-0 top-0 opacity-0 cursor-pointer w-full h-full" title="Upload Cover Letter (.pdf, .docx, .txt)" />
            </div>
          </div>
          <textarea
            value={uploading.cover ? "Extracting text..." : cover}
            onChange={(e) => setCover(e.target.value)}
            disabled={uploading.cover}
            className="w-full flex-1 min-h-0 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-slate-200 placeholder-slate-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all resize-none shadow-inner custom-scrollbar"
            placeholder="Paste your cover letter or upload..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !jd.trim() || !resume.trim() || uploading.jd || uploading.resume || uploading.cover}
        className="w-full py-4 px-6 mt-4 shrink-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex justify-center items-center gap-3 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        <div className="relative flex items-center gap-2">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Quantum Data...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Initialize Optimization</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
}
