'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  X,
  Save,
  Settings,
  FileText,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface DistractionFreeEditorProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  onTitleChange: (title: string) => void;
  autoSaveEnabled?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

export function DistractionFreeEditor({
  title,
  content,
  isOpen,
  onClose,
  onSave,
  onTitleChange,
  autoSaveEnabled = true,
  onImageUpload,
}: DistractionFreeEditorProps) {
  const [localContent, setLocalContent] = useState(content || '');
  const [localTitle, setLocalTitle] = useState(title || '');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showWordCount, setShowWordCount] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [maxWidth, setMaxWidth] = useState(800);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Sync local state with props when they change
  useEffect(() => {
    if (content !== undefined) {
      setLocalContent(content || '');
    }
    if (title !== undefined) {
      setLocalTitle(title || '');
    }
  }, [content, title]);

  // Reset editor state when opening
  useEffect(() => {
    if (isOpen) {
      setIsEditorReady(false);
      // Small delay to ensure content is set before editor initializes
      setTimeout(() => {
        setIsEditorReady(true);
      }, 100);
    }
  }, [isOpen]);

  // Calculate stats
  useEffect(() => {
    const words = localContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = localContent.length;
    const readTime = Math.ceil(words / 200); // Average reading speed: 200 words/min
    
    setWordCount(words);
    setCharCount(chars);
    setReadingTime(readTime);
  }, [localContent]);

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (!autoSaveEnabled || !localContent) return;

    const saveTimer = setTimeout(() => {
      onSave(localContent);
      setLastSaved(new Date());
    }, 15000); // Save after 15 seconds of inactivity

    return () => clearTimeout(saveTimer);
  }, [localContent, autoSaveEnabled, onSave]);

  // Handle title changes
  useEffect(() => {
    const titleTimer = setTimeout(() => {
      if (localTitle !== title) {
        onTitleChange(localTitle);
      }
    }, 3000);

    return () => clearTimeout(titleTimer);
  }, [localTitle, title, onTitleChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave(localContent);
        setLastSaved(new Date());
      }
      // Escape to exit
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [localContent, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex flex-col",
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
        "transition-colors duration-200"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-6 py-4 border-b",
        isDarkMode ? "border-gray-800" : "border-gray-200"
      )}>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={cn(
              "rounded-full",
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            )}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Distraction-Free Mode</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Keyboard shortcuts hint */}
          <span className="text-xs text-muted-foreground hidden sm:block">
            Press <kbd className="px-1 py-0.5 text-xs rounded bg-muted">Esc</kbd> to exit
          </span>

          {/* Save indicator */}
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}

          {/* Settings dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "rounded-full",
                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                )}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Dark mode toggle */}
              <DropdownMenuItem 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="cursor-pointer"
              >
                {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </DropdownMenuItem>

              {/* Font size */}
              <div className="px-2 py-1.5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">Font Size</Label>
                  <span className="text-sm text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={([value]) => setFontSize(value)}
                  min={14}
                  max={24}
                  step={1}
                  className="cursor-pointer"
                />
              </div>

              {/* Line height */}
              <div className="px-2 py-1.5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">Line Height</Label>
                  <span className="text-sm text-muted-foreground">{lineHeight}</span>
                </div>
                <Slider
                  value={[lineHeight]}
                  onValueChange={([value]) => setLineHeight(value)}
                  min={1.2}
                  max={2}
                  step={0.1}
                  className="cursor-pointer"
                />
              </div>

              {/* Max width */}
              <div className="px-2 py-1.5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">Content Width</Label>
                  <span className="text-sm text-muted-foreground">{maxWidth}px</span>
                </div>
                <Slider
                  value={[maxWidth]}
                  onValueChange={([value]) => setMaxWidth(value)}
                  min={600}
                  max={1200}
                  step={50}
                  className="cursor-pointer"
                />
              </div>

              {/* Word count toggle */}
              <DropdownMenuItem 
                onClick={() => setShowWordCount(!showWordCount)}
                className="cursor-pointer"
              >
                {showWordCount ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showWordCount ? 'Hide Stats' : 'Show Stats'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fullscreen toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className={cn(
              "rounded-full",
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            )}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>

          {/* Save button */}
          <Button
            onClick={() => {
              if (!localContent || localContent.trim() === '') {
                toast.error('Cannot save empty content');
                return;
              }
              console.log('Saving content:', localContent.substring(0, 100) + '...');
              onSave(localContent);
              setLastSaved(new Date());
              toast.success('Content saved', {
                duration: 1500,
                position: 'bottom-right',
              });
            }}
            size="sm"
            className="rounded-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 overflow-y-auto">
        <div 
          className="mx-auto px-6 py-8"
          style={{ maxWidth: `${maxWidth}px` }}
        >
          {/* Title input */}
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            placeholder="Enter your title..."
            className={cn(
              "w-full text-4xl font-bold mb-8 bg-transparent border-none outline-none placeholder:text-muted-foreground",
              isDarkMode ? "text-gray-100" : "text-gray-900"
            )}
            style={{ 
              fontSize: `${fontSize * 2}px`,
              lineHeight: lineHeight,
            }}
          />

          {/* Content editor */}
          <div 
            style={{ 
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
          >
            {isEditorReady && (
              <TiptapEditor
                key={`editor-${isOpen}-${content?.substring(0, 20)}`}
                initialContent={localContent}
                onChange={(html) => {
                  console.log('Editor content changed:', html.substring(0, 100) + '...');
                  setLocalContent(html);
                }}
                placeholder="Start writing your story..."
                className={cn(
                  "border-none shadow-none",
                  isDarkMode ? "prose-invert" : ""
                )}
                autoFocus
                onImageUpload={onImageUpload}
              />
            )}
            {!isEditorReady && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-muted-foreground">Loading editor...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with stats */}
      {showWordCount && (
        <div className={cn(
          "flex items-center justify-center gap-6 px-6 py-3 border-t text-sm text-muted-foreground",
          isDarkMode ? "border-gray-800" : "border-gray-200"
        )}>
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
      )}
    </div>
  );
}