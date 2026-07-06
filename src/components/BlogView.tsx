import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from '../data/blog';
import { BlogPost, CalculatorConfig } from '../types';
import { Clock, User, ArrowLeft, ArrowRight, Play, BookOpen } from 'lucide-react';
import { navigate } from '../lib/router';

interface BlogViewProps {
  calculators: CalculatorConfig[];
}

export default function BlogView({ calculators }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const handlePopStateSync = () => {
      const parts = window.location.pathname.split('/blog/');
      if (parts.length > 1) {
        const slug = parts[1];
        const matching = BLOG_POSTS.find((p) => p.id === slug);
        if (matching) {
          setSelectedPost(matching);
        } else {
          setSelectedPost(null);
        }
      } else {
        setSelectedPost(null);
      }
    };

    handlePopStateSync();
    window.addEventListener('popstate', handlePopStateSync);
    return () => window.removeEventListener('popstate', handlePopStateSync);
  }, []);

  const handlePostClick = (post: BlogPost) => {
    navigate(`/blog/${post.id}`);
  };

  const handleBack = () => {
    navigate('/blog');
  };

  const parseBlogMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Bold
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
      
      // Inline Link Parser for dynamically launching calculators from within the blog post!
      // Format: [Label](/calculator/calc-id)
      const linkRegex = /\[(.*?)\]\(\/calculator\/(.*?)\)/g;
      if (line.match(linkRegex)) {
        // Simple click trigger mapping
        return (
          <p key={idx} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {line.split(linkRegex).map((part, pIdx) => {
              if (pIdx % 3 === 1) {
                // This is the label
                const label = part;
                const calcId = line.split(linkRegex)[pIdx + 1];
                return (
                  <a
                    key={pIdx}
                    href={`/${calcId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${calcId}`);
                    }}
                    className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline align-baseline"
                  >
                    {label} <Play className="h-2 w-2 fill-blue-600 animate-pulse" />
                  </a>
                );
              }
              if (pIdx % 3 === 2) {
                // This is the calcId, skip it as it is handled with the label
                return null;
              }
              return part;
            })}
          </p>
        );
      }

      // Bullets
      if (line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-slate-600 dark:text-slate-300 text-sm mt-1" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        const parts = line.split(/^\d+\.\s/);
        return (
          <li key={idx} className="ml-5 list-decimal text-slate-600 dark:text-slate-300 text-sm mt-1" dangerouslySetInnerHTML={{ __html: parts[1] }} />
        );
      }
      // Headings
      if (line.trim().startsWith('##')) {
        return (
          <h3 key={idx} className="text-lg font-bold font-display text-slate-900 dark:text-white mt-6 mb-3 border-b border-slate-100 dark:border-slate-800 pb-1" dangerouslySetInnerHTML={{ __html: content.replace(/##/g, '') }} />
        );
      }
      if (line.trim().startsWith('#')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-8 mb-4" dangerouslySetInnerHTML={{ __html: content.replace(/#/g, '') }} />
        );
      }

      if (!content.trim()) return <div key={idx} className="h-4" />;

      return (
        <p key={idx} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {selectedPost ? (
        // Detailed Article View
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-md">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog List
          </button>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4">
            {selectedPost.category}
          </span>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
            {selectedPost.title}
          </h1>

          {/* Author / Metadata bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-4 pb-6 border-b border-slate-100 dark:border-slate-800/60 mb-8">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> By {selectedPost.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {selectedPost.readTime}
            </span>
            <span>Published {selectedPost.date}</span>
          </div>

          {/* Parsed Blog Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {parseBlogMarkdown(selectedPost.content)}
          </div>

          {/* Action Trigger Box at bottom */}
          {selectedPost.relatedCalculators.length > 0 && (
            <div className="mt-12 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                  Ready to test this math?
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculate and play with different scenarios discussed in this article.
                </p>
              </div>
              <button
                onClick={() => navigate(`/${selectedPost.relatedCalculators[0]}`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1 shrink-0"
              >
                Go to Calculator <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

        </div>
      ) : (
        // Grid View of All Blog Posts
        <div>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-xs font-bold text-blue-600 dark:text-blue-400 mb-3">
              <BookOpen className="h-4 w-4 text-blue-500" />
              SEO Blogs, Guides & Amortization Tutorials
            </div>
            <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-white tracking-tight">
              Calculators & Math Masterclass
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-md mx-auto">
              Master compound interest, understand loan amortization traps, and track body composition guidelines with expert guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg cursor-pointer hover:border-blue-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-lg">
                    {post.category}
                  </span>
                  
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200 mt-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/40">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
