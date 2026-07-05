import React from 'react';
import { 
  Star, ArrowRight, CreditCard, Home, TrendingUp, Percent, 
  Activity, Heart, FlaskConical, Cpu, Wrench, Award, Briefcase, Compass, Calculator 
} from 'lucide-react';
import { CalculatorConfig } from '../types';

interface CalculatorCardProps {
  key?: string;
  config: CalculatorConfig;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => Promise<void> | void;
  onSelect: (id: string) => void;
}

const iconMap: Record<string, any> = {
  CreditCard,
  Home,
  TrendingUp,
  Percent,
  Activity,
  Heart,
  FlaskConical,
  Cpu,
  Wrench,
  Award,
  Briefcase,
  Compass,
};

export default function CalculatorCard({ config, isFavorite, onToggleFavorite, onSelect }: CalculatorCardProps) {
  const IconComponent = iconMap[config.icon] || Calculator;

  return (
    <div 
      onClick={() => onSelect(config.id)}
      className="group relative flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 cursor-pointer transition-all duration-300 overflow-hidden"
    >
      {/* Decorative subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-500/5 dark:group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none" />

      {/* Main card body content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top block: Icon and Star Favorite control */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 transition-colors duration-300 shrink-0">
            <IconComponent className="h-5 w-5" />
          </div>
          
          <button
            onClick={(e) => onToggleFavorite(config.id, e)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0"
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`h-4.5 w-4.5 ${isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/10">
            {config.category}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/10 font-mono">
            99.9% Acc.
          </span>
        </div>

        {/* Title and descriptions */}
        <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mt-1">
          {config.name}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mt-2 line-clamp-2 flex-1">
          {config.description}
        </p>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/40 shrink-0">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 flex items-center gap-1">
          Open Calculator <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
        <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase tracking-wider">
          Verified Online
        </span>
      </div>

    </div>
  );
}
