'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { BlogCategoryTagSelect } from './BlogCategoryTagSelect';
import { BlogPost } from '@/db/schema';
import { generateSlug as generateUrlSlug } from '@/lib/utils';
import {
  X,
  Loader2,
  Plus,
  ImageIcon,
  UploadIcon,
} from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { uploadToS3 } from '@/lib/utils/s3-client';
import Image from 'next/image';

// Validation schema
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
  categoryIds: z.array(z.string()),
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

interface BlogPostFormProps {
  postToEdit?:
    | (BlogPost & {
        categories?: Category[];
        tags?: Tag[];
      })
    | null;
  onFormChange?: () => void;
  onSave?: () => void;
}

export default function BlogPostForm({
  postToEdit = null,
  onFormChange,
  onSave,
}: BlogPostFormProps) {
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
  const [currentPostId, setCurrentPostId] = useState<string | null>(postToEdit?.id || null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
    if (postToEdit) {
      form.reset({
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
      });
    } else {
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

  // Auto-save draft
  const autosaveDraft = useCallback(async (overrideContent?: string, overrideTitle?: string) => {
    const title = overrideTitle || watchedValues.title;
    const content = overrideContent || watchedValues.content;

    if (!user || !title || !content || !autoSaveEnabled) return;

    setIsDraftSaving(true);
    try {
      const formData = {
        title,
        content,
        user_id: user.id,
        categories: watchedValues.categoryIds,
        tags: watchedValues.tagIds,
        published: false,
        excerpt: watchedValues.excerpt || undefined,
        cover_image: watchedValues.coverImage || undefined,
      };

      if (postToEdit || currentPostId) {
        const postId = postToEdit?.id || currentPostId;
        await blogsApi.posts.update(postId!, {
          ...formData,
          published: postToEdit?.published || false,
        });
        setLastAutoSave(new Date());
      } else {
        const result = await blogsApi.posts.create(formData);
        if (result && result.id) {
          setCurrentPostId(result.id);
          window.history.replaceState({}, '', `/dashboard/blogs/${result.id}/edit`);
          setLastAutoSave(new Date());
          toast.success('Draft created', { duration: 1500, position: 'bottom-right' });
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

  // Debounced auto-save
  useEffect(() => {
    if (!autoSaveEnabled || !user) return;
    if (!watchedValues.title || watchedValues.title.length < 3) return;
    if (!watchedValues.content || watchedValues.content.length < 10) return;

    const timer = setTimeout(() => { autosaveDraft(); }, 10000);
    return () => clearTimeout(timer);
  }, [watchedValues.title, watchedValues.content, watchedValues.excerpt,
      watchedValues.coverImage, watchedValues.categoryIds, watchedValues.tagIds,
      autoSaveEnabled, autosaveDraft, user]);

  // Load categories and tags
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          blogsApi.categories.getAll(),
          blogsApi.tags.getAll(),
        ]);
        if (Array.isArray(categoriesRes)) setCategories(categoriesRes);
        if (Array.isArray(tagsRes)) setTags(tagsRes);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load categories and tags.');
      }
    };
    loadInitialData();
  }, []);

  // Watch for form changes
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
      form.setValue('slug', generateUrlSlug(watchedValues.title));
    }
  }, [watchedValues.title, form, postToEdit]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !autoSaveEnabled) {
        e.preventDefault();
        (e as any).returnValue = 'You have unsaved changes.';
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
        toast.success('Category created');
      } else if (createItemType === 'tag') {
        const newTag = await blogsApi.tags.create({ name: newItemName.trim() });
        setTags(prev => [...prev, newTag]);
        form.setValue('tagIds', [...watchedValues.tagIds, newTag.id]);
        toast.success('Tag created');
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
    if (!user || !user.id) {
      toast.error('You must be logged in to create or edit blog posts');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || undefined,
        cover_image: data.coverImage || undefined,
        published: data.published && data.publishNow,
        published_at: data.published && data.publishNow ? new Date().toISOString() : undefined,
        scheduled_publish_at: !data.publishNow && data.scheduledPublishAt ? data.scheduledPublishAt.toISOString() : undefined,
        user_id: user.id,
        slug: data.slug || generateUrlSlug(data.title),
        categories: data.categoryIds,
        tags: data.tagIds,
      };

      if (postToEdit) {
        await blogsApi.posts.update(postToEdit.id, formData);
        toast.success('Blog post updated');
      } else {
        await blogsApi.posts.create(formData);
        toast.success('Blog post created');
      }

      setHasUnsavedChanges(false);
      onSave?.();
      router.push('/dashboard/blogs');
      router.refresh();
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        toast.error('Authentication expired. Please sign in again.');
      } else {
        toast.error(msg || 'Failed to save blog post.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    const isValid = await form.trigger();
    if (!isValid) { toast.error('Please fix the form errors before saving'); return; }
    const values = form.getValues();
    await onSubmit({ ...values, published: false });
  };

  const handlePublish = async () => {
    const isValid = await form.trigger();
    if (!isValid) { toast.error('Please fix the form errors before publishing'); return; }
    const values = form.getValues();
    await onSubmit({ ...values, published: true });
  };

  const handleCoverUpload = async (file: File, onChange: (url: string) => void) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }
    setIsUploadingCover(true);
    try {
      const result = await uploadToS3({ file, prefix: 'blog-images' });
      onChange(result.url);
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/dashboard/blogs');
      }
    } else {
      router.push('/dashboard/blogs');
    }
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)}>

          {/* ─── Top Action Bar ─── */}
          <div className="sticky top-0 z-30 bg-background border-b border-border">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
                <span className="text-sm font-medium text-foreground">
                  {postToEdit ? 'Edit Article' : 'Article Page'}
                </span>
                {hasUnsavedChanges && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Unsaved
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                  Publish
                </Button>
              </div>
            </div>
          </div>

          {/* ─── Form Body ─── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-x-10 gap-y-8">

              {/* ═══ Left Column — Content ═══ */}
              <div className="space-y-6 min-w-0">

                {/* Title */}
                <FormField
                  control={form.control as any}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Title{' '}
                        <span className="font-normal text-muted-foreground">(Name your blog)</span>
                      </label>
                      <FormControl>
                        <Input
                          placeholder="Enter an engaging title..."
                          {...field}
                          className="h-11 text-base border-border focus:border-primary focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content */}
                <FormField
                  control={form.control as any}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Content{' '}
                        <span className="font-normal text-muted-foreground">(Write your blog post)</span>
                      </label>
                      <FormControl>
                        <div className="border border-border rounded-lg overflow-hidden">
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
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ═══ Right Column — Sidebar ═══ */}
              <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">

                {/* Slug */}
                <FormField
                  control={form.control as any}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Slug{' '}
                        <span className="font-normal text-muted-foreground">(Select a slug for this blog)</span>
                      </label>
                      <FormControl>
                        <Input
                          placeholder="your-post-slug"
                          {...field}
                          className="h-10 font-mono text-sm border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Excerpt */}
                <FormField
                  control={form.control as any}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Excerpt{' '}
                        <span className="font-normal text-muted-foreground">(Add a short excerpt to summarize this post)</span>
                      </label>
                      <FormControl>
                        <Textarea
                          placeholder="Write a compelling excerpt..."
                          className="resize-none min-h-[100px] border-border"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control as any}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-foreground">
                          Category{' '}
                          <span className="font-normal text-muted-foreground">(Select a category your blog belongs.)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => openCreateItemDialog('category')}
                          className="p-1 rounded hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </div>
                      <FormControl>
                        <BlogCategoryTagSelect
                          type="category"
                          items={categories}
                          selectedItems={field.value}
                          onSelect={field.onChange}
                          canAddNew
                          onAttemptAddNew={() => openCreateItemDialog('category')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control as any}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-foreground">
                          Tags{' '}
                          <span className="font-normal text-muted-foreground">(Add tags to organize your post)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => openCreateItemDialog('tag')}
                          className="p-1 rounded hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </div>
                      <FormControl>
                        <BlogCategoryTagSelect
                          type="tag"
                          items={tags}
                          selectedItems={field.value}
                          onSelect={field.onChange}
                          canAddNew
                          onAttemptAddNew={() => openCreateItemDialog('tag')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date */}
                <FormField
                  control={form.control as any}
                  name="scheduledPublishAt"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Date{' '}
                        <span className="font-normal text-muted-foreground">(The date you would like to show for this post)</span>
                      </label>
                      <FormControl>
                        <DatePicker
                          date={field.value || undefined}
                          onSelect={(date) => field.onChange(date || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cover Image */}
                <FormField
                  control={form.control as any}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Cover Image
                      </label>
                      <FormControl>
                        <div>
                          {field.value ? (
                            <div className="relative group">
                              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                                <Image
                                  src={field.value}
                                  alt="Cover image preview"
                                  fill
                                  className="object-cover"
                                  onError={() => {
                                    toast.error('Failed to load image');
                                    field.onChange('');
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                      field.onChange('');
                                      if (coverInputRef.current) coverInputRef.current.value = '';
                                    }}
                                    className="text-white bg-red-600 hover:bg-red-700"
                                  >
                                    <X className="h-4 w-4 mr-1.5" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center transition-colors hover:border-muted-foreground/50 hover:bg-muted/50 cursor-pointer"
                              onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) handleCoverUpload(file, field.onChange);
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onClick={() => coverInputRef.current?.click()}
                            >
                              <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleCoverUpload(file, field.onChange);
                                }}
                              />
                              {isUploadingCover ? (
                                <div className="space-y-2">
                                  <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                                  <p className="text-xs text-muted-foreground">Uploading...</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/50" />
                                  <p className="text-xs text-muted-foreground">
                                    Drag and Drop Images or
                                  </p>
                                  <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                                    <UploadIcon className="h-3 w-3" />
                                    Upload Image
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Author */}
                {user && (
                  <div>
                    <label className="text-sm font-semibold text-foreground">
                      Author{' '}
                      <span className="font-normal text-muted-foreground">(The writer of this post)</span>
                    </label>
                    <div className="flex items-center gap-3 mt-2 p-3 rounded-lg border border-border">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email || ''}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* ─── Create Category/Tag Dialog ─── */}
      <Dialog open={isCreateItemDialogOpen} onOpenChange={setIsCreateItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create New {createItemType === 'category' ? 'Category' : 'Tag'}
            </DialogTitle>
            <DialogDescription>
              Add a new {createItemType} to organize your blog posts.
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
    </div>
  );
}
