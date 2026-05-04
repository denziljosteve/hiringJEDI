import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import axios from 'axios';
import { Globe } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await axios.post('http://localhost:3001/analyze', formData);
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden p-4 md:p-8 flex flex-col items-center font-sans text-slate-200">
      <header className="mb-4 flex items-center space-x-4 relative shrink-0">
        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
        <div className="relative p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <img src="/logo.png" alt="hiringJEDI Logo" className="w-12 h-12 object-contain rounded-lg" />
        </div>
        <h1 className="relative text-4xl font-bold tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 drop-shadow-sm pb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
          hiringJEDI
        </h1>
      </header>

      <main className="w-full max-w-7xl flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 pb-4">
        <section className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col min-h-0 transition-all hover:bg-white/[0.07]">
          <div className="flex items-center gap-3 mb-4 shrink-0">
            <div className="w-2 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            <h2 className="text-xl font-bold text-white tracking-wide">Input Information</h2>
          </div>
          <InputForm onSubmit={handleAnalyze} loading={loading} />
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm backdrop-blur-md flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)] shrink-0">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></div>
              <p className="truncate">{error}</p>
            </div>
          )}
        </section>

        <section className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col min-h-0 transition-all hover:bg-white/[0.07]">
          <div className="flex items-center gap-3 mb-4 shrink-0">
            <div className="w-2 h-8 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.8)]"></div>
            <h2 className="text-xl font-bold text-white tracking-wide">Analysis & Optimization</h2>
          </div>
          <ResultsDisplay results={results} loading={loading} />
        </section>
      </main>

      <footer className="w-full max-w-7xl shrink-0 mt-2 py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-400 z-10 relative">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="text-slate-300">Developer:</span>
          <span className="font-semibold text-cyan-400">Denzil Josteve Fernandes</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://denziljosteve.github.io/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors duration-200">
            <Globe className="w-4 h-4" />
            <span>Website</span>
          </a>
          <a href="https://www.linkedin.com/in/denziljosteve/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/denziljosteve" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
