import { getCategories } from '@/lib/server/blog';
import CategoriesTable from './categories-table';

export default async function CategoriesPage() {
  const result = await getCategories();

  if (!result.success) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground text-red-600">
              Failed to load categories. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <CategoriesTable initialCategories={result.categories} />;
}
