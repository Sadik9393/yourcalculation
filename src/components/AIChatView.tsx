import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, Check, Clipboard, RefreshCw, Send, DollarSign, HelpCircle } from 'lucide-react';

interface CalculatedItem {
  label: string;
  value: string;
}

interface AISolution {
  analysis: string;
  calculatedValues: CalculatedItem[];
  suggestions: string[];
  explanation: string;
}

export default function AIChatView() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<AISolution | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    'I earn $5,000/month. Can I afford a $300,000 house?',
    'I invest $250/month. What will it be worth in 20 years at 11% interest?',
    'If I buy a $35,000 car with a $5,000 downpayment, what is my monthly EMI at 7% for 5 years?',
    'My weight is 82 kg and height is 180 cm. Tell me my health status and calories needed.',
  ];

  const handleQuerySubmit = async (textToSend?: string) => {
    const activeQuery = textToSend || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSolution(null);
    try {
      const response = await fetch('/api/ai-calculator/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery }),
      });
      const data = await response.json();
      if (response.ok) {
        setSolution(data);
        setQuery(activeQuery); // Fill field if selected from tags
      } else {
        setError(data.error || 'The AI solver encountered an issue.');
      }
    } catch (err: any) {
      setError(`Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!solution) return;
    const shareableText = `
YourCalculation.com | AI Calculation Analysis
Prompt: ${query}
Analysis: ${solution.analysis}

--- CALCULATIONS ---
${solution.calculatedValues.map((v) => `${v.label}: ${v.value}`).join('\n')}

--- ADVICE ---
${solution.explanation}
    `;
    navigator.clipboard.writeText(shareableText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Bold
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
      // Lists
      if (line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-600 dark:text-slate-300 mt-1" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        const parts = line.split(/^\d+\.\s/);
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-600 dark:text-slate-300 mt-1" dangerouslySetInnerHTML={{ __html: parts[1] }} />
        );
      }
      // Headings
      if (line.trim().startsWith('###')) {
        return (
          <h4 key={idx} className="text-sm font-bold font-display text-blue-600 dark:text-blue-400 mt-4 mb-2" dangerouslySetInnerHTML={{ __html: content.replace(/###/g, '') }} />
        );
      }
      if (line.trim().startsWith('##')) {
        return (
          <h3 key={idx} className="text-base font-bold font-display text-slate-800 dark:text-slate-200 mt-5 mb-2" dangerouslySetInnerHTML={{ __html: content.replace(/##/g, '') }} />
        );
      }

      if (!content.trim()) return <div key={idx} className="h-2" />;

      return (
        <p key={idx} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Page Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-xs font-bold text-blue-600 dark:text-blue-400 mb-3">
          <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
          AI-Powered Natural Language Calculation
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Ask Any Calculation Scenario
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-lg mx-auto">
          No complex formulas needed. Just describe your financial, math, or fitness scenario, and let the AI compile the results.
        </p>
      </div>

      {/* Query Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md mb-8">
        <div className="flex items-center h-14 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all duration-200">
          <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
          <input
            type="text"
            placeholder="e.g. I make $4,000/mo and want to buy a $20,000 car..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
            className="w-full bg-transparent px-3 text-sm text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={() => handleQuerySubmit()}
            disabled={loading}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md disabled:opacity-50 transition-colors shrink-0"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Tags */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-display">
            💡 Sample Scenarios to Ask:
          </p>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleQuerySubmit(p)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-md animate-pulse">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full animate-spin">
              <RefreshCw className="h-8 w-8" />
            </div>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200">
            Compiling Calculation Scenarios...
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Gemini is executing standard financial amortization formulas and health algorithms to construct your report.
          </p>
        </div>
      )}

      {/* Error Output */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* Interactive AI Solution Display */}
      {solution && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800/50 pb-4">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-display flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                AI Solver Output
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1 transition-all"
                  title="Copy Report"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Clipboard className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Analysis Banner */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/10 rounded-2xl p-5 mb-6">
              <h2 className="text-base font-display font-bold text-slate-900 dark:text-white">
                {solution.analysis}
              </h2>
            </div>

            {/* Calculated Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {solution.calculatedValues.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold truncate pr-2">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono text-right shrink-0">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommendations / Ideas */}
            {solution.suggestions.length > 0 && (
              <div className="mb-6 p-5 bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/10 rounded-2xl">
                <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 font-display flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4" /> Recommended Adjustments
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {solution.suggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Markdown Detailed Breakdown */}
            <div className="border-t border-slate-100 dark:border-slate-800/50 pt-6">
              <h3 className="text-sm font-display font-bold text-slate-800 dark:text-slate-200 mb-4">
                Detailed Equation & Financial Advice
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {parseMarkdown(solution.explanation)}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
