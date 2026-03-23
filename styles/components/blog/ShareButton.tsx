'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Simple toast implementation
const showToast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // Create a simple toast notification
    if (typeof window !== 'undefined') {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }
  },
  error: (message: string) => {
    console.error('❌ Error:', message);
    if (typeof window !== 'undefined') {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }
  }
};

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export default function ShareButton({ 
  url, 
  title, 
  description = '', 
  className = '',
  variant = 'outline',
  size = 'sm'
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    url: typeof window !== 'undefined' ? window.location.origin + url : url,
    title,
    text: description,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error occurred
        console.log('Share cancelled or failed');
      }
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedTitle = encodeURIComponent(shareData.title);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      showToast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast.error('Failed to copy link');
    }
  };

  // Check if native sharing is available
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share;

  if (hasNativeShare) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleNativeShare}
        className={className}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleSocialShare('facebook')}>
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('twitter')}>
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare('linkedin')}>
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Link Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2 text-gray-600" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}