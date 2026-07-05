import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Search, Sun, Moon, Mic, MicOff, Star, Sparkles, BookOpen, User, Settings, X, Clock, Play } from 'lucide-react';
import { CalculatorConfig } from '../types';
import { navigate } from '../lib/router';

interface HeaderProps {
  currentPath: string;
  calculators: CalculatorConfig[];
  favoritesCount: number;
}

export default function Header({ currentPath, calculators, favoritesCount }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.body.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('recent_searches') || '[]');
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle outside click for search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Voice Search setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsSearchFocused(true);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please try Chrome or Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSelectCalculator = (calcId: string, calcName: string) => {
    // Add to recent searches
    const updated = [calcName, ...recentSearches.filter((s) => s !== calcName)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    navigate(`/${calcId}`);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const trendingCalculators = calculators.slice(0, 3);

  const filteredCalculators = searchQuery.trim()
    ? calculators.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleNavClick = (view: string) => {
    if (view === 'home') navigate('/');
    else if (view === 'ai-assistant') navigate('/ai-assistant');
    else if (view === 'blog') navigate('/blog');
    else if (view === 'account') navigate('/favorites');
    else if (view === 'admin') navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="relative h-10 w-10 flex items-center justify-center bg-blue-50 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm shadow-blue-500/10 group-hover:shadow-blue-500/20 group-hover:bg-blue-100 dark:group-hover:bg-slate-700 transition-all duration-300">
            <img 
              src="/logo.svg" 
              alt="YourCalculation Logo" 
              className="h-8 w-8 object-contain group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.logo-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'logo-fallback text-blue-600 dark:text-blue-400 font-bold text-lg';
                  fallback.innerText = 'Y';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            YourCalculation<span className="text-blue-500 font-sans">.com</span>
          </span>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className={`relative flex items-center h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-3 border transition-all duration-200 ${isSearchFocused ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-transparent'}`}>
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-transparent px-2 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button 
              onClick={toggleVoiceSearch} 
              className={`p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : ''}`}
              title="Voice Search"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-12 left-0 right-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 max-h-[420px] overflow-y-auto animate-in fade-in duration-200">
              {searchQuery.trim() ? (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-display">
                    Search Results ({filteredCalculators.length})
                  </h3>
                  {filteredCalculators.length > 0 ? (
                    <div className="space-y-1">
                      {filteredCalculators.map((calc) => (
                        <div
                          key={calc.id}
                          onClick={() => handleSelectCalculator(calc.id, calc.name)}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Calculator className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{calc.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-1">{calc.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">
                      No calculators found matching "{searchQuery}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSearches.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-display">
                        <Clock className="h-3.5 w-3.5" /> Recent Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((s) => {
                          const matchingCalc = calculators.find((c) => c.name === s);
                          return (
                            <button
                              key={s}
                              onClick={() => matchingCalc ? handleSelectCalculator(matchingCalc.id, matchingCalc.name) : setSearchQuery(s)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-display">
                      🔥 Trending Calculators
                    </h3>
                    <div className="space-y-1">
                      {trendingCalculators.map((calc) => (
                        <div
                          key={calc.id}
                          onClick={() => handleSelectCalculator(calc.id, calc.name)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <span className="font-medium">{calc.name}</span>
                          <Play className="h-3 w-3 text-blue-500 fill-blue-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath === '/' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Calculators
          </button>
          
          <button
            onClick={() => handleNavClick('ai-assistant')}
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath === '/ai-assistant' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          <button
            onClick={() => handleNavClick('blog')}
            className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath.startsWith('/blog') ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden lg:inline">Blog</span>
          </button>

          <button
            onClick={() => handleNavClick('account')}
            className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath === '/favorites' || currentPath === '/recent' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <User className="h-4 w-4" />
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full leading-none font-bold">
                {favoritesCount}
              </span>
            )}
            <span className="hidden lg:inline">Account</span>
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className={`text-sm font-medium p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${currentPath === '/admin' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : ''}`}
            title="Admin Dashboard"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>

      </div>
    </header>
  );
}
