'use client';

import { useState, useEffect, useRef } from 'react';
import { eventsApi } from '@/lib/api/events';
import { authClient } from '@/lib/auth/client';
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
import { EventCategorySelect } from './EventCategorySelect';
import { generateSlug as generateUrlSlug } from '@/lib/utils';
import {
  X,
  Loader2,
  Plus,
  ImageIcon,
  UploadIcon,
  ChevronDown,
  Search,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { uploadToS3 } from '@/lib/utils/s3-client';
import Image from 'next/image';
import type { Event } from '@/db/schema';

const eventFormSchema = z.object({
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
  coverImage: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  slug: z.string().optional(),
  eventDate: z.date({ required_error: 'Event date is required' }),
  eventEndDate: z.union([z.date(), z.null()]).default(null),
  location: z.string().max(255).optional().or(z.literal('')),
  registrationUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  // SEO
  metaTitle: z.string().max(255).optional().or(z.literal('')),
  metaDescription: z.string().max(500).optional().or(z.literal('')),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  noIndex: z.boolean().default(false),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface EventPostFormProps {
  eventToEdit?: (Event & { categories?: string[] }) | null;
}

export default function EventPostForm({ eventToEdit = null }: EventPostFormProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      published: false,
      slug: '',
      categoryIds: [],
      eventDate: new Date(),
      eventEndDate: null,
      location: '',
      registrationUrl: '',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      noIndex: false,
    },
  });

  // Reset form when eventToEdit changes
  useEffect(() => {
    if (eventToEdit) {
      form.reset({
        title: eventToEdit.title || '',
        content: eventToEdit.content || '',
        excerpt: eventToEdit.excerpt || '',
        coverImage: eventToEdit.coverImage || '',
        published: eventToEdit.published ?? false,
        slug: eventToEdit.slug || '',
        categoryIds: eventToEdit.categories || [],
        eventDate: new Date(eventToEdit.eventDate),
        eventEndDate: eventToEdit.eventEndDate ? new Date(eventToEdit.eventEndDate) : null,
        location: eventToEdit.location || '',
        registrationUrl: eventToEdit.registrationUrl || '',
        metaTitle: (eventToEdit as any).metaTitle || '',
        metaDescription: (eventToEdit as any).metaDescription || '',
        canonicalUrl: (eventToEdit as any).canonicalUrl || '',
        noIndex: (eventToEdit as any).noIndex ?? false,
      });
    }
  }, [eventToEdit, form]);

  const watchedValues = form.watch();

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await eventsApi.categories.getAll();
        if (Array.isArray(res)) setCategories(res);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedValues.title && !eventToEdit) {
      form.setValue('slug', generateUrlSlug(watchedValues.title));
    }
  }, [watchedValues.title, form, eventToEdit]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        (e as any).returnValue = 'You have unsaved changes.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsSubmittingCategory(true);
    try {
      const newCategory = await eventsApi.categories.create({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      });
      setCategories(prev => [...prev, newCategory]);
      form.setValue('categoryIds', [...watchedValues.categoryIds, newCategory.id]);
      toast.success('Category created');
      setIsCreateCategoryOpen(false);
      setNewCategoryName('');
      setNewCategoryDescription('');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    if (!user || !user.id) {
      toast.error('You must be logged in to create or edit events');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || undefined,
        cover_image: data.coverImage || undefined,
        published: data.published,
        user_id: user.id,
        slug: data.slug || generateUrlSlug(data.title),
        categories: data.categoryIds,
        event_date: data.eventDate.toISOString(),
        event_end_date: data.eventEndDate ? data.eventEndDate.toISOString() : undefined,
        location: data.location || undefined,
        registration_url: data.registrationUrl || undefined,
        // SEO
        meta_title: data.metaTitle || undefined,
        meta_description: data.metaDescription || undefined,
        canonical_url: data.canonicalUrl || undefined,
        no_index: data.noIndex,
      };

      if (eventToEdit) {
        await eventsApi.posts.update(eventToEdit.id, formData);
        toast.success('Event updated');
      } else {
        await eventsApi.posts.create(formData);
        toast.success('Event created');
      }

      setHasUnsavedChanges(false);
      router.push('/dashboard/events');
      router.refresh();
    } catch (error: any) {
      const msg = error?.message || '';
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        toast.error('Authentication expired. Please sign in again.');
      } else {
        toast.error(msg || 'Failed to save event.');
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
      const result = await uploadToS3({ file, prefix: 'event-images' });
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
        router.push('/dashboard/events');
      }
    } else {
      router.push('/dashboard/events');
    }
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)}>

          {/* Top Action Bar */}
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
                  {eventToEdit ? 'Edit Event' : 'New Event'}
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
                  Save Draft
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

          {/* Form Body */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-x-10 gap-y-8">

              {/* Left Column — Content */}
              <div className="space-y-6 min-w-0">

                {/* Title */}
                <FormField
                  control={form.control as any}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Title{' '}
                        <span className="font-normal text-muted-foreground">(Name your event)</span>
                      </label>
                      <FormControl>
                        <Input
                          placeholder="Enter event title..."
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
                        <span className="font-normal text-muted-foreground">(Describe your event)</span>
                      </label>
                      <FormControl>
                        <div className="border border-border rounded-lg overflow-hidden">
                          <TiptapEditor
                            initialContent={field.value}
                            onChange={(html) => field.onChange(html)}
                            placeholder="Write event details, agenda, speakers..."
                            onImageUpload={async (file) => {
                              const { uploadToS3: upload } = await import('@/lib/utils/s3-client');
                              const result = await upload({ file, prefix: 'event-content-images' });
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

              {/* Right Column — Sidebar */}
              <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">

                {/* Slug */}
                <FormField
                  control={form.control as any}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">Slug</label>
                      <FormControl>
                        <Input
                          placeholder="your-event-slug"
                          {...field}
                          className="h-10 font-mono text-sm border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event Date */}
                <FormField
                  control={form.control as any}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <FormControl>
                        <DatePicker
                          date={field.value || undefined}
                          onSelect={(date) => field.onChange(date || new Date())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Event End Date */}
                <FormField
                  control={form.control as any}
                  name="eventEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        End Date{' '}
                        <span className="font-normal text-muted-foreground">(optional)</span>
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

                {/* Location */}
                <FormField
                  control={form.control as any}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Location{' '}
                        <span className="font-normal text-muted-foreground">(optional)</span>
                      </label>
                      <FormControl>
                        <Input
                          placeholder="e.g. Conference Center, Online"
                          {...field}
                          value={field.value || ''}
                          className="h-10 border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Registration URL */}
                <FormField
                  control={form.control as any}
                  name="registrationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-sm font-semibold text-foreground">
                        Registration URL{' '}
                        <span className="font-normal text-muted-foreground">(optional)</span>
                      </label>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          value={field.value || ''}
                          className="h-10 border-border"
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
                        <span className="font-normal text-muted-foreground">(short summary)</span>
                      </label>
                      <FormControl>
                        <Textarea
                          placeholder="Write a brief summary..."
                          className="resize-none min-h-[80px] border-border"
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
                        <label className="text-sm font-semibold text-foreground">Category</label>
                        <button
                          type="button"
                          onClick={() => {
                            setNewCategoryName('');
                            setNewCategoryDescription('');
                            setIsCreateCategoryOpen(true);
                          }}
                          className="p-1 rounded hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </div>
                      <FormControl>
                        <EventCategorySelect
                          items={categories}
                          selectedItems={field.value}
                          onSelect={field.onChange}
                          canAddNew
                          onAttemptAddNew={() => setIsCreateCategoryOpen(true)}
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
                      <label className="text-sm font-semibold text-foreground">Cover Image</label>
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

                {/* SEO Settings */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold text-foreground py-2 hover:text-primary transition-colors">
                    <span className="flex items-center gap-2">
                      <Search className="h-3.5 w-3.5" />
                      SEO Settings
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform [[data-state=open]_&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-2">
                    <FormField
                      control={form.control as any}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-xs text-muted-foreground">
                            Meta Title <span className="text-muted-foreground/60">({(field.value || '').length}/60)</span>
                          </label>
                          <FormControl>
                            <Input
                              placeholder="Override page title for search engines"
                              {...field}
                              value={field.value || ''}
                              className="h-9 text-sm border-border"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-xs text-muted-foreground">
                            Meta Description <span className="text-muted-foreground/60">({(field.value || '').length}/155)</span>
                          </label>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description for search results"
                              className="resize-none min-h-[70px] text-sm border-border"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="canonicalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-xs text-muted-foreground">Canonical URL</label>
                          <FormControl>
                            <Input
                              placeholder="https://..."
                              {...field}
                              value={field.value || ''}
                              className="h-9 text-sm border-border"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="noIndex"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-muted-foreground">Hide from search engines</label>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                {/* Author */}
                {user && (
                  <div>
                    <label className="text-sm font-semibold text-foreground">Author</label>
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

      {/* Create Category Dialog */}
      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="cat-desc">Description (optional)</Label>
              <Textarea
                id="cat-desc"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Enter category description"
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || isSubmittingCategory}
            >
              {isSubmittingCategory && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
