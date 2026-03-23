'use client';

import { useEffect, useState } from 'react';
import { FileText, Eye } from 'lucide-react';

interface PostSummary {
  total: number;
  published: number;
  drafts: number;
}

export function UserGrowthChart() {
  const [summary, setSummary] = useState<PostSummary>({ total: 0, published: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch('/api/blogs?limit=1000');
        if (res.ok) {
          const posts = await res.json();
          const all = Array.isArray(posts) ? posts : [];
          const pub = all.filter((p: { published?: boolean }) => p.published).length;
          setSummary({ total: all.length, published: pub, drafts: all.length - pub });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-24 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Content Overview</h3>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
          <p className="text-sm text-gray-500 mt-1">Total Posts</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Eye className="h-4 w-4 text-green-600" />
            <p className="text-3xl font-bold text-green-600">{summary.published}</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">Published</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-400">{summary.drafts}</p>
          <p className="text-sm text-gray-500 mt-1">Drafts</p>
        </div>
      </div>

      {summary.total > 0 && (
        <div className="mt-6">
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(summary.published / summary.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {Math.round((summary.published / summary.total) * 100)}% published
          </p>
        </div>
      )}
    </div>
  );
}
