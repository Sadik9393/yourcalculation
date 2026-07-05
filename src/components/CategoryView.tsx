import React, { useState } from 'react';
import { CATEGORIES, CALCULATORS } from '../data/calculators';
import { 
  DollarSign, Heart, Percent, Clock, Scale, Code, 
  Wrench, Cpu, Award, Briefcase, TrendingUp, Activity, 
  Compass, FlaskConical, ArrowRight, Star, Search, CornerDownLeft
} from 'lucide-react';
import { navigate } from '../lib/router';
import CalculatorCard from './CalculatorCard';

const categoryIconMap: Record<string, any> = {
  'Finance': DollarSign,
  'Health': Heart,
  'Math': Percent,
  'Date & Time': Clock,
  'Converters': Scale,
  'Programming': Code,
  'Construction': Wrench,
  'Engineering': Cpu,
  'Education': Award,
  'Business': Briefcase,
  'Investment': TrendingUp,
  'Tax': Percent,
  'Fitness': Activity,
  'Daily Life': Compass,
  'Science': FlaskConical,
};

interface CategoryViewProps {
  currentPath: string;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => Promise<void> | void;
}

export default function CategoryView({ currentPath, favorites, onToggleFavorite }: CategoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Render all categories (Category Index)
  if (currentPath === '/categories') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-300">
        <div className="mb-10 text-center">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Calculator Categories
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Browse our comprehensive suite of 500+ dynamic calculators organized by scientific, financial, and daily life categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = categoryIconMap[cat.name] || DollarSign;
            const count = CALCULATORS.filter(c => c.category === cat.name).length;

            return (
              <div
                key={cat.slug}
                onClick={() => navigate(`/categories/${cat.slug}`)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                      {count} calculators
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
                  Browse {cat.name} <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Render specific category listings
  const slug = currentPath.split('/categories/')[1];
  const activeCategory = CATEGORIES.find(c => c.slug === slug);

  if (!activeCategory) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Category Not Found</h2>
        <button onClick={() => navigate('/categories')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          View All Categories
        </button>
      </div>
    );
  }

  const categoryCalculators = CALCULATORS.filter(c => c.category === activeCategory.name);
  const filteredCalculators = categoryCalculators.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Icon = categoryIconMap[activeCategory.name] || DollarSign;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-300">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/categories')}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 mb-6 transition-colors"
      >
        <CornerDownLeft className="h-4 w-4" /> Back to Categories
      </button>

      {/* Hero card */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-10 shadow-sm">
        <div className="absolute top-0 right-0 p-16 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-3xl shrink-0 h-14 w-14 flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {activeCategory.name} Calculators
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xl">
                {activeCategory.description}
              </p>
            </div>
          </div>

          {/* Quick search inside category */}
          <div className="relative w-full sm:max-w-xs">
            <div className="flex items-center h-10 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={`Search in ${activeCategory.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-2 text-xs text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCalculators.map((calc) => (
            <CalculatorCard
              key={calc.id}
              config={calc}
              isFavorite={favorites.includes(calc.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={(id) => navigate(`/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
          <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200">No calculators found</h3>
          <p className="text-xs text-slate-400 mt-1">Try resetting your category search parameters or explore other slabs.</p>
        </div>
      )}
    </div>
  );
}
