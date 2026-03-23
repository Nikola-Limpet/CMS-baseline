'use client';

import { useState, useEffect, useCallback } from 'react';
import { blogsApi } from '@/lib/api/blogs';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { BlogCategoryTagSelect } from './BlogCategoryTagSelect';
import { BlogPost } from '@/db/schema';
import { generateSlug as generateUrlSlug } from '@/lib/utils';
import { 
  Save, 
  Globe, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  Tag as TagIcon, 
  FolderOpen,
  Loader2,
  Plus,
  CalendarClock,
  // Maximize2, // Temporarily disabled with distraction-free mode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeaturedImageUpload } from '@/components/common/FeaturedImageUpload';
// import { DistractionFreeEditor } from './DistractionFreeEditor'; // Temporarily disabled
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Enhanced form validation schema
const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must not exceed 255 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z
    .string()
    .max(500, 'Excerpt must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  published: z.boolean(),
  categoryIds: z
    .array(z.string())
    .min(1, 'Please select at least one category'),
  tagIds: z.array(z.string()),
  coverImage: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  slug: z.string().optional(),
  scheduledPublishAt: z.union([z.date(), z.null()]).default(null),
  publishNow: z.boolean().default(true),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface ImprovedBlogPostFormProps {
  postToEdit?:
    | (BlogPost & {
        categories?: Category[];
        tags?: Tag[];
      })
    | null;
  onFormChange?: () => void;
  onSave?: () => void;
}

export default function ImprovedBlogPostForm({
  postToEdit = null,
  onFormChange,
  onSave,
}: ImprovedBlogPostFormProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setIsDraftSaving] = useState(false);
  const [, setLastSaved] = useState<Date | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = useState(false);
  const [createItemType, setCreateItemType] = useState<'category' | 'tag' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [isSubmittingNewItem, setIsSubmittingNewItem] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [completionScore, setCompletionScore] = useState(0);
  // const [isDistractionFreeMode, setIsDistractionFreeMode] = useState(false); // Temporarily disabled
  const [currentPostId, setCurrentPostId] = useState<string | null>(postToEdit?.id || null);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema) as any,
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      published: false,
      slug: '',
      categoryIds: [],
      tagIds: [],
      scheduledPublishAt: null,
      publishNow: true,
    },
  });

  // Reset form when postToEdit changes
  useEffect(() => {
    console.log('🔄 Form reset useEffect triggered with postToEdit:', {
      hasPostToEdit: !!postToEdit,
      postId: postToEdit?.id,
      postTitle: postToEdit?.title,
    });

    if (postToEdit) {
      const resetData = {
        title: postToEdit.title || '',
        content: postToEdit.content || '',
        excerpt: postToEdit.excerpt || '',
        coverImage: postToEdit.coverImage || '',
        published: postToEdit.published ?? false,
        slug: postToEdit.slug || '',
        categoryIds: postToEdit.categories?.map(c => c.id) || [],
        tagIds: postToEdit.tags?.map(t => t.id) || [],
        scheduledPublishAt: postToEdit.scheduledPublishAt ? new Date(postToEdit.scheduledPublishAt) : null,
        publishNow: !postToEdit.scheduledPublishAt,
      };
      
      console.log('📝 Resetting form with data:', resetData);
      form.reset(resetData);
    } else {
      // Reset to empty form for new posts
      console.log('🆕 Resetting form for new post');
      form.reset({
        title: '',
        content: '',
        excerpt: '',
        coverImage: '',
        published: false,
        slug: '',
        categoryIds: [],
        tagIds: [],
        scheduledPublishAt: null,
        publishNow: true,
      });
    }
  }, [postToEdit, form]);

  const watchedValues = form.watch();
  const [autoSaveEnabled] = useState(true);
  const [, setLastAutoSave] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Calculate completion score
  useEffect(() => {
    let score = 0;
    const fields = [
      { key: 'title', weight: 20 },
      { key: 'content', weight: 30 },
      { key: 'excerpt', weight: 15 },
      { key: 'coverImage', weight: 15 },
      { key: 'categoryIds', weight: 10 },
      { key: 'tagIds', weight: 10 },
    ];

    fields.forEach(field => {
      const value = watchedValues[field.key as keyof BlogPostFormData];
      if (value && (Array.isArray(value) ? value.length > 0 : value.toString().length > 0)) {
        score += field.weight;
      }
    });

    setCompletionScore(score);
  }, [watchedValues]);

  // Calculate word count and reading time
  useEffect(() => {
    const content = watchedValues.content || '';
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;
    const time = Math.ceil(count / 200); // Average reading speed

    setWordCount(count);
    setReadingTime(time);
  }, [watchedValues.content]);

  // Auto-save draft functionality
  const autosaveDraft = useCallback(async (overrideContent?: string, overrideTitle?: string) => {
    const title = overrideTitle || watchedValues.title;
    const content = overrideContent || watchedValues.content;
    
    if (!user || !title || !content || !autoSaveEnabled) return;
    
    setIsDraftSaving(true);
    try {
      const formData = {
        title: title,
        content: content,
        user_id: user.id,
        categories: watchedValues.categoryIds,
        tags: watchedValues.tagIds,
        published: false, // Always save as draft for auto-save
        excerpt: watchedValues.excerpt || undefined,
        cover_image: watchedValues.coverImage || undefined,
      };

      if (postToEdit || currentPostId) {
        // For existing posts, maintain current publish status
        const postId = postToEdit?.id || currentPostId;
        await blogsApi.posts.update(postId!, { 
          ...formData, 
          published: postToEdit?.published || false 
        });
        setLastAutoSave(new Date());
        // Remove the toast notification for autosave updates - it's too frequent
        // The UI already shows save status indicators
      } else {
        // For new posts, create as draft
        const result = await blogsApi.posts.create(formData);
        // Update the form to reflect that we now have a saved post
        if (result && result.id) {
          // Update the current post ID so subsequent saves will update instead of create
          setCurrentPostId(result.id);
          // Update URL without navigation
          window.history.replaceState({}, '', `/dashboard/blogs/${result.id}/edit`);
          setLastAutoSave(new Date());
          // Only show toast for initial draft creation
          toast.success('Draft created', {
            duration: 1500,
            position: 'bottom-right',
          });
        }
      }
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsDraftSaving(false);
    }
  }, [user, watchedValues, postToEdit, currentPostId, autoSaveEnabled]);

  // Debounced auto-save on content changes
  useEffect(() => {
    if (!autoSaveEnabled || !user) return;
    
    // Don't auto-save if minimal content
    if (!watchedValues.title || watchedValues.title.length < 3) return;
    if (!watchedValues.content || watchedValues.content.length < 10) return;
    
    // Debounce auto-save - wait 10 seconds after user stops typing
    const timer = setTimeout(() => {
      autosaveDraft();
    }, 10000);

    return () => clearTimeout(timer);
  }, [watchedValues.title, watchedValues.content, watchedValues.excerpt, 
      watchedValues.coverImage, watchedValues.categoryIds, watchedValues.tagIds,
      autoSaveEnabled, autosaveDraft, user]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        blogsApi.categories.getAll(),
        blogsApi.tags.getAll(),
      ]);

      if (Array.isArray(categoriesRes)) {
        setCategories(categoriesRes);
      }

      if (Array.isArray(tagsRes)) {
        setTags(tagsRes);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load categories and tags. Please refresh the page.');
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Watch for form changes and call onFormChange callback
  useEffect(() => {
    const subscription = form.watch(() => {
      onFormChange?.();
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedValues.title && !postToEdit) {
      const slug = generateUrlSlug(watchedValues.title);
      form.setValue('slug', slug);
    }
  }, [watchedValues.title, form, postToEdit]);

  // Warn user about unsaved changes when leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !autoSaveEnabled) {
        e.preventDefault();
        // For compatibility with all browsers
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        (e as any).returnValue = message; // Type assertion to avoid deprecation warning
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, autoSaveEnabled]);

  const openCreateItemDialog = (type: 'category' | 'tag') => {
    setCreateItemType(type);
    setNewItemName('');
    setNewItemDescription('');
    setIsCreateItemDialogOpen(true);
  };

  const handleCreateNewItem = async () => {
    if (!newItemName.trim()) return;

    setIsSubmittingNewItem(true);
    try {
      if (createItemType === 'category') {
        const newCategory = await blogsApi.categories.create({
          name: newItemName.trim(),
          description: newItemDescription.trim() || undefined,
        });
        setCategories(prev => [...prev, newCategory]);
        form.setValue('categoryIds', [...watchedValues.categoryIds, newCategory.id]);
        toast.success('Category created successfully');
      } else if (createItemType === 'tag') {
        const newTag = await blogsApi.tags.create({
          name: newItemName.trim(),
        });
        setTags(prev => [...prev, newTag]);
        form.setValue('tagIds', [...watchedValues.tagIds, newTag.id]);
        toast.success('Tag created successfully');
      }
      setIsCreateItemDialogOpen(false);
    } catch (error) {
      console.error('Error creating new item:', error);
      toast.error(`Failed to create ${createItemType}`);
    } finally {
      setIsSubmittingNewItem(false);
    }
  };

  const onSubmit = async (data: BlogPostFormData) => {
    console.log('🚀 onSubmit called with data:', data);
    console.log('👤 Current user:', { 
      id: user?.id, 
      isLoaded: user !== null, 
      hasUser: !!user 
    });

    if (!user || !user.id) {
      console.error('❌ No user found or user not loaded');
      toast.error('You must be logged in to create or edit blog posts');
      return;
    }

    console.log('✅ User authenticated, proceeding with submission');
    setIsSubmitting(true);

    try {
      const formData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || undefined,
        cover_image: data.coverImage || undefined, // Use snake_case as expected by API
        published: data.published && data.publishNow, // Only publish if not scheduled
        published_at: data.published && data.publishNow ? new Date().toISOString() : undefined,
        scheduled_publish_at: !data.publishNow && data.scheduledPublishAt ? data.scheduledPublishAt.toISOString() : undefined,
        user_id: user.id,
        slug: data.slug || generateUrlSlug(data.title),
        categories: data.categoryIds,
        tags: data.tagIds,
      };

      console.log('📝 Submitting form data:', formData);

      if (postToEdit) {
        console.log('🔄 Updating existing post:', postToEdit.id);
        await blogsApi.posts.update(postToEdit.id, formData);
        toast.success('Blog post updated successfully');
      } else {
        console.log('✨ Creating new post');
        const result = await blogsApi.posts.create(formData);
        console.log('📄 Created post:', result);
        toast.success('Blog post created successfully');
      }

      console.log('✅ Post saved successfully, navigating to dashboard');
      setHasUnsavedChanges(false);
      onSave?.();
      router.push('/dashboard/blogs');
      router.refresh();
    } catch (error: any) {
      console.error('❌ Error saving blog post:', error);

      const msg = error?.message || '';
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        toast.error('Authentication expired. Please sign in again.');
      } else {
        toast.error(msg || 'Failed to save blog post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    // Trigger form validation
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Please fix the form errors before saving');
      return;
    }

    const values = form.getValues();
    await onSubmit({ ...values, published: false });
  };

  const handlePublish = async () => {
    // Trigger form validation
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Please fix the form errors before publishing');
      return;
    }

    const values = form.getValues();
    await onSubmit({ ...values, published: true });
  };

  // Debug logging
  console.log('🎨 ImprovedBlogPostForm rendered with:', {
    hasPostToEdit: !!postToEdit,
    postId: postToEdit?.id,
    postTitle: postToEdit?.title,
    hasContent: !!postToEdit?.content,
    contentLength: postToEdit?.content?.length || 0,
    hasCoverImage: !!postToEdit?.coverImage,
    coverImage: postToEdit?.coverImage,
    published: postToEdit?.published,
    categoriesCount: postToEdit?.categories?.length || 0,
    tagsCount: postToEdit?.tags?.length || 0,
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)}>
          {/* Compact Stats Bar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-3">
              <Progress value={completionScore} className="w-32 h-2" />
              <span className="text-xs font-medium text-blue-600">{completionScore}%</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {wordCount} words
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min read
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Main Content Column */}
            <div className="space-y-5 min-w-0">
              {/* Title */}
              <Card>
                <CardContent className="pt-5 pb-4 space-y-3">
                  <FormField
                    control={form.control as any}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter an engaging title..."
                            {...field}
                            className="text-xl font-semibold h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <FormDescription className="text-xs">
                            {field.value?.length || 0}/255 characters
                          </FormDescription>
                          {watchedValues.title && (
                            <span className="text-xs text-muted-foreground font-mono truncate max-w-[60%]">
                              /blog/{watchedValues.slug || generateUrlSlug(watchedValues.title)}
                            </span>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardContent className="p-0">
                  <FormField
                    control={form.control as any}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TiptapEditor
                            initialContent={field.value}
                            onChange={(html) => field.onChange(html)}
                            placeholder="Start writing your blog post content here..."
                            onImageUpload={async (file) => {
                              const { uploadToS3 } = await import('@/lib/utils/s3-client');
                              const result = await uploadToS3({ file, prefix: 'blog-content-images' });
                              return result.url;
                            }}
                          />
                        </FormControl>
                        <FormMessage className="px-4 pb-3" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Excerpt</CardTitle>
                  <CardDescription className="text-xs">
                    A brief summary for blog listings and social shares
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <FormField
                    control={form.control as any}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Write a compelling excerpt..."
                            className="resize-none min-h-[80px]"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {(field.value?.length || 0)}/500 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar — sticky on scroll */}
            <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
              {/* Publish Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Publishing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control as any}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">
                              Publish Status
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Show scheduling options when publish is enabled */}
                    {watchedValues.published && (
                      <div className="space-y-4 animate-in slide-in-from-top-2">
                        <FormField
                          control={form.control as any}
                          name="publishNow"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Publishing Time</FormLabel>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="publish-now"
                                    checked={field.value}
                                    onChange={() => field.onChange(true)}
                                    className="h-4 w-4"
                                  />
                                  <Label htmlFor="publish-now" className="font-normal cursor-pointer">
                                    Publish immediately
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="schedule-later"
                                    checked={!field.value}
                                    onChange={() => field.onChange(false)}
                                    className="h-4 w-4"
                                  />
                                  <Label htmlFor="schedule-later" className="font-normal cursor-pointer">
                                    Schedule for later
                                  </Label>
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Date/Time Picker for Scheduled Posts */}
                        {!watchedValues.publishNow && (
                          <FormField
                            control={form.control as any}
                            name="scheduledPublishAt"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Schedule Date & Time</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarClock className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                          format(field.value, "PPP p")
                                        ) : (
                                          <span>Pick a date & time</span>
                                        )}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                      mode="single"
                                      selected={field.value || undefined}
                                      onSelect={(date) => {
                                        if (date) {
                                          // Preserve time if already set, otherwise set to current time
                                          const currentTime = field.value || new Date();
                                          date.setHours(currentTime.getHours());
                                          date.setMinutes(currentTime.getMinutes());
                                          field.onChange(date);
                                        } else {
                                          field.onChange(null);
                                        }
                                      }}
                                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                    <div className="p-3 border-t">
                                      <Label htmlFor="time-input" className="text-sm">Time</Label>
                                      <Input
                                        id="time-input"
                                        type="time"
                                        value={field.value ? format(field.value, "HH:mm") : ""}
                                        onChange={(e) => {
                                          const [hours, minutes] = e.target.value.split(':');
                                          const newDate = field.value || new Date();
                                          newDate.setHours(parseInt(hours));
                                          newDate.setMinutes(parseInt(minutes));
                                          field.onChange(newDate);
                                        }}
                                        className="mt-2"
                                      />
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  Post will be automatically published at this time
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button
                      type="button"
                      onClick={handleSaveDraft}
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePublish}
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : watchedValues.published && !watchedValues.publishNow ? (
                        <CalendarClock className="h-4 w-4 mr-2" />
                      ) : (
                        <Globe className="h-4 w-4 mr-2" />
                      )}
                      {watchedValues.published && !watchedValues.publishNow ? 'Schedule Post' : 'Publish Post'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Categories
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => openCreateItemDialog('category')}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control as any}
                    name="categoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <BlogCategoryTagSelect
                            type="category"
                            items={categories}
                            selectedItems={field.value}
                            onSelect={field.onChange}
                            canAddNew={true}
                            onAttemptAddNew={() => openCreateItemDialog('category')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4" />
                      Tags
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => openCreateItemDialog('tag')}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control as any}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <BlogCategoryTagSelect
                            type="tag"
                            items={tags}
                            selectedItems={field.value}
                            onSelect={field.onChange}
                            canAddNew={true}
                            onAttemptAddNew={() => openCreateItemDialog('tag')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Featured Image */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control as any}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FeaturedImageUpload 
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>

      {/* Create Category/Tag Dialog */}
      <Dialog open={isCreateItemDialogOpen} onOpenChange={setIsCreateItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create New {createItemType === 'category' ? 'Category' : 'Tag'}
            </DialogTitle>
            <DialogDescription>
              Add a new {createItemType} to organize your blog posts better.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`Enter ${createItemType} name`}
              />
            </div>
            {createItemType === 'category' && (
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="Enter category description"
                  className="resize-none"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleCreateNewItem}
              disabled={!newItemName.trim() || isSubmittingNewItem}
            >
              {isSubmittingNewItem && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create {createItemType === 'category' ? 'Category' : 'Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Distraction-Free Editor - Temporarily disabled due to content sync issues */}
      {/* <DistractionFreeEditor
        isOpen={isDistractionFreeMode}
        title={watchedValues.title}
        content={watchedValues.content}
        onClose={() => setIsDistractionFreeMode(false)}
        onSave={async (content) => {
          console.log('Distraction-free save called with content:', content?.substring(0, 100));
          // Update form value first
          form.setValue('content', content, { shouldValidate: true, shouldDirty: true });
          // Small delay to ensure form is updated
          await new Promise(resolve => setTimeout(resolve, 100));
          // Trigger auto-save with the new content directly
          autosaveDraft(content, form.getValues('title'));
        }}
        onTitleChange={(title) => {
          form.setValue('title', title);
        }}
        autoSaveEnabled={autoSaveEnabled}
        onImageUpload={async (file) => {
          const { uploadToS3 } = await import('@/lib/utils/s3-client');
          const result = await uploadToS3({ file, prefix: 'blog-content-images' });
          return result.url;
        }}
      /> */}
    </div>
  );
}
