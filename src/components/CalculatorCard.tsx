import React from 'react';
import { Star, ArrowRight, CreditCard, TrendingUp, Activity, Percent, Calendar, Binary, Zap, Brush } from 'lucide-react';
import { CalculatorConfig } from '../types';

interface CalculatorCardProps {
  key?: string;
  config: CalculatorConfig;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => Promise<void> | void;
  onSelect: (id: string) => void;
}

// Icon mapper for dynamic component execution
const iconMap: Record<string, any> = {
  CreditCard,
  TrendingUp,
  Activity,
  Percent,
  Calendar,
  Binary,
  Zap,
  Brush,
};

export default function CalculatorCard({ config, isFavorite, onToggleFavorite, onSelect }: CalculatorCardProps) {
  const IconComponent = iconMap[config.icon] || CreditCard;

  return (
    <div 
      onClick={() => onSelect(config.id)}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 cursor-pointer transition-all duration-300 overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-500/5 dark:group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none" />

      <div>
        {/* Top bar with icon and star */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors duration-300">
            <IconComponent className="h-5 w-5" />
          </div>
          
          <button
            onClick={(e) => onToggleFavorite(config.id, e)}
            className="p-2 rounded-xl text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-2">
          {config.category}
        </span>
        <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {config.name}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mt-2 line-clamp-2">
          {config.description}
        </p>
      </div>

      {/* Footer trigger */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/40">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Start Calculating <ArrowRight className="h-3 w-3" />
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          99.9% Acc.
        </span>
      </div>

    </div>
  );
}
