import { getAllCategories } from '@/lib/server/blog';
import NewBlogForm from './new-blog-form';

export default async function NewBlogPage() {
  const categoriesResult = await getAllCategories();

  if (!categoriesResult.success) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Blog
            </h1>
            <p className="text-muted-foreground text-red-600">
              Failed to load categories. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <NewBlogForm categories={categoriesResult.categories} />;
}
