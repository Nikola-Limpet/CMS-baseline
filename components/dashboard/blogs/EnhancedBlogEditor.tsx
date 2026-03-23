'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Globe, Eye, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import BlogPostForm from '@/components/dashboard/blogs/BlogPostForm';

import { BlogPost } from '@/db/schema';

interface EnhancedBlogEditorProps {
  postToEdit?:
    | (BlogPost & {
        categories?: any[];
        tags?: any[];
      })
    | null;
  isNewPost?: boolean;
}

export function EnhancedBlogEditor({
  postToEdit = null,
  isNewPost = false,
}: EnhancedBlogEditorProps) {
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [postData] = useState(postToEdit);

  useEffect(() => {
    // Set up beforeunload event to warn about unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (
        confirm('You have unsaved changes. Are you sure you want to leave?')
      ) {
        router.push('/dashboard/blogs');
      }
    } else {
      router.push('/dashboard/blogs');
    }
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Professional Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Posts
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-brand-blue-50 rounded-xl">
                <FileText className="h-6 w-6 text-brand-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                  {isNewPost
                    ? 'Create New Post'
                    : `Edit: ${postData?.title || 'Untitled'}`}
                </h1>
                <p className="text-gray-600 font-inter">
                  {isNewPost
                    ? 'Write and publish your blog post'
                    : 'Edit your blog post content'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 text-amber-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {postData?.published ? (
                <Badge
                  variant="default"
                  className="bg-brand-green-100 text-brand-green-700"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Published
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-brand-amber-100 text-brand-amber-700"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Draft
                </Badge>
              )}
            </div>

            {!isNewPost && postData?.slug && (
              <Button variant="outline" size="sm" asChild className="gap-2 border-brand-blue-300 text-brand-blue-600 hover:bg-brand-blue-50">
                <a
                  href={`/blog/${postData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Professional Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <BlogPostForm
            postToEdit={postData}
            onFormChange={handleFormChange}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
