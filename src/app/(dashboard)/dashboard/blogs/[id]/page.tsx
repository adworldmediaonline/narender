import { notFound } from 'next/navigation';

import { getAllCategories, getBlogById } from '@/lib/server/blog';
import EditBlogForm from './edit-blog-form';

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const [blogResult, categoriesResult] = await Promise.all([
    getBlogById(params.id),
    getAllCategories(),
  ]);

  if (!blogResult.success || !blogResult.blog) {
    notFound();
  }

  if (!categoriesResult.success) {
    notFound();
  }

  return (
    <EditBlogForm
      blog={blogResult.blog}
      categories={categoriesResult.categories}
    />
  );
}
