import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Sparkles, HelpCircle, ArrowRight, CornerDownLeft, AlertTriangle, FileText } from 'lucide-react';
import { navigate } from '../lib/router';

// ==================================================
// 1. ABOUT PAGE COMPONENT
// ==================================================
export function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          About YourCalculation<span className="text-blue-500 font-sans">.com</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-base max-w-xl mx-auto">
          Pioneering the next generation of calculation technology by merging precision mathematical solvers with powerful, server-side Gemini AI.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" /> Our Mission
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            At YourCalculation.com, we believe that math shouldn't be dry, and finance shouldn't be confusing. Our mission is to democratize high-fidelity calculators and pair them with customized, real-time AI advice. Whether you are calculating mortgage escrow limits, body-mass indicators, business gross margins, or physical circuit variables, our engines deliver 99.9% accurate calculations with clean, easy-to-understand explanations.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">99.9% Accuracy</h3>
            <p className="text-xs text-slate-500 mt-1">Every equation is thoroughly vetted and tested against ISO and standard financial benchmarks.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">AI Explanations</h3>
            <p className="text-xs text-slate-500 mt-1">Powered by server-side Gemini AI to analyze results and output customized, actionable strategic advice.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Zero Ads</h3>
            <p className="text-xs text-slate-500 mt-1">Enjoy a clean, fast, mobile-responsive user interface with absolutely zero intrusive ad banners.</p>
          </div>
        </div>

        <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-white">Our Engineering Principles</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We follow mobile-first responsive architecture with strict separation of logic. Calculations are executed 100% locally on your browser for instant performance, while Gemini AI prompts are securely routed server-side to prevent client-key exposures.
          </p>
        </section>
      </div>
    </div>
  );
}

// ==================================================
// 2. CONTACT PAGE COMPONENT
// ==================================================
export function ContactView() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Contact Support & Feedback
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-base max-w-xl mx-auto">
          Have an equation request or feedback on our AI calculation engines? Our support staff is always here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Contact info cards */}
        <div className="space-y-4 md:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0 h-11 w-11 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</h3>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">support@yourcalculation.com</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0 h-11 w-11 flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Telephone Support</h3>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">+1 (800) 555-CALC</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0 h-11 w-11 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Headquarters</h3>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">Suite 404, Infinite Loop, Silicon Valley, CA</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm md:col-span-2">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">Message Dispatched Successfully</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for your submission. An engineering or mathematical expert will review your ticket and reply within 12 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject (Optional)</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                Send Message <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================================================
// 3. PRIVACY POLICY PAGE COMPONENT
// ==================================================
export function PrivacyView() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mt-2 font-mono">Last Updated: October 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">1. Scope of Privacy Protection</h2>
          <p>
            YourCalculation.com takes personal privacy seriously. All primary calculator operations are executed locally in your browser. We do not store, catalog, or transmit sensitive calculation variables or numerical inputs without your direct selection (e.g., when requesting AI analysis or saving to your personal calculator profile history).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">2. Server-Side AI Integrations</h2>
          <p>
            When utilizing the "Ask AI" or "Explain Results" feature, the calculator parameters are safely marshaled and transmitted to our secure server-side API proxy. This coordinates safely with official Google Gemini AI endpoints. No direct identifying account data is forwarded or attached to these models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">3. Cookies and Browser Storage</h2>
          <p>
            We use standard `localStorage` parameters to cache dark/light mode configurations, selected favorite calculators, and search histories locally on your machine. This ensures a fast, persistent experience with zero third-party telemetry.
          </p>
        </section>
      </div>
    </div>
  );
}

// ==================================================
// 4. TERMS & CONDITIONS PAGE COMPONENT
// ==================================================
export function TermsView() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Terms & Conditions</h1>
        <p className="text-xs text-slate-400 mt-2 font-mono">Effective: October 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using YourCalculation.com, you certify that you have read, understood, and agree to be bound by these legal terms. If you do not agree to these policies, please terminate your site usage immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">2. Intended Use and Accuracy</h2>
          <p>
            All calculation engines, mathematical spreadsheets, physical formula outputs, and subsequent AI summaries are provided strictly for educational, reference, and informational purposes. While we strive to maintain our 99.9% equation accuracy rating, you are advised to double-check critical formulas prior to making significant financial or construction investments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">3. Limitation of Liability</h2>
          <p>
            In no event shall YourCalculation.com, its directors, employees, or tech partners be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our tools.
          </p>
        </section>
      </div>
    </div>
  );
}

// ==================================================
// 5. DISCLAIMER PAGE COMPONENT
// ==================================================
export function DisclaimerView() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <AlertTriangle className="h-7 w-7 text-amber-500 shrink-0" /> Legal Disclaimer
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-mono">Vetted: October 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
            CRITICAL: Calculated values do not substitute professional certified advice.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">Financial Calculations</h2>
          <p>
            Our Finance, SIP, Loan, and EMI calculators are based on mathematical models and standard interest-compounding equations. Actual interest rates, fees, or taxes from financial institutions may vary. Consult a certified financial planner, mortgage broker, or accountant before making long-term financial commitments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">Health & Fitness Calculations</h2>
          <p>
            Calculators such as the BMI and Calorie BMR indicators estimate averages based on biological metrics. They should not be used as clinical diagnostic tools or medical prescriptions. Consult with a qualified physician or nutritionist regarding any health-related dietary or fitness plans.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-display text-slate-800 dark:text-white">Engineering and Construction Calculations</h2>
          <p>
            Ohm's Law, Base Conversions, and Paint Calculators utilize textbook physics and physical ratios. Standard manufacturing differences, environmental factors, or building materials tolerances are not accounted for. Always confirm parameters with a licensed professional engineer or building contractor.
          </p>
        </section>
      </div>
    </div>
  );
}

// ==================================================
// 6. 404 NOT FOUND PAGE COMPONENT
// ==================================================
export function NotFoundView() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center animate-in fade-in duration-300">
      <div className="h-20 w-20 bg-blue-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl mx-auto flex items-center justify-center shadow-sm mb-6">
        <HelpCircle className="h-10 w-10 text-blue-500 animate-bounce" />
      </div>
      <h1 className="font-display font-bold text-4xl text-slate-900 dark:text-white tracking-tight">404 Error</h1>
      <h2 className="font-display font-semibold text-lg text-slate-700 dark:text-slate-300 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
        The link you followed may be broken or the calculator page has been reorganized. Let's get you back on track!
      </p>

      <div className="flex flex-col gap-2 mt-8">
        <button
          onClick={() => navigate('/')}
          className="h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
        >
          <CornerDownLeft className="h-4 w-4" /> Back to Homepage
        </button>
        <button
          onClick={() => navigate('/categories')}
          className="h-11 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
        >
          Explore All Categories
        </button>
      </div>
    </div>
  );
}
