import { notFound } from 'next/navigation';

import { getCategoryById } from '@/lib/server/blog';
import EditCategoryForm from './edit-category-form';

export default async function EditCategoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const result = await getCategoryById(params.id);

  if (!result.success || !result.category) {
    notFound();
  }

  return <EditCategoryForm category={result.category} />;
}
