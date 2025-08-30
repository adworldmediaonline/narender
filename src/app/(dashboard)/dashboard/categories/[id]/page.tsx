import { notFound } from 'next/navigation';

import { getCategoryById } from '@/lib/server/blog';
import EditCategoryForm from './edit-category-form';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const result = await getCategoryById(params.id);

  if (!result.success || !result.category) {
    notFound();
  }

  return <EditCategoryForm category={result.category} />;
}
