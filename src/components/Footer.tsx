import React from 'react';
import { Calculator, Shield, Book, Star, DollarSign, Mail, Heart, ChevronRight } from 'lucide-react';

interface FooterProps {
  currentView: string;
  selectedCalculatorName?: string | null;
  setView: (view: string) => void;
  setSelectedCalculatorId: (id: string | null) => void;
}

export default function Footer({ currentView, selectedCalculatorName, setView, setSelectedCalculatorId }: FooterProps) {
  
  const handleNav = (view: string) => {
    setView(view);
    setSelectedCalculatorId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate SEO Breadcrumbs dynamically
  const renderBreadcrumbs = () => {
    const crumbs = [
      { label: 'Home', view: 'home' }
    ];

    if (currentView === 'calculator' && selectedCalculatorName) {
      crumbs.push({ label: 'Calculators', view: 'home' });
      crumbs.push({ label: selectedCalculatorName, view: 'calculator' });
    } else if (currentView === 'ai-assistant') {
      crumbs.push({ label: 'AI Calculation Playground', view: 'ai-assistant' });
    } else if (currentView === 'blog') {
      crumbs.push({ label: 'Articles & Guides', view: 'blog' });
    } else if (currentView === 'account') {
      crumbs.push({ label: 'My Account', view: 'account' });
    } else if (currentView === 'admin') {
      crumbs.push({ label: 'Admin Dashboard', view: 'admin' });
    }

    return (
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
              {isLast ? (
                <span className="text-slate-600 dark:text-slate-300 font-semibold truncate max-w-[200px]" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => handleNav(crumb.view)}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 mt-auto">
      
      {/* Monetization Block: AdSense Mock / Affiliate Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-sm">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 uppercase tracking-wide">
              Sponsor Ad
            </span>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              Need Professional Financial Solutions?
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Connect with certified mortgage consultants. Enjoy 0% down rates on customized premium plans.
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0">
            Learn More
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Dynamic SEO Breadcrumbs Block */}
        {renderBreadcrumbs()}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
                <Calculator className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
                YourCalculation<span className="text-blue-500 font-sans">.com</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              We leverage cutting-edge calculation math and advanced Gemini AI model insights to make complex formulas simple, transparent, and educational.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
              <span>Made for millions of smart users</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 font-display">
              Popular Slabs
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-blue-600 transition-colors">
                  Mortgage Amortization Slabs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-blue-600 transition-colors">
                  Systematic Investment Planning
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-blue-600 transition-colors">
                  BMI Weight Benchmarks
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-blue-600 transition-colors">
                  Ohm's Physical Circuitry Math
                </button>
              </li>
            </ul>
          </div>

          {/* SEO & Education */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 font-display">
              Resources
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-blue-600 transition-colors">
                  Masterclass Articles & Guides
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ai-assistant')} className="hover:text-blue-600 transition-colors">
                  NLP AI Scenario Simulator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account')} className="hover:text-blue-600 transition-colors">
                  User Calculation Repositories
                </button>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600">Google AdSense Ready</span>
              </li>
            </ul>
          </div>

          {/* Legal / Trust info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 font-display">
              Trust & Quality
            </h3>
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
              <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  99.9% Accuracy Verified
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight">
                  All equations conform strictly to international ISO definitions.
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Disclaimer: Calculations are for instructional and educational purposes only. Always consult standard professionals before locking real investments or medical modifications.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; 2026 YourCalculation.com. All calculations structured with absolute compliance.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <button className="hover:text-blue-600 transition-colors">Terms of Service</button>
            <button className="hover:text-blue-600 transition-colors">Cookie Controls</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
