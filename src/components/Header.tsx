import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, Search, Sun, Moon, Mic, MicOff, Star, Sparkles, 
  BookOpen, User, Settings, X, Clock, Play, Menu, ChevronDown, 
  Compass, Heart, Percent, FlaskConical, Cpu, Wrench, Activity, 
  Award, Briefcase, DollarSign, ArrowRight 
} from 'lucide-react';
import { CalculatorConfig } from '../types';
import { navigate } from '../lib/router';
import { CATEGORIES } from '../data/calculators';

interface HeaderProps {
  currentPath: string;
  calculators: CalculatorConfig[];
  favoritesCount: number;
}

const categoryIconMap: Record<string, any> = {
  'Finance': DollarSign,
  'Health': Heart,
  'Math': Percent,
  'Construction': Wrench,
  'Engineering': Cpu,
  'Education': Award,
  'Business': Briefcase,
  'Investment': TrendingUp,
  'Fitness': Activity,
  'Daily Life': Compass,
  'Science': FlaskConical,
};

// Add helper to support TrendingUp if not in scope or custom fallback
import { TrendingUp } from 'lucide-react';

export default function Header({ currentPath, calculators, favoritesCount }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
    return document.body.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });
  
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('recent_searches') || '[]');
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setMobileSearchVisible(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoriesDropdown(false);
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
        setMobileSearchVisible(true);
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
    const updated = [calcName, ...recentSearches.filter((s) => s !== calcName)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    navigate(`/${calcId}`);
    setIsSearchFocused(false);
    setMobileSearchVisible(false);
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
    if (view === 'home') navigate('/');
    else if (view === 'ai-assistant') navigate('/ai-assistant');
    else if (view === 'blog') navigate('/blog');
    else if (view === 'account') navigate('/favorites');
    else if (view === 'admin') navigate('/admin');
    else if (view === 'categories') navigate('/categories');
  };

  const handleCategorySelect = (slug: string) => {
    setShowCategoriesDropdown(false);
    setMobileMenuOpen(false);
    navigate(`/categories/${slug}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left Block: Mobile Hamburger & Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 md:hidden transition-all"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <div 
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
            >
              <div className="relative h-9 w-9 flex items-center justify-center bg-blue-50 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm shadow-blue-500/10 group-hover:shadow-blue-500/20 group-hover:bg-blue-100 dark:group-hover:bg-slate-700 transition-all duration-300">
                <img 
                  src="/logo.svg" 
                  alt="YourCalculation Logo" 
                  className="h-7 w-7 object-contain group-hover:scale-105 transition-transform duration-300"
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
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent hidden sm:block">
                YourCalculation<span className="text-blue-500 font-sans">.com</span>
              </span>
            </div>
          </div>

          {/* Center Block: Desktop Search Bar */}
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
              <div className="absolute top-12 left-0 right-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 max-h-[420px] overflow-y-auto z-50 animate-in fade-in duration-200">
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
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
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
                                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
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

          {/* Right Block: Navigation & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Mobile Search Trigger */}
            <button
              onClick={() => setMobileSearchVisible(true)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl md:hidden transition-colors"
              aria-label="Search calculators"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath === '/' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Calculators
              </button>

              {/* Categories Dropdown Trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath.startsWith('/categories') ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Categories <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Categories Mega Dropdown */}
                {showCategoriesDropdown && (
                  <div className="absolute right-0 top-12 w-[340px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 grid grid-cols-2 gap-1 animate-in fade-in duration-200">
                    {CATEGORIES.map((cat) => {
                      const CatIcon = categoryIconMap[cat.name] || DollarSign;
                      return (
                        <div
                          key={cat.slug}
                          onClick={() => handleCategorySelect(cat.slug)}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        >
                          <div className="p-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                            <CatIcon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {cat.name}
                          </span>
                        </div>
                      );
                    })}
                    <div 
                      onClick={() => handleNavClick('categories')}
                      className="col-span-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between px-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-bold text-slate-500"
                    >
                      <span>Explore all 11 Categories</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleNavClick('ai-assistant')}
                className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath === '/ai-assistant' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                <span>AI Assistant</span>
              </button>

              <button
                onClick={() => handleNavClick('blog')}
                className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath.startsWith('/blog') ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </button>

              <button
                onClick={() => handleNavClick('account')}
                className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-xl transition-all ${currentPath === '/favorites' || currentPath === '/recent' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <User className="h-4 w-4" />
                {favoritesCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 bg-rose-500 text-white text-[9px] rounded-full leading-none font-bold">
                    {favoritesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className={`text-sm font-medium p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${currentPath === '/admin' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40' : ''}`}
                title="Admin Dashboard"
              >
                <Settings className="h-4 w-4" />
              </button>
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Full-Screen Mobile Search Overlay */}
      {mobileSearchVisible && (
        <div ref={mobileSearchRef} className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 p-4 md:hidden flex flex-col animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3 h-14 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400">
                <X className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={toggleVoiceSearch}
              className={`p-1.5 rounded-lg text-slate-400 ${isListening ? 'text-red-500 bg-red-500/10' : ''}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileSearchVisible(false)}
              className="p-2 text-slate-500 text-xs font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-4">
            {searchQuery.trim() ? (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Results ({filteredCalculators.length})
                </h3>
                {filteredCalculators.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCalculators.map((calc) => (
                      <div
                        key={calc.id}
                        onClick={() => handleSelectCalculator(calc.id, calc.name)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer"
                      >
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                          <Calculator className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{calc.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{calc.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center py-12">
                    No calculators matching "{searchQuery}"
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Recent Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            const match = calculators.find((c) => c.name === s);
                            if (match) handleSelectCalculator(match.id, match.name);
                            else setSearchQuery(s);
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    🔥 Popular Tools
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {trendingCalculators.map((calc) => (
                      <div
                        key={calc.id}
                        onClick={() => handleSelectCalculator(calc.id, calc.name)}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        <span>{calc.name}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Side Slide-Out Hamburger Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[120] md:hidden flex animate-in fade-in duration-300">
          
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" 
          />
          
          {/* Drawer Body */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-950 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 dark:border-slate-800">
              <span className="font-display font-bold text-base text-slate-900 dark:text-white">
                Navigation Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
              
              {/* Core Links */}
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${currentPath === '/' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <Calculator className="h-4 w-4" />
                  Calculators Panel
                </button>
                <button
                  onClick={() => handleNavClick('ai-assistant')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${currentPath === '/ai-assistant' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                  AI Smart Playground
                </button>
                <button
                  onClick={() => handleNavClick('blog')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${currentPath.startsWith('/blog') ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <BookOpen className="h-4 w-4" />
                  Guides & Blog Articles
                </button>
                <button
                  onClick={() => handleNavClick('account')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${currentPath === '/favorites' || currentPath === '/recent' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <User className="h-4 w-4" />
                  My Account Hub {favoritesCount > 0 && `(${favoritesCount})`}
                </button>
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${currentPath === '/admin' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                >
                  <Settings className="h-4 w-4" />
                  Admin Dashboard
                </button>
              </div>

              {/* Categories Block */}
              <div>
                <h4 className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Browse by Category
                </h4>
                <div className="grid grid-cols-1 gap-0.5">
                  {CATEGORIES.map((cat) => {
                    const CatIcon = categoryIconMap[cat.name] || DollarSign;
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategorySelect(cat.slug)}
                        className="w-full text-left px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 flex items-center gap-2.5 transition-colors"
                      >
                        <CatIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400">
                &copy; 2026 YourCalculation.com
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
