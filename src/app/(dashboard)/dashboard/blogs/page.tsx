import { getBlogs } from '@/lib/server/blog';
import BlogsTable from './blogs-table';

export default async function BlogsPage() {
  const result = await getBlogs();

  if (!result.success) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Blog Management
            </h1>
            <p className="text-muted-foreground text-red-600">
              Failed to load blogs. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <BlogsTable initialBlogs={result.blogs} />;
}
