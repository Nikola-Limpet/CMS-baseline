'use client';

import { useState, useRef } from 'react';
import { testimonialsApi } from '@/lib/api/testimonials';
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
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Loader2, Star, ImageIcon, UploadIcon } from 'lucide-react';
import { uploadToS3 } from '@/lib/utils/s3-client';
import Image from 'next/image';
import type { Testimonial } from '@/db/schema';

const testimonialFormSchema = z.object({
  authorName: z.string().min(1, 'Author name is required').max(255),
  authorTitle: z.string().max(255).optional().or(z.literal('')),
  authorImage: z.string().url().optional().or(z.literal('')),
  content: z.string().min(3, 'Testimonial content is required'),
  rating: z.number().int().min(1).max(5).nullable(),
  featured: z.boolean(),
  published: z.boolean(),
  displayOrder: z.number().int(),
});

type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

interface TestimonialFormProps {
  testimonialToEdit?: Testimonial | null;
}

export default function TestimonialForm({ testimonialToEdit = null }: TestimonialFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema) as any,
    defaultValues: {
      authorName: testimonialToEdit?.authorName || '',
      authorTitle: testimonialToEdit?.authorTitle || '',
      authorImage: testimonialToEdit?.authorImage || '',
      content: testimonialToEdit?.content || '',
      rating: testimonialToEdit?.rating ?? null,
      featured: testimonialToEdit?.featured ?? false,
      published: testimonialToEdit?.published ?? false,
      displayOrder: testimonialToEdit?.displayOrder ?? 0,
    },
  });

  const watchedRating = form.watch('rating');

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);
    try {
      const formData = {
        author_name: data.authorName,
        author_title: data.authorTitle || undefined,
        author_image: data.authorImage || undefined,
        content: data.content,
        rating: data.rating ?? undefined,
        featured: data.featured,
        published: data.published,
        display_order: data.displayOrder,
      };

      if (testimonialToEdit) {
        await testimonialsApi.update(testimonialToEdit.id, formData);
        toast.success('Testimonial updated');
      } else {
        await testimonialsApi.create(formData);
        toast.success('Testimonial created');
      }

      router.push('/dashboard/testimonials');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return; }
    setIsUploadingAvatar(true);
    try {
      const result = await uploadToS3({ file, prefix: 'testimonial-avatars' });
      form.setValue('authorImage', result.url);
      toast.success('Avatar uploaded');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)}>
          {/* Top Action Bar */}
          <div className="sticky top-0 z-30 bg-background border-b border-border">
            <div className="max-w-3xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => router.push('/dashboard/testimonials')} className="p-1.5 rounded-md hover:bg-muted transition-colors">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
                <span className="text-sm font-medium text-foreground">
                  {testimonialToEdit ? 'Edit Testimonial' : 'New Testimonial'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => router.push('/dashboard/testimonials')} className="rounded-lg">
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting} className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

            {/* Author Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control as any}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-semibold text-foreground">
                      Author Name <span className="text-red-500">*</span>
                    </label>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="authorTitle"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-sm font-semibold text-foreground">Role / Company</label>
                    <FormControl>
                      <Input placeholder="CTO at Acme Inc." {...field} value={field.value || ''} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Avatar */}
            <FormField
              control={form.control as any}
              name="authorImage"
              render={({ field }) => (
                <FormItem>
                  <label className="text-sm font-semibold text-foreground">Avatar</label>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={field.value || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {form.watch('authorName')?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAvatarUpload(file);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={isUploadingAvatar}
                        >
                          {isUploadingAvatar ? (
                            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                          ) : (
                            <UploadIcon className="h-4 w-4 mr-1.5" />
                          )}
                          Upload
                        </Button>
                        {field.value && (
                          <Button type="button" variant="ghost" size="sm" className="ml-2 text-muted-foreground" onClick={() => field.onChange('')}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
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
                    Testimonial <span className="text-red-500">*</span>
                  </label>
                  <FormControl>
                    <Textarea
                      placeholder="Write the testimonial quote..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating */}
            <FormField
              control={form.control as any}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <label className="text-sm font-semibold text-foreground">Rating</label>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(field.value === star ? null : star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              watchedRating && star <= watchedRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/30 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                      {watchedRating && (
                        <span className="text-xs text-muted-foreground ml-2">{watchedRating}/5</span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Order */}
            <FormField
              control={form.control as any}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <label className="text-sm font-semibold text-foreground">
                    Display Order{' '}
                    <span className="font-normal text-muted-foreground">(lower = shown first)</span>
                  </label>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="h-10 w-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggles */}
            <div className="flex items-center gap-8">
              <FormField
                control={form.control as any}
                name="published"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <label className="text-sm font-medium text-foreground">Published</label>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="featured"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <label className="text-sm font-medium text-foreground">Featured on homepage</label>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
