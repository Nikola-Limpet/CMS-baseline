'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  authorName?: string | null;
}

interface RecentActivityProps {
  limit?: number;
  className?: string;
}

const RecentActivity = ({ limit = 6, className = '' }: RecentActivityProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/blogs?limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(Array.isArray(data) ? data.slice(0, limit) : []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [limit]);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
        <div className="p-6">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>

        <div className="space-y-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/dashboard/blogs/${post.id}/edit`}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg flex-shrink-0 ${post.published ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{post.published ? 'Published' : 'Draft'}</span>
                    {(post.publishedAt || post.createdAt) && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(post.publishedAt || post.createdAt), 'MMM d')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-6">
              <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
