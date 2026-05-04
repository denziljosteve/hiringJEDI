import { useState, useRef, useEffect } from 'react';
import { Copy, Download, CheckCircle2, Loader2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';

export default function ResultsDisplay({ results, loading }) {
  const [activeTab, setActiveTab] = useState('match');
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);
  const tabContainerRef = useRef(null);

  useEffect(() => {
    if (tabContainerRef.current) {
      const activeElement = tabContainerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-cyan-400 space-y-6 relative">
        <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] rounded-full"></div>
        <div className="relative bg-white/5 p-6 rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        </div>
        <div className="text-center relative">
          <p className="animate-pulse font-medium text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">Synthesizing Results...</p>
          <p className="text-sm text-cyan-500/50 mt-2">Running algorithmic match protocols</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 border border-white/5 bg-white/5 backdrop-blur-sm rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <p className="relative z-10 flex items-center gap-2 text-sm tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Wait for input sequence...
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'match', label: 'Match Score' },
    { id: 'tailored_resume', label: 'Tailored Resume' },
    { id: 'tailored_cover_letter', label: 'Cover Letter' },
    { id: 'jd_skill_breakdown', label: 'JD Breakdown' },
    { id: 'core_recruiter_priorities', label: 'Recruiter Priorities' },
    { id: 'skills_section', label: 'Skills (Before/After)' },
    { id: 'change_log', label: 'Change Log' },
  ];

  const handleCopy = () => {
    const textToCopy = results[activeTab];
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    const element = contentRef.current;
    if (!element) return;
    const opt = {
      margin: 0.5,
      filename: `optimized_${activeTab}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const renderContent = () => {
    if (activeTab === 'match') {
      return (
        <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2" ref={contentRef}>
          <div className="p-8 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] backdrop-blur-xl flex flex-col items-start justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-indigo-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative z-10 w-full mb-4">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-1">Match Compatibility</h3>
              <p className="text-xs text-slate-400">AI-Assessed Quotient</p>
            </div>
            {(() => {
              const scoreStr = String(results.match_score || '');
              let score = 'N/A';
              let reasoning = scoreStr;
              const match = scoreStr.match(/(\d+%)/);
              
              if (match) {
                score = match[1];
                reasoning = scoreStr.replace(score, '').trim();
                if (reasoning.startsWith('-') || reasoning.startsWith(':')) {
                  reasoning = reasoning.slice(1).trim();
                }
              } else if (scoreStr.length < 10) {
                score = scoreStr;
                reasoning = '';
              }
              
              return (
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    {score}
                  </div>
                  {reasoning && (
                    <div className="text-slate-300 leading-relaxed text-[15px] bg-black/20 p-5 rounded-xl border border-white/5 shadow-inner whitespace-pre-wrap">
                      {reasoning}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl shadow-inner backdrop-blur-xl relative">
            <div className="absolute -left-px top-10 bottom-10 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
            <h3 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              Strategic Verdict
            </h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-[15px]">
              {typeof results.recruiter_verdict === 'string' 
                ? results.recruiter_verdict 
                : (results.recruiter_verdict ? JSON.stringify(results.recruiter_verdict, null, 2) : '')}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-black/20 border border-white/10 rounded-3xl p-8 flex-1 overflow-y-auto custom-scrollbar relative group shadow-inner backdrop-blur-xl">
        <div className="prose prose-invert prose-cyan max-w-none text-slate-200 font-sans leading-relaxed text-[15px] whitespace-pre-wrap" ref={contentRef}>
          <ReactMarkdown>
            {typeof results[activeTab] === 'string' 
              ? results[activeTab].replace(/^```[a-z]*\n/gi, '').replace(/```$/g, '').replace(/^[ \t]+/gm, '')
              : (results[activeTab] ? JSON.stringify(results[activeTab], null, 2) : '')}
          </ReactMarkdown>
        </div>
        
        <div className="absolute top-6 right-6 flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleCopy}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-slate-300 hover:text-white hover:bg-cyan-500/50 hover:border-cyan-400/50 transition-all shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            title="Copy to Clipboard"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownloadPdf}
            className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-slate-300 hover:text-white hover:bg-indigo-500/50 hover:border-indigo-400/50 transition-all shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            title="Download as PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full font-sans min-h-0">
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <button 
          onClick={() => {
            const idx = tabs.findIndex(t => t.id === activeTab);
            if (idx > 0) setActiveTab(tabs[idx - 1].id);
          }} 
          disabled={tabs.findIndex(t => t.id === activeTab) === 0}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-cyan-500/20 disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div ref={tabContainerRef} className="flex space-x-2 overflow-x-auto pb-4 custom-scrollbar flex-1 items-center scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 relative overflow-hidden whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/80 to-indigo-500/80 opacity-100"></div>
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => {
            const idx = tabs.findIndex(t => t.id === activeTab);
            if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
          }} 
          disabled={tabs.findIndex(t => t.id === activeTab) === tabs.length - 1}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:indigo-500/20 disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {renderContent()}
      </div>
    </div>
  );
}
