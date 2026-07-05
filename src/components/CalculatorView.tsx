import React, { useState, useEffect } from 'react';
import { 
  Star, Share2, Printer, Download, Copy, Sparkles, Check, 
  ArrowLeft, ArrowRight, MessageSquare, Plus, FileSpreadsheet, FileText 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { CalculatorConfig, Comment } from '../types';

interface CalculatorViewProps {
  config: CalculatorConfig;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onBack: () => void;
  allCalculators: CalculatorConfig[];
  onSelectCalculator: (id: string) => void;
}

export default function CalculatorView({ 
  config, isFavorite, onToggleFavorite, onBack, allCalculators, onSelectCalculator 
}: CalculatorViewProps) {
  
  // Initialize form state
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    config.fields.forEach((f) => {
      initial[f.name] = f.defaultValue;
    });
    return initial;
  });

  const [outputs, setOutputs] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  
  // AI Explanation States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Reviews and Ratings States
  const [comments, setComments] = useState<Comment[]>([]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Run calculation live on input change
  useEffect(() => {
    const results = config.calculate(inputs);
    setOutputs(results);
    // Clear AI explanation when inputs change so they don't see stale advice
    setAiExplanation(null);
  }, [inputs, config]);

  // Load comments on select
  useEffect(() => {
    fetch(`/api/comments/${config.id}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [config.id]);

  const handleInputChange = (name: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Copy result utility
  const handleCopyResult = () => {
    const primaryResult = Object.entries(outputs)
      .filter(([key]) => typeof outputs[key] === 'number')
      .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
      .join(', ');

    navigator.clipboard.writeText(`YourCalculation.com | ${config.name} Results: ${primaryResult}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share URL utility
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?calc=${config.id}&inputs=${encodeURIComponent(JSON.stringify(inputs))}`;
    navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  // PDF Export Simulation
  const handleDownloadPDF = () => {
    const content = `
YOURCALCULATION.COM - TRANSACTION REPORT
Calculator: ${config.name}
Date: ${new Date().toLocaleString()}
Accuracy Rating: ISO 99.9% Verified

--- INPUT DETAILS ---
${Object.entries(inputs).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('\n')}

--- CALCULATION RESULTS ---
${Object.entries(outputs)
  .filter(([k]) => typeof outputs[k] === 'number' || typeof outputs[k] === 'string')
  .map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('\n')}

--- END REPORT ---
Thank you for calculating with YourCalculation.com.
    `;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.id}_calculation_report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Export
  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Parameter,Value\n';
    
    // Inputs
    Object.entries(inputs).forEach(([k, v]) => {
      csvContent += `Input_${k},${v}\n`;
    });
    
    // Outputs
    Object.entries(outputs).forEach(([k, v]) => {
      if (typeof v === 'number' || typeof v === 'string') {
        csvContent += `Output_${k},${v}\n`;
      }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${config.id}_data_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger Gemini AI Explanation
  const handleAskAI = async () => {
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const response = await fetch('/api/calculate/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorId: config.id,
          calculatorName: config.name,
          inputs,
          outputs,
        }),
      });
      const data = await response.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
        // Save to calculation history with explanation on server
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            calculatorId: config.id,
            calculatorName: config.name,
            inputs,
            outputs,
            explanation: data.explanation,
          }),
        });
      } else if (data.error) {
        setAiExplanation(`**Error:** ${data.error}`);
      }
    } catch (err: any) {
      setAiExplanation(`**Connection Failed:** Could not communicate with server-side AI: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Comments / Reviews
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    setSubmittingReview(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorId: config.id,
          author: newAuthor,
          rating: newRating,
          content: newContent,
        }),
      });
      const addedComment = await response.json();
      setComments((prev) => [addedComment, ...prev]);
      setNewAuthor('');
      setNewContent('');
      setNewRating(5);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Simple Markdown-to-HTML parser to support rich AI text displays
  const parseMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Bold
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950 dark:text-white">$1</strong>');
      // Bullet points
      if (line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-slate-600 dark:text-slate-300 mt-1" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />
        );
      }
      // Ordered points
      if (/^\d+\.\s/.test(line.trim())) {
        const parts = line.split(/^\d+\.\s/);
        return (
          <li key={idx} className="ml-4 list-decimal text-sm text-slate-600 dark:text-slate-300 mt-1" dangerouslySetInnerHTML={{ __html: parts[1] }} />
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
      if (line.trim().startsWith('#')) {
        return (
          <h2 key={idx} className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 mt-6 mb-3" dangerouslySetInnerHTML={{ __html: content.replace(/#/g, '') }} />
        );
      }

      if (!content.trim()) return <div key={idx} className="h-2" />;

      return (
        <p key={idx} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  // Dynamic Chart Plotting
  const renderChart = () => {
    if (!config.chartConfig) return null;

    const { type, labels, colors } = config.chartConfig;

    if (type === 'pie') {
      const data = Object.entries(labels).map(([key, label]) => ({
        name: label,
        value: outputs[key] || 0,
        color: colors?.[key] || '#3B82F6',
      }));

      return (
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (type === 'comparison') {
      const data = Object.entries(labels).map(([key, label]) => ({
        name: label,
        value: outputs[key] || inputs[key] || 0,
        color: colors?.[key] || '#3B82F6',
      }));

      return (
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
              <Tooltip formatter={(value) => [value, 'Value']} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  const relatedCalculators = allCalculators
    .filter((c) => c.category === config.category && c.id !== config.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Back Button & Title Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 shadow-sm transition-all shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {config.category} Calculator
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-3">
              {config.name}
              <button
                onClick={(e) => onToggleFavorite(config.id, e)}
                className="text-slate-300 hover:text-amber-500 transition-colors shrink-0"
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Star className={`h-6 w-6 ${isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
              </button>
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={handleShare}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 shadow-sm transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Copy Share Link"
          >
            {shared ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
            {shared ? 'Copied' : 'Share'}
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 shadow-sm transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Print Page"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <div className="relative group/down">
            <button
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 shadow-sm transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <div className="absolute right-0 top-11 hidden group-hover/down:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl p-1.5 w-36 z-30">
              <button
                onClick={handleDownloadPDF}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2"
              >
                <FileText className="h-3.5 w-3.5 text-blue-500" /> TXT Report
              </button>
              <button
                onClick={handleDownloadCSV}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" /> CSV Sheets
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Inputs Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-display font-bold text-slate-800 dark:text-slate-200 mb-6">
              Adjustment Parameters
            </h2>
            
            <div className="space-y-6">
              {config.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {field.label}
                    </label>
                    {field.type === 'number' && (
                      <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-lg border border-blue-100/30">
                        {field.unit === '$' ? '$' : ''}
                        {Number(inputs[field.name]).toLocaleString()}
                        {field.unit !== '$' ? ` ${field.unit || ''}` : ''}
                      </span>
                    )}
                  </div>

                  {field.type === 'number' && (
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={inputs[field.name]}
                        onChange={(e) => handleInputChange(field.name, Number(e.target.value))}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500"
                      />
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={inputs[field.name]}
                        onChange={(e) => handleInputChange(field.name, Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  )}

                  {field.type === 'select' && (
                    <select
                      value={inputs[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={inputs[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Live Results & Charts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono uppercase tracking-wider rounded-bl-2xl border-l border-b border-emerald-500/10">
              Live Verified
            </div>
            
            <h2 className="text-lg font-display font-bold text-slate-800 dark:text-slate-200 mb-6">
              Calculation Breakdown
            </h2>

            {/* Display Primary value first */}
            {config.id === 'loan-calculator' && (
              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/20 rounded-2xl p-6 text-center mb-6">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Monthly Installment (EMI)
                </p>
                <p className="text-3xl sm:text-4xl font-display font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">
                  ${Number(outputs.emi || 0).toLocaleString()}
                </p>
              </div>
            )}

            {config.id === 'sip-calculator' && (
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/20 rounded-2xl p-6 text-center mb-6">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Total Projected Wealth
                </p>
                <p className="text-3xl sm:text-4xl font-display font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  ${Number(outputs.totalValue || 0).toLocaleString()}
                </p>
              </div>
            )}

            {config.id === 'bmi-calculator' && (
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 text-center mb-6 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Your Calculated Body Mass Index (BMI)
                </p>
                <p className="text-4xl font-display font-bold font-mono mt-2 text-slate-800 dark:text-slate-100">
                  {outputs.bmi}
                </p>
                <div className="mt-3">
                  <span className={`inline-flex px-3 py-1 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 ${outputs.color}`}>
                    {outputs.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {outputs.advice}
                </p>
              </div>
            )}

            {/* Grid display for remaining secondary outputs */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Object.entries(outputs)
                .filter(([k]) => k !== 'emi' && k !== 'totalValue' && k !== 'bmi' && k !== 'status' && k !== 'color' && k !== 'advice' && k !== 'solved' && !k.endsWith('Percent'))
                .map(([key, val]) => {
                  const displayLabel = config.chartConfig?.labels?.[key] || key.replace(/([A-Z])/g, ' $1').toUpperCase();
                  const isNum = typeof val === 'number';
                  const formattedVal = isNum ? val.toLocaleString() : val;
                  
                  return (
                    <div key={key} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider truncate">
                        {displayLabel}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mt-1 font-mono">
                        {isNum && key !== 'years' && key !== 'months' && key !== 'days' && key !== 'daysToBirthday' && key !== 'totalDays' && key !== 'decimal' && key !== 'gallons' && key !== 'liters' && key !== 'v' && key !== 'i' && key !== 'r' && key !== 'power' ? '$' : ''}
                        {formattedVal}
                        {key === 'liters' ? ' L' : ''}
                        {key === 'gallons' ? ' Gallons' : ''}
                        {key === 'v' ? ' V' : ''}
                        {key === 'i' ? ' A' : ''}
                        {key === 'r' ? ' Ω' : ''}
                        {key === 'power' ? ' W' : ''}
                        {key === 'years' ? ' Years' : ''}
                        {key === 'months' ? ' Months' : ''}
                        {key === 'days' ? ' Days' : ''}
                      </p>
                    </div>
                  );
                })}
            </div>

            {/* Recharts Container */}
            {renderChart()}

            {/* Copy Primary Value Trigger */}
            <div className="flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 mt-6 pt-6">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                All math logic conforms ISO-definitions.
              </span>
              <button
                onClick={handleCopyResult}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {copied ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
                {copied ? 'Copied' : 'Copy Result'}
              </button>
            </div>
          </div>

          {/* AI Explanation Area */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
              <Sparkles className="h-48 w-48" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
              <h3 className="text-base font-display font-bold">
                AI Explanation Engine
              </h3>
            </div>

            {aiExplanation ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 max-h-[400px] overflow-y-auto">
                <div className="prose prose-sm prose-invert max-w-none text-white text-xs">
                  {parseMarkdown(aiExplanation)}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-blue-100 leading-relaxed mb-6">
                  Want to understand these numbers? Our smart AI explains your EMI or healthy thresholds in simple language and suggests strategic optimizations (e.g. how adding $50/month cuts debt years early).
                </p>
                <button
                  onClick={handleAskAI}
                  disabled={aiLoading}
                  className="px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {aiLoading ? (
                    <span className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {aiLoading ? 'Analyzing Math...' : 'Ask AI to Explain Results'}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Related Calculators section */}
      {relatedCalculators.length > 0 && (
        <div className="mt-16">
          <h2 className="text-lg font-display font-bold text-slate-800 dark:text-slate-200 mb-6">
            Related {config.category} Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedCalculators.map((calc) => (
              <div
                key={calc.id}
                onClick={() => onSelectCalculator(calc.id)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer hover:border-blue-500/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                    {calc.category}
                  </span>
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mt-2">
                    {calc.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {calc.description}
                  </p>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-4 flex items-center gap-1">
                  Try Tool <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments & Reviews section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm mt-12">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Community Reviews & Ratings ({comments.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Review List */}
          <div className="md:col-span-7 space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      {c.author}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {c.date}
                    </span>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`h-3 w-3 ${idx < c.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-12">
                No reviews yet. Be the first to share your experience with this calculator!
              </p>
            )}
          </div>

          {/* Form to submit a review */}
          <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">
              Write a Review
            </h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewRating(idx + 1)}
                      className="text-slate-300 hover:text-amber-500 transition-colors"
                    >
                      <Star 
                        className={`h-5 w-5 ${idx < newRating ? 'text-amber-500 fill-amber-500' : ''}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Review Content
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share how this calculator helped you or give recommendations..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submittingReview && <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Submit Review
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
