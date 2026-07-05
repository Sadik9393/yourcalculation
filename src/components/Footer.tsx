import React from 'react';
import { Calculator, Shield, ChevronRight, Heart } from 'lucide-react';
import { navigate } from '../lib/router';
import { CATEGORIES, CALCULATORS } from '../data/calculators';

interface FooterProps {
  currentPath: string;
  selectedCalculatorName?: string | null;
}

export default function Footer({ currentPath, selectedCalculatorName }: FooterProps) {
  
  const handleNav = (path: string) => {
    navigate(path);
  };

  // Generate SEO Breadcrumbs dynamically based on path
  const renderBreadcrumbs = () => {
    const crumbs = [
      { label: 'Home', path: '/' }
    ];

    if (currentPath === '/ai-assistant') {
      crumbs.push({ label: 'AI Calculation Playground', path: '/ai-assistant' });
    } else if (currentPath.startsWith('/blog')) {
      crumbs.push({ label: 'Articles & Guides', path: '/blog' });
    } else if (currentPath === '/favorites') {
      crumbs.push({ label: 'My Saved Favorites', path: '/favorites' });
    } else if (currentPath === '/recent') {
      crumbs.push({ label: 'Calculation History', path: '/recent' });
    } else if (currentPath === '/admin') {
      crumbs.push({ label: 'Admin Dashboard', path: '/admin' });
    } else if (currentPath === '/about') {
      crumbs.push({ label: 'About Us', path: '/about' });
    } else if (currentPath === '/contact') {
      crumbs.push({ label: 'Contact Support', path: '/contact' });
    } else if (currentPath === '/privacy-policy') {
      crumbs.push({ label: 'Privacy Policy', path: '/privacy-policy' });
    } else if (currentPath === '/terms-and-conditions') {
      crumbs.push({ label: 'Terms of Service', path: '/terms-and-conditions' });
    } else if (currentPath === '/disclaimer') {
      crumbs.push({ label: 'Disclaimer', path: '/disclaimer' });
    } else if (currentPath === '/categories') {
      crumbs.push({ label: 'Categories', path: '/categories' });
    } else if (currentPath.startsWith('/categories/')) {
      crumbs.push({ label: 'Categories', path: '/categories' });
      const slug = currentPath.split('/categories/').pop() || '';
      const cat = CATEGORIES.find(c => c.slug === slug);
      crumbs.push({ label: cat ? cat.name : 'Category', path: currentPath });
    } else if (currentPath !== '/' && selectedCalculatorName) {
      crumbs.push({ label: selectedCalculatorName, path: currentPath });
    }

    return (
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
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
                  onClick={() => handleNav(crumb.path)}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
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

  // Extract popular calculators for quick navigation
  const popularCalculators = CALCULATORS.filter(c => 
    c.id === 'loan-calculator' || 
    c.id === 'sip-calculator' || 
    c.id === 'mortgage-calculator' || 
    c.id === 'bmi-calculator' || 
    c.id === 'pregnancy-calculator' || 
    c.id === 'age-calculator'
  );

  return (
    <footer className="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 mt-auto">
      
      {/* Sponsor / Informational Affiliate Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-sm">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 uppercase tracking-wide">
              Official Sponsor
            </span>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              Need Professional Financial or Real Estate Advice?
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Connect with certified financial planners and mortgage specialists for custom asset reports.
            </p>
          </div>
          <button 
            onClick={() => handleNav('/contact')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0"
          >
            Consult Expert
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Dynamic SEO Breadcrumbs Block */}
        {renderBreadcrumbs()}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
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

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 font-display">
              Calculator Categories
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <button 
                    onClick={() => handleNav(`/categories/${cat.slug}`)} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    {cat.name} Calculators
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => handleNav('/categories')} 
                  className="text-blue-600 hover:underline font-semibold"
                >
                  View All 11 Categories &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Calculators */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 font-display">
              Popular Calculators
            </h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {popularCalculators.map((calc) => (
                <li key={calc.id}>
                  <button 
                    onClick={() => handleNav(`/${calc.id}`)} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    {calc.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Trust, Corporate & Legal */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 font-display">
              Quality & Trust
            </h3>
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl">
              <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider leading-none">
                  ISO 99.9% Accuracy
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                  All mathematical engines are verified globally.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
              <button onClick={() => handleNav('/about')} className="text-left hover:text-blue-600">About Our Team</button>
              <button onClick={() => handleNav('/contact')} className="text-left hover:text-blue-600">Contact & Support</button>
              <button onClick={() => handleNav('/blog')} className="text-left hover:text-blue-600">Masterclass Blog</button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Fine Legal Navigation */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; 2026 YourCalculation.com. All rights reserved. Calculations are educational only.
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-xs text-slate-400 dark:text-slate-500">
            <button onClick={() => handleNav('/privacy-policy')} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <button onClick={() => handleNav('/terms-and-conditions')} className="hover:text-blue-600 transition-colors">Terms of Service</button>
            <button onClick={() => handleNav('/disclaimer')} className="hover:text-blue-600 transition-colors">Disclaimer</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
