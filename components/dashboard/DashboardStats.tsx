'use client';

import { useState, useEffect } from 'react';
import { FileText, FolderOpen, Tag, Users } from 'lucide-react';

interface Stats {
  posts: number;
  published: number;
  categories: number;
  tags: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({ posts: 0, published: 0, categories: 0, tags: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [postsRes, categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/blogs?limit=1000'),
          fetch('/api/blogs/categories'),
          fetch('/api/blogs/tags'),
        ]);

        const posts = postsRes.ok ? await postsRes.json() : [];
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];
        const tags = tagsRes.ok ? await tagsRes.json() : [];

        const allPosts = Array.isArray(posts) ? posts : [];
        const publishedPosts = allPosts.filter((p: { published?: boolean }) => p.published);

        setStats({
          posts: allPosts.length,
          published: publishedPosts.length,
          categories: Array.isArray(categories) ? categories.length : 0,
          tags: Array.isArray(tags) ? tags.length : 0,
        });
      } catch {
        // fallback to zeros
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const items = [
    { label: 'Total Posts', value: stats.posts, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Published', value: stats.published, icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'Categories', value: stats.categories, icon: FolderOpen, color: 'text-amber-600 bg-amber-50' },
    { label: 'Tags', value: stats.tags, icon: Tag, color: 'text-purple-600 bg-purple-50' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
            <div className="h-7 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
