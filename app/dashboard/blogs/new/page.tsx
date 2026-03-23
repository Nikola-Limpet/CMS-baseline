import { Metadata } from 'next';
import BlogPostForm from '@/components/dashboard/blogs/BlogPostForm';

export const metadata: Metadata = {
  title: 'Create Blog Post - CMS Dashboard',
  description: 'Create a new blog post for CMS',
};

export default function NewBlogPostPage() {
  return <BlogPostForm postToEdit={null} />;
}
