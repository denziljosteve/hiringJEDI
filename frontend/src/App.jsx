import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import axios from 'axios';

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
    </div>
  );
}

export default App;
