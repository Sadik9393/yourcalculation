import React, { useState, useEffect } from 'react';
import { CALCULATORS, CATEGORIES } from './data/calculators';
import { BLOG_POSTS } from './data/blog';
import { CalculatorConfig } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculatorCard from './components/CalculatorCard';
import CalculatorView from './components/CalculatorView';
import AIChatView from './components/AIChatView';
import BlogView from './components/BlogView';
import UserAccount from './components/UserAccount';
import AdminPanel from './components/AdminPanel';
import CategoryView from './components/CategoryView';
import { 
  AboutView, ContactView, PrivacyView, TermsView, DisclaimerView, NotFoundView 
} from './components/StaticPages';
import { navigate } from './lib/router';
import { 
  DollarSign, Heart, Percent, Clock, Scale, Code, 
  Wrench, Cpu, Star, Award, Search, Sparkles, ShieldCheck,
  TrendingUp, Briefcase, Activity, Compass, FlaskConical
} from 'lucide-react';

// Maps category names to Lucide icons
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

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [preloadedInputs, setPreloadedInputs] = useState<Record<string, any> | null>(null);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPath]);

  // 1. Initialize favorites on startup
  useEffect(() => {
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error('Error fetching initial favorites:', err));
  }, []);

  // 2. Synchronize currentPath state and query parameters with browser navigation changes (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      
      // Load preloaded inputs from query parameters if present
      const params = new URLSearchParams(window.location.search);
      const inputsStr = params.get('inputs');
      if (inputsStr) {
        try {
          setPreloadedInputs(JSON.parse(decodeURIComponent(inputsStr)));
        } catch (e) {
          console.error('Failed to parse inputs from query parameters:', e);
        }
      } else {
        setPreloadedInputs(null);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Dynamic SEO and Title Management
  useEffect(() => {
    let title = 'YourCalculation.com - Calculate Anything Smarter with AI';
    let description = 'Free online calculators with instant results and AI-powered explanations. Calculate loan EMI, compound interest, BMI, Ohm\'s law, and more.';

    if (currentPath === '/about') {
      title = 'About Us - YourCalculation.com';
      description = 'Discover our mission, accuracy verifications, and how we integrate secure server-side Gemini AI into dynamic calculations.';
    } else if (currentPath === '/contact') {
      title = 'Contact Support - YourCalculation.com';
      description = 'Get in touch with our team for general feedback, custom calculation queries, or site help.';
    } else if (currentPath === '/privacy-policy') {
      title = 'Privacy Policy - YourCalculation.com';
      description = 'Learn how YourCalculation.com processes and secures your calculation history with strict privacy safeguards.';
    } else if (currentPath === '/terms-and-conditions') {
      title = 'Terms & Conditions - YourCalculation.com';
      description = 'Review the standard terms of service, limits of liability, and instructional guidelines for YourCalculation.com.';
    } else if (currentPath === '/disclaimer') {
      title = 'Legal Disclaimer - YourCalculation.com';
      description = 'Vetted disclaimer clarifying that calculation results are for instructional use and do not substitute certified advice.';
    } else if (currentPath === '/ai-assistant') {
      title = 'AI Calculation Assistant - YourCalculation.com';
      description = 'Chat with our advanced NLP AI companion to simulate scenarios, solve complex mathematical puzzles, or get tips.';
    } else if (currentPath === '/blog') {
      title = 'Calculators & Math Masterclass Blog - YourCalculation.com';
      description = 'Browse our financial and scientific guides to master interest compounding, amortization schedules, and fitness variables.';
    } else if (currentPath.startsWith('/blog/')) {
      const postId = currentPath.split('/blog/')[1];
      const post = BLOG_POSTS.find(p => p.id === postId);
      if (post) {
        title = `${post.title} - YourCalculation.com`;
        description = post.excerpt;
      }
    } else if (currentPath === '/favorites') {
      title = 'My Bookmarked Favorites - YourCalculation.com';
      description = 'Access your personalized dashboard of saved and favorited calculators.';
    } else if (currentPath === '/recent') {
      title = 'Calculation History - YourCalculation.com';
      description = 'Track, search, and reload your previous calculations with secure storage logs.';
    } else if (currentPath === '/admin') {
      title = 'Admin Panel - YourCalculation.com';
      description = 'System dashboard for deploying configurations, checking server stats, and triggering pipelines.';
    } else if (currentPath === '/categories') {
      title = 'Calculator Categories - YourCalculation.com';
      description = 'Explore our massive directory of calculators covering Finance, Health, Programming, Construction, and more.';
    } else if (currentPath.startsWith('/categories/')) {
      const slug = currentPath.split('/categories/')[1];
      const category = CATEGORIES.find(c => c.slug === slug);
      if (category) {
        title = `${category.name} Calculators - YourCalculation.com`;
        description = category.description;
      }
    } else {
      const calcId = currentPath.slice(1);
      const calc = CALCULATORS.find(c => c.id === calcId);
      if (calc) {
        title = `${calc.name} - Free AI Calculator - YourCalculation.com`;
        description = `${calc.description} Get step-by-step calculations, dynamic charts, and AI-powered advice instantly.`;
      } else if (currentPath !== '/') {
        title = 'Page Not Found - YourCalculation.com';
        description = 'The requested calculator page or URL could not be located.';
      }
    }

    document.title = title;
    
    // Update or create meta description dynamically for search engines
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [currentPath]);

  // 4. Toggle Favorite Handler
  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Determine active calculator matching ID route e.g. "/loan-calculator"
  const calcRouteId = currentPath.slice(1);
  const matchedCalculator = CALCULATORS.find((c) => c.id === calcRouteId);

  // Filter calculations based on Hero query search
  const filteredCalculators = CALCULATORS.filter((calc) => {
    return homeSearchQuery.trim()
      ? calc.name.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
        calc.category.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
        calc.description.toLowerCase().includes(homeSearchQuery.toLowerCase())
      : true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Header element */}
      <Header 
        currentPath={currentPath} 
        calculators={CALCULATORS}
        favoritesCount={favorites.length}
      />

      <main className="flex-grow">
        
        {/* ROUTE 1: HOMEPAGE */}
        {currentPath === '/' && (
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
                
                <p className="text-sm sm:text-base text-slate-400 dark:text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
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
                    onClick={() => navigate('/ai-assistant')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
                    Ask AI Assistant
                  </button>
                  <button 
                    onClick={() => navigate('/categories')} 
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-sm transition-all"
                  >
                    Browse Categories
                  </button>
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
                <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  Browse by Category
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Select a category block to explore dedicated, matching dynamic calculation lists.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {CATEGORIES.slice(0, 8).map((cat) => {
                  const Icon = categoryIconMap[cat.name] || DollarSign;
                  
                  return (
                    <div
                      key={cat.slug}
                      onClick={() => navigate(`/categories/${cat.slug}`)}
                      className="p-4 rounded-2xl border text-center cursor-pointer transition-all bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/20 hover:-translate-y-0.5"
                    >
                      <Icon className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                      <span className="text-xs font-bold font-display block truncate">{cat.name}</span>
                    </div>
                  );
                })}
                {/* Explore all block */}
                <div
                  onClick={() => navigate('/categories')}
                  className="p-4 rounded-2xl border text-center cursor-pointer transition-all bg-blue-50 border-blue-100 dark:bg-slate-900 dark:border-slate-800 text-blue-600 dark:text-blue-400 hover:border-blue-500/35 hover:-translate-y-0.5"
                >
                  <Award className="h-5 w-5 mx-auto mb-2" />
                  <span className="text-xs font-bold font-display block truncate">View All Slabs</span>
                </div>
              </div>
            </section>

            {/* Popular Calculators Card Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="mb-8">
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  Popular Calculation Tools
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Beautiful card-layouts configured with responsive sliders and visual breakdown charts.
                </p>
              </div>

              {filteredCalculators.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCalculators.map((calc) => (
                    <CalculatorCard
                      key={calc.id}
                      config={calc}
                      isFavorite={favorites.includes(calc.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={(id) => navigate(`/${id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                  <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200">No calculators found</h3>
                  <p className="text-xs text-slate-400 mt-1">We couldn't find matching models.</p>
                </div>
              )}
            </section>

          </div>
        )}

        {/* ROUTE 2: ABOUT PAGE */}
        {currentPath === '/about' && <AboutView />}

        {/* ROUTE 3: CONTACT PAGE */}
        {currentPath === '/contact' && <ContactView />}

        {/* ROUTE 4: PRIVACY POLICY */}
        {currentPath === '/privacy-policy' && <PrivacyView />}

        {/* ROUTE 5: TERMS & CONDITIONS */}
        {currentPath === '/terms-and-conditions' && <TermsView />}

        {/* ROUTE 6: DISCLAIMER */}
        {currentPath === '/disclaimer' && <DisclaimerView />}

        {/* ROUTE 7: AI PLAYGROUND CHAT */}
        {currentPath === '/ai-assistant' && <AIChatView />}

        {/* ROUTE 8: BLOG PATHS */}
        {currentPath.startsWith('/blog') && (
          <BlogView calculators={CALCULATORS} />
        )}

        {/* ROUTE 9: FAVORITES & RECENT HISTORY */}
        {(currentPath === '/favorites' || currentPath === '/recent') && (
          <UserAccount
            favorites={favorites}
            calculators={CALCULATORS}
            onToggleFavorite={handleToggleFavorite}
            onSelectCalculator={(id, customInputs) => {
              const q = customInputs ? `?inputs=${encodeURIComponent(JSON.stringify(customInputs))}` : '';
              navigate(`/${id}${q}`);
            }}
          />
        )}

        {/* ROUTE 10: ADMIN DASHBOARD */}
        {currentPath === '/admin' && <AdminPanel calculators={CALCULATORS} />}

        {/* ROUTE 11: CATEGORIES & CATEGORY DETAIL */}
        {currentPath.startsWith('/categories') && (
          <CategoryView 
            currentPath={currentPath}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* ROUTE 12: DYNAMIC CALCULATOR DETAIL PAGE */}
        {matchedCalculator && (
          <CalculatorView
            config={{
              ...matchedCalculator,
              fields: matchedCalculator.fields.map((f) => ({
                ...f,
                defaultValue: preloadedInputs && preloadedInputs[f.name] !== undefined ? preloadedInputs[f.name] : f.defaultValue,
              })),
            }}
            isFavorite={favorites.includes(matchedCalculator.id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => navigate('/')}
            allCalculators={CALCULATORS}
            onSelectCalculator={(id) => navigate(`/${id}`)}
          />
        )}

        {/* ROUTE 13: 404 NOT FOUND fallback */}
        {currentPath !== '/' &&
         currentPath !== '/about' &&
         currentPath !== '/contact' &&
         currentPath !== '/privacy-policy' &&
         currentPath !== '/terms-and-conditions' &&
         currentPath !== '/disclaimer' &&
         currentPath !== '/ai-assistant' &&
         !currentPath.startsWith('/blog') &&
         currentPath !== '/favorites' &&
         currentPath !== '/recent' &&
         currentPath !== '/admin' &&
         !currentPath.startsWith('/categories') &&
         !matchedCalculator && (
          <NotFoundView />
        )}

      </main>

      {/* Footer element */}
      <Footer 
        currentPath={currentPath} 
        selectedCalculatorName={matchedCalculator?.name}
      />

    </div>
  );
}
