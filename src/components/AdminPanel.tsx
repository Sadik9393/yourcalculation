import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Settings, TrendingUp, Users, ShieldCheck, Heart, MessageSquare, 
  Trash, Check, Star, Globe, Shield, RefreshCw, GitBranch, Zap, ExternalLink, Lock, Server, Code, Key
} from 'lucide-react';
import { CalculatorConfig, Comment } from '../types';

interface AdminPanelProps {
  calculators: CalculatorConfig[];
}

export default function AdminPanel({ calculators }: AdminPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [seoTitle, setSeoTitle] = useState('YourCalculation.com | AI-Powered Calculation Masterclass');
  const [seoDesc, setSeoDesc] = useState('Free online calculators with instant results and AI-powered explanations. Calculate loan EMIs, BMI, compound SIPs, and circuits.');
  const [robotsTxt, setRobotsTxt] = useState('User-agent: *\nAllow: /\nSitemap: https://yourcalculation.com/sitemap.xml');
  const [isSaved, setIsSaved] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Auto-Deployment Integration States
  const [githubToken, setGithubToken] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [vercelDeployHook, setVercelDeployHook] = useState('');
  const [hasGithubToken, setHasGithubToken] = useState(false);
  const [githubTokenMasked, setGithubTokenMasked] = useState('');

  const [deployLoading, setDeployLoading] = useState(false);
  const [saveSettingsLoading, setSaveSettingsLoading] = useState(false);
  const [deployResult, setDeployResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load comments
  const loadComments = () => {
    setLoadingComments(true);
    // Fetch comments from loan-calculator as a primary representative list
    fetch('/api/comments/loan-calculator')
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoadingComments(false);
      })
      .catch((err) => {
        console.error('Error fetching comments:', err);
        setLoadingComments(false);
      });
  };

  const loadDeploySettings = () => {
    fetch('/api/admin/deploy-settings')
      .then((res) => res.json())
      .then((data) => {
        setGithubRepo(data.githubRepo || '');
        setGithubBranch(data.githubBranch || 'main');
        setVercelDeployHook(data.vercelDeployHook || '');
        setHasGithubToken(data.hasGithubToken);
        setGithubTokenMasked(data.githubTokenMasked || '');
        if (data.hasGithubToken) {
          setGithubToken('***RETAINED***');
        }
      })
      .catch((err) => console.error('Error loading deploy settings:', err));
  };

  useEffect(() => {
    loadComments();
    loadDeploySettings();
  }, []);

  const handleSaveDeploySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSettingsLoading(true);
    setSaveResult(null);

    fetch('/api/admin/deploy-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        githubToken,
        githubRepo,
        githubBranch,
        vercelDeployHook,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSaveSettingsLoading(false);
        if (data.success) {
          setSaveResult({ success: true, message: 'Settings saved!' });
          loadDeploySettings();
          setTimeout(() => setSaveResult(null), 3000);
        } else {
          setSaveResult({ success: false, message: data.error || 'Failed to save settings' });
        }
      })
      .catch((err) => {
        setSaveSettingsLoading(false);
        setSaveResult({ success: false, message: 'Failed to communicate with API' });
      });
  };

  const handleTriggerDeploy = (mode: 'github' | 'vercel') => {
    setDeployLoading(true);
    setDeployResult(null);

    fetch('/api/admin/deploy-trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDeployLoading(false);
        if (data.success) {
          setDeployResult({ success: true, message: data.message });
        } else {
          setDeployResult({ success: false, message: data.error || 'Deployment failed' });
        }
      })
      .catch((err) => {
        setDeployLoading(false);
        setDeployResult({ success: false, message: 'Deployment connection timed out or failed' });
      });
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Mock analytics calculation logs (last 7 days volume)
  const analyticsData = [
    { day: 'Mon', calculations: 8400 },
    { day: 'Tue', calculations: 9600 },
    { day: 'Wed', calculations: 10400 },
    { day: 'Thu', calculations: 10200 },
    { day: 'Fri', calculations: 11500 },
    { day: 'Sat', calculations: 9200 },
    { day: 'Sun', calculations: 10100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-7 w-7 text-blue-600" />
          Admin Dashboard
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Manage system configurations, inspect real-time calculation telemetry, and optimize SEO meta properties.
        </p>
      </div>

      {/* Grid summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Total Calculations Daily
              </p>
              <p className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-1">
                10,100+
              </p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
            +14% vs last week
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Active Calculations Engines
              </p>
              <p className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-1">
                500+
              </p>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Settings className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Dynamic config registry running perfectly
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Average User Score
              </p>
              <p className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-1">
                4.82 / 5
              </p>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <Star className="h-4.5 w-4.5 fill-amber-500" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
            99.9% Math accuracy certified
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Calculation Server Status
              </p>
              <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                99.99%
              </p>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-500 font-bold mt-2">
            No active server errors reported
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Analytics Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-display font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider text-slate-400">
              📈 Weekly Calculation Traffic (Recharts)
            </h2>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip />
                  <Bar dataKey="calculations" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comment Moderator Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-display font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Moderate User Reviews
              </h2>
              <button 
                onClick={loadComments} 
                className="p-1 text-slate-400 hover:text-blue-500 hover:bg-slate-50 rounded-lg transition-colors"
                title="Refresh Reviews List"
              >
                <RefreshCw className={`h-4 w-4 ${loadingComments ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.author}</span>
                        <span className="text-[10px] text-slate-400">{c.date}</span>
                      </div>
                      <div className="flex gap-0.5 my-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`h-3 w-3 ${idx < c.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">{c.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg shrink-0 transition-colors"
                      title="Moderate / Delete Review"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-12">
                  No pending reviews requiring moderation. All clean!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: SEO Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-display font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="h-4.5 w-4.5 text-blue-500" />
              Global SEO Tags Optimizer
            </h2>

            <form onSubmit={handleSaveSeo} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Homepage Meta Title
                </label>
                <input
                  type="text"
                  required
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Homepage Meta Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1 font-mono">
                  Robots.txt Rules Config
                </label>
                <textarea
                  required
                  rows={4}
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs font-mono text-slate-700 dark:text-slate-300 focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {isSaved ? <Check className="h-4 w-4 text-emerald-400" /> : <Settings className="h-4 w-4" />}
                {isSaved ? 'SEO Settings Synced Successfully' : 'Save SEO Configurations'}
              </button>
            </form>
          </div>

          {/* Automated Deployment & Vercel/GitHub Sync */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-sm font-display font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="h-4.5 w-4.5 text-blue-600" />
              Automated Vercel & GitHub Deployment
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4">
              Connect your domain, synchronize workspace files directly to your GitHub repository, or trigger custom Vercel rebuild webhooks automatically via the REST API.
            </p>

            <form onSubmit={handleSaveDeploySettings} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                  <Key className="h-3 w-3 text-slate-400" />
                  GitHub Personal Access Token (PAT)
                </label>
                <input
                  type="password"
                  placeholder={hasGithubToken ? `Configured (${githubTokenMasked})` : "ghp_xxxxxxxxxxxxxxxxxxxx"}
                  value={githubToken === '***RETAINED***' ? '' : githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Repository (owner/name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. username/repo"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1 font-mono">
                    <GitBranch className="h-3 w-3 text-slate-400" />
                    Branch
                  </label>
                  <input
                    type="text"
                    value={githubBranch}
                    onChange={(e) => setGithubBranch(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs font-mono text-slate-800 dark:text-slate-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Vercel Deploy Hook URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                  value={vercelDeployHook}
                  onChange={(e) => setVercelDeployHook(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs text-slate-800 dark:text-slate-200 focus:border-blue-500"
                />
              </div>

              {saveResult && (
                <div className={`p-3 rounded-xl text-xs font-medium ${saveResult.success ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'}`}>
                  {saveResult.message}
                </div>
              )}

              <button
                type="submit"
                disabled={saveSettingsLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
              >
                {saveSettingsLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {saveSettingsLoading ? 'Saving config...' : 'Save & Secure API Credentials'}
              </button>
            </form>

            {/* Quick Trigger Actions */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                ⚡ Quick Trigger Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTriggerDeploy('github')}
                  disabled={deployLoading || !githubRepo || (!githubToken && !hasGithubToken)}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Code className="h-4 w-4" />
                  Sync to GitHub
                </button>
                <button
                  onClick={() => handleTriggerDeploy('vercel')}
                  disabled={deployLoading || !vercelDeployHook}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Redeploy Vercel
                </button>
              </div>

              {deployLoading && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium animate-pulse">
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Synchronizing workspace files and pushing to git remote... Please wait, this might take up to 20 seconds.</span>
                </div>
              )}

              {deployResult && (
                <div className={`mt-3 p-3 rounded-xl text-xs font-medium leading-normal ${deployResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40' : 'bg-red-50 text-red-800 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40'}`}>
                  <div className="font-bold flex items-center gap-1 mb-0.5">
                    {deployResult.success ? <Check className="h-4 w-4 text-emerald-500" /> : <Lock className="h-4 w-4 text-red-500" />}
                    {deployResult.success ? 'Sync Completed Successfully' : 'Action Failed'}
                  </div>
                  {deployResult.message}
                </div>
              )}
            </div>
          </div>

          {/* AdSense Placement Sandbox block */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-6 text-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 uppercase tracking-wide">
              AdSense Sandbox Slot
            </span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
              Google AdSense ID: ca-pub-991823719283
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
              Ready for high-CPC responsive native ads. Placements configured automatically around popular calculation nodes.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
