import { Metadata } from 'next';
import ImprovedBlogPostForm from '@/components/dashboard/blogs/ImprovedBlogPostForm';

export const metadata: Metadata = {
  title: 'Create Blog Post - MOVE Dashboard',
  description: 'Create a new blog post for MOVE',
};

export default function NewBlogPostPage() {
  return (
    <div className="flex-1 min-h-screen bg-gray-50/30">
      <div className="max-w-6xl mx-auto">
        <ImprovedBlogPostForm postToEdit={null} />
      </div>
    </div>
  );
}
