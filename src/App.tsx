import React, { useState, useEffect } from 'react';
import { CALCULATORS, CATEGORIES } from './data/calculators';
import { CalculatorConfig } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorCard from './components/CalculatorCard';
import CalculatorView from './components/CalculatorView';
import AIChatView from './components/AIChatView';
import BlogView from './components/BlogView';
import UserAccount from './components/UserAccount';
import AdminPanel from './components/AdminPanel';
import { 
  DollarSign, Heart, Percent, Clock, Scale, Code, 
  Wrench, Cpu, Star, Award, Search, Sparkles, ShieldCheck 
} from 'lucide-react';

// Maps category names to Lucide icons
const categoryIconMap: Record<string, any> = {
  'Finance': DollarSign,
  'Health': Heart,
  'Math': Percent,
  'Date & Time': Clock,
  'Converters': Scale,
  'Programming': Code,
  'Construction': Wrench,
  'Engineering': Cpu,
};

export default function App() {
  const [view, setView] = useState<string>('home'); // 'home' | 'calculator' | 'ai-assistant' | 'blog' | 'account' | 'admin'
  const [selectedCalculatorId, setSelectedCalculatorId] = useState<string | null>(null);
  const [preloadedInputs, setPreloadedInputs] = useState<Record<string, any> | null>(null);
  
  // Favorites State synced with API
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Quick Filter for Home Page Category Grid
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Search input on the Home Page hero
  const [homeSearchQuery, setHomeSearchQuery] = useState('');

  // 1. Load favorites and check for shareable URL query parameters on startup
  useEffect(() => {
    // Fetch favorites
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error('Error fetching initial favorites:', err));

    // Handle shareable preloaded inputs via query parameters
    const params = new URLSearchParams(window.location.search);
    const calcId = params.get('calc');
    const inputsStr = params.get('inputs');

    if (calcId) {
      const matching = CALCULATORS.find((c) => c.id === calcId);
      if (matching) {
        setSelectedCalculatorId(calcId);
        setView('calculator');
        if (inputsStr) {
          try {
            const parsed = JSON.parse(decodeURIComponent(inputsStr));
            setPreloadedInputs(parsed);
          } catch (e) {
            console.error('Failed to parse preloaded query inputs:', e);
          }
        }
      }
    }
  }, []);

  // 2. Toggle Favorite Handler
  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering calculator select click
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculatorId: id }),
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setFavorites(data);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleSelectCalculator = (id: string, customInputs?: Record<string, any>) => {
    setSelectedCalculatorId(id);
    setPreloadedInputs(customInputs || null);
    setView('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedCalculatorId(null);
    setPreloadedInputs(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCalculatorConfig = CALCULATORS.find((c) => c.id === selectedCalculatorId);

  // Filter calculations based on Home Grid category or Hero query search
  const filteredCalculators = CALCULATORS.filter((calc) => {
    const matchesCategory = selectedCategoryFilter ? calc.category === selectedCategoryFilter : true;
    const matchesSearch = homeSearchQuery.trim()
      ? calc.name.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
        calc.category.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
        calc.description.toLowerCase().includes(homeSearchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Header element */}
      <Header 
        currentView={view} 
        setView={setView} 
        setSelectedCalculatorId={setSelectedCalculatorId} 
        calculators={CALCULATORS}
        favoritesCount={favorites.length}
      />

      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE */}
        {view === 'home' && (
          <div className="animate-in fade-in duration-300">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-16 sm:py-24 transition-colors duration-200">
              <div className="absolute top-0 right-0 p-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none transform translate-x-20 -translate-y-20" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 mb-6">
                  <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                  Your Ultimate AI Math & Finance Companion
                </div>
                
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-none">
                  Calculate Anything <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">Smarter with AI</span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-400 dark:text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                  Free online calculators with instant results and AI-powered explanations. Get smart financial, fitness, and physical circuit tips instantly.
                </p>

                {/* Big Search Input */}
                <div className="max-w-2xl mx-auto mt-10 relative">
                  <div className="flex items-center h-14 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 shadow-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all duration-200">
                    <Search className="h-5 w-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search 500+ calculators (e.g. Loan, SIP, BMI, Ohm's, Paint)..."
                      value={homeSearchQuery}
                      onChange={(e) => setHomeSearchQuery(e.target.value)}
                      className="w-full bg-transparent px-3 text-sm text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 font-medium"
                    />
                    {homeSearchQuery && (
                      <button 
                        onClick={() => setHomeSearchQuery('')} 
                        className="p-1 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Fast Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                  <button 
                    onClick={() => setView('ai-assistant')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
                    Ask AI Assistant
                  </button>
                  <a 
                    href="#categories" 
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    Browse Categories
                  </a>
                </div>

              </div>
            </section>

            {/* Stats section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-200">
                <div className="text-center p-3">
                  <p className="font-display font-bold text-2xl sm:text-3xl text-blue-600 dark:text-blue-400">10,000+</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Calculations Daily</p>
                </div>
                <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800/60">
                  <p className="font-display font-bold text-2xl sm:text-3xl text-blue-600 dark:text-blue-400">500+</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Calculators Configured</p>
                </div>
                <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800/60">
                  <p className="font-display font-bold text-2xl sm:text-3xl text-blue-600 dark:text-blue-400">100+</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Formula Categories</p>
                </div>
                <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800/60">
                  <p className="font-display font-bold text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">99.9%</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Equation Accuracy</p>
                </div>
              </div>
            </section>

            {/* Category Grid Section */}
            <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
              <div className="mb-8">
                <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  Browse by Category
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Select a category block to filter matching dynamic calculation models instantly.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {/* Reset filter card */}
                <div
                  onClick={() => setSelectedCategoryFilter(null)}
                  className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${!selectedCategoryFilter ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/20 hover:-translate-y-0.5'}`}
                >
                  <Award className="h-5 w-5 mx-auto mb-2" />
                  <span className="text-xs font-bold font-display block truncate">All Slabs</span>
                </div>

                {CATEGORIES.map((cat) => {
                  const Icon = categoryIconMap[cat.name] || DollarSign;
                  const isSelected = selectedCategoryFilter === cat.name;
                  
                  return (
                    <div
                      key={cat.slug}
                      onClick={() => setSelectedCategoryFilter(cat.name)}
                      className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/20 hover:-translate-y-0.5'}`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-2" />
                      <span className="text-xs font-bold font-display block truncate">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Popular Calculators Card Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    {selectedCategoryFilter ? `${selectedCategoryFilter} Calculators` : 'Popular Calculation Tools'}
                  </h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Beautiful card-layouts configured with responsive slider-bars and visual breakdown charts.
                  </p>
                </div>
                {selectedCategoryFilter && (
                  <button 
                    onClick={() => setSelectedCategoryFilter(null)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {filteredCalculators.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCalculators.map((calc) => (
                    <CalculatorCard
                      key={calc.id}
                      config={calc}
                      isFavorite={favorites.includes(calc.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={(id) => handleSelectCalculator(id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                  <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200">No calculators found</h3>
                  <p className="text-xs text-slate-400 mt-1">We couldn't find matching models in the "{selectedCategoryFilter || 'General'}" view.</p>
                </div>
              )}
            </section>

          </div>
        )}

        {/* VIEW 2: CALCULATOR DETAIL PAGE */}
        {view === 'calculator' && activeCalculatorConfig && (
          <CalculatorView
            config={{
              ...activeCalculatorConfig,
              fields: activeCalculatorConfig.fields.map((f) => ({
                ...f,
                defaultValue: preloadedInputs && preloadedInputs[f.name] !== undefined ? preloadedInputs[f.name] : f.defaultValue,
              })),
            }}
            isFavorite={favorites.includes(activeCalculatorConfig.id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={handleBackToHome}
            allCalculators={CALCULATORS}
            onSelectCalculator={(id) => handleSelectCalculator(id)}
          />
        )}

        {/* VIEW 3: AI PLAYGROUND CHAT */}
        {view === 'ai-assistant' && <AIChatView />}

        {/* VIEW 4: SEO BLOG GUIDE */}
        {view === 'blog' && (
          <BlogView 
            onSelectCalculator={(id) => handleSelectCalculator(id)} 
            calculators={CALCULATORS}
          />
        )}

        {/* VIEW 5: USER ACCOUNT PROFILE */}
        {view === 'account' && (
          <UserAccount
            favorites={favorites}
            calculators={CALCULATORS}
            onToggleFavorite={handleToggleFavorite}
            onSelectCalculator={(id, customInputs) => handleSelectCalculator(id, customInputs)}
          />
        )}

        {/* VIEW 6: ADMIN CONTROL DASHBOARD */}
        {view === 'admin' && <AdminPanel calculators={CALCULATORS} />}

      </main>

      {/* Footer element */}
      <Footer 
        currentView={view} 
        selectedCalculatorName={activeCalculatorConfig?.name}
        setView={setView} 
        setSelectedCalculatorId={setSelectedCalculatorId}
      />

    </div>
  );
}
