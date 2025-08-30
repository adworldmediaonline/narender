import { notFound } from 'next/navigation';

import { getAllCategories, getBlogById } from '@/lib/server/blog';
import EditBlogForm from './edit-blog-form';

export default async function EditBlogPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
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
