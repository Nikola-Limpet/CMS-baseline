'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';

// Simple toast implementation
const showToast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
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

interface SimpleSaveButtonProps {
  postId: string;
  postTitle: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
}

export default function SimpleSaveButton({ 
  postId, 
  postTitle, 
  className = '',
  variant = 'outline',
  size = 'sm',
  showText = true
}: SimpleSaveButtonProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isLoaded = !isPending;
  const isSignedIn = !!user;
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if post is saved on component mount
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      checkIfSaved();
    }
  }, [user, postId, isLoaded, isSignedIn]);

  const checkIfSaved = async () => {
    if (!user?.id) {
      console.log('🚫 No user ID, cannot check saved status');
      return;
    }

    try {
      const storageKey = `saved_post_${postId}_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      const isSavedState = saved === 'true';
      console.log('🔍 Checking saved status', { storageKey, saved, isSavedState });
      setIsSaved(isSavedState);
    } catch (error) {
      console.error('❌ Error checking saved status:', error);
    }
  };

  const handleSave = async () => {
    console.log('🔄 SimpleSaveButton clicked', { 
      user: !!user, 
      isLoaded, 
      isSignedIn, 
      userId: user?.id,
      postId, 
      postTitle 
    });
    
    // Wait for auth to load if it hasn't yet
    if (!isLoaded) {
      console.log('⏳ Auth still loading, please wait...');
      showToast.error('Loading... Please try again in a moment');
      return;
    }
    
    if (!isSignedIn || !user?.id) {
      console.log('🚫 User not signed in or user ID not available');
      showToast.error('Please sign in to save articles');
      return;
    }

    setIsLoading(true);
    
    try {
      const newSavedState = !isSaved;
      const storageKey = `saved_post_${postId}_${user.id}`;
      
      console.log('💾 Updating save state', { newSavedState, storageKey });
      
      if (newSavedState) {
        localStorage.setItem(storageKey, 'true');
        localStorage.setItem(`${storageKey}_title`, postTitle);
        localStorage.setItem(`${storageKey}_date`, new Date().toISOString());
        showToast.success('Article saved!');
        console.log('✅ Article saved to localStorage');
      } else {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}_title`);
        localStorage.removeItem(`${storageKey}_date`);
        showToast.success('Article removed from saved');
        console.log('🗑️ Article removed from localStorage');
      }
      
      setIsSaved(newSavedState);
    } catch (error) {
      showToast.error('Failed to save article');
      console.error('❌ Error saving post:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Button
      variant={isSaved ? 'default' : variant}
      size={size}
      onClick={handleSave}
      disabled={isLoading}
      className={`${className} ${isSaved ? 'bg-red-500 hover:bg-red-600 text-white' : ''} transition-all duration-200`}
      title={isSaved ? 'Remove from saved' : 'Save article'}
    >
      {isLoading ? (
        <>
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
          {showText && 'Saving...'}
        </>
      ) : isSaved ? (
        <>
          <Heart className="h-4 w-4 mr-2 fill-current" />
          {showText && 'Saved'}
        </>
      ) : (
        <>
          <Heart className="h-4 w-4 mr-2" />
          {showText && 'Save'}
        </>
      )}
    </Button>
  );
}