import React, { useState, useEffect } from 'react';
import { 
  Star, History, Trash, Eye, User, Sparkles, Check, 
  ChevronRight, Calendar, Calculator, ShieldCheck, Mail, LogIn, Award 
} from 'lucide-react';
import { CalculatorConfig, SavedCalculation } from '../types';

interface UserAccountProps {
  favorites: string[];
  calculators: CalculatorConfig[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectCalculator: (id: string, preloadedInputs?: Record<string, any>) => void;
}

export default function UserAccount({ 
  favorites, calculators, onToggleFavorite, onSelectCalculator 
}: UserAccountProps) {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [history, setHistory] = useState<SavedCalculation[]>([]);
  const [selectedSavedCalc, setSelectedSavedCalc] = useState<SavedCalculation | null>(null);

  // Forms state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);

  // Load history from API
  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/history')
        .then((res) => res.json())
        .then((data) => setHistory(data))
        .catch((err) => console.error('Error fetching history:', err));
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUser(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setSubmittingUser(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setSubmittingUser(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setSubmittingUser(false);
    }, 1200);
  };

  const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        if (selectedSavedCalc?.id === id) {
          setSelectedSavedCalc(null);
        }
      }
    } catch (err) {
      console.error('Error deleting history:', err);
    }
  };

  const favoriteCalcs = calculators.filter((c) => favorites.includes(c.id));

  // Markdown parser
  const parseMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950 dark:text-white">$1</strong>');
      if (line.trim().startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc text-slate-600 dark:text-slate-300 mt-1" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />;
      }
      if (/^\d+\.\s/.test(line.trim())) {
        const parts = line.split(/^\d+\.\s/);
        return <li key={idx} className="ml-4 list-decimal text-slate-600 dark:text-slate-300 mt-1" dangerouslySetInnerHTML={{ __html: parts[1] }} />;
      }
      if (line.trim().startsWith('###')) {
        return <h4 key={idx} className="text-sm font-bold font-display text-blue-600 dark:text-blue-400 mt-3 mb-1" dangerouslySetInnerHTML={{ __html: content.replace(/###/g, '') }} />;
      }
      if (!content.trim()) return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-slate-600 dark:text-slate-300 mb-1" dangerouslySetInnerHTML={{ __html: content }} />;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {!isLoggedIn ? (
        // SaaS Authentic Sign-In Card
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          
          <div className="text-center mb-8">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <LogIn className="h-5 w-5" />
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">
              {isRegistering ? 'Create Your Account' : 'Welcome to YourCalculation'}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {isRegistering ? 'Save calculations, track metrics, and query AI.' : 'Sign in to access your saved calculation dashboard.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submittingUser}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {submittingUser && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isRegistering ? 'Register Account' : 'Sign In with Email'}
            </button>
          </form>

          {/* Federated Provider Divider */}
          <div className="relative my-6 text-center">
            <hr className="border-slate-100 dark:border-slate-800" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2.5 bg-white dark:bg-slate-900 text-[10px] uppercase font-bold text-slate-400">
              Or Connect
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={submittingUser}
            className="w-full h-11 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {/* Google Logo Vector representation */}
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.3-2.11 3.22v2.67h3.42c2-.1 4.745-3.8 4.745-7.74z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.42-2.67c-.95.64-2.17 1.02-4.51 1.02-3.48 0-6.42-2.35-7.47-5.5H1.05v2.76C3.07 20.3 7.16 24 12 24z" />
              <path fill="#FBBC05" d="M4.53 13.94c-.27-.8-.42-1.66-.42-2.55s.15-1.75.42-2.55V6.08H1.05C.38 7.43 0 9.17 0 11s.38 3.57 1.05 4.92l3.48-2.98z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.16 0 3.07 3.7 1.05 7.64l3.48 2.98c1.05-3.15 3.99-5.5 7.47-5.5z" />
            </svg>
            Continue with Google
          </button>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up Free"}
            </button>
          </div>

        </div>
      ) : (
        // Authenticated Dashboard
        <div className="space-y-8">
          
          {/* User Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500 text-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-md">
                <User className="h-6 w-6" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
                  {email ? email.split('@')[0] : 'Developer Pro'}
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 flex items-center gap-0.5">
                    <Award className="h-2.5 w-2.5" /> Premium
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Member since July 2026 • Verified Account
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* History Details Modal/Panel if selected */}
          {selectedSavedCalc && (
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-xl relative animate-in fade-in duration-200">
              <button
                onClick={() => setSelectedSavedCalc(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                Close
              </button>
              
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-2 uppercase tracking-wide">
                <Calendar className="h-4 w-4" /> Saved {selectedSavedCalc.date}
              </div>
              
              <h3 className="font-display font-bold text-lg mb-4 text-white">
                {selectedSavedCalc.calculatorName} Result History
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Submitted Inputs
                  </h4>
                  <div className="space-y-1 bg-white/5 rounded-xl p-3 border border-white/5 font-mono text-xs">
                    {Object.entries(selectedSavedCalc.inputs).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400">{k}</span>
                        <span className="font-semibold text-slate-200">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Calculated Outputs
                  </h4>
                  <div className="space-y-1 bg-white/5 rounded-xl p-3 border border-white/5 font-mono text-xs">
                    {Object.entries(selectedSavedCalc.outputs)
                      .filter(([_, val]) => typeof val === 'number')
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-slate-400">{k}</span>
                          <span className="font-semibold text-blue-400">{Number(v).toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {selectedSavedCalc.explanation && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> AI Explanation Record
                  </h4>
                  <div className="text-xs text-slate-300 leading-relaxed max-h-[160px] overflow-y-auto">
                    {parseMarkdown(selectedSavedCalc.explanation)}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => onSelectCalculator(selectedSavedCalc.calculatorId, selectedSavedCalc.inputs)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  Load Inputs into Calculator <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Navigation Slabs */}
          <div>
            <div className="flex border-b border-slate-100 dark:border-slate-800 gap-4 mb-6">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${activeTab === 'favorites' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <Star className="h-4 w-4" /> Bookmarked Favorites ({favoriteCalcs.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${activeTab === 'history' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <History className="h-4 w-4" /> Calculation History ({history.length})
              </button>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'favorites' && (
              <div>
                {favoriteCalcs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteCalcs.map((calc) => (
                      <div
                        key={calc.id}
                        onClick={() => onSelectCalculator(calc.id)}
                        className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Calculator className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                              {calc.name}
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              {calc.category}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => onToggleFavorite(calc.id, e)}
                          className="p-2 text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg shrink-0"
                        >
                          <Star className="h-4.5 w-4.5 fill-amber-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                    <Star className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">
                      You haven't bookmarked any calculators yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {history.length > 0 ? (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedSavedCalc(item)}
                      className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl">
                          <History className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 leading-snug">
                            {item.calculatorName}
                          </h4>
                          <p className="text-[10px] text-slate-400 leading-none mt-1">
                            Calculated {item.date} {item.explanation ? '• AI Explained' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSavedCalc(item);
                          }}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg"
                          title="View Saved Calculation"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteHistory(item.id, e)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg"
                          title="Delete Record"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                    <History className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">
                      No calculations saved yet. Hit "Save Calculation" in any active calculator to persist logs.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
