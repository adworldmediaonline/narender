'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { updateCategory } from '@/lib/actions/blog';
import type { BlogCategory, BlogCategoryFormData } from '@/lib/types/blog';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  bannerImage: z.any().optional(),
});

interface EditCategoryFormProps {
  category: BlogCategory;
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const form = useForm<BlogCategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
    },
  });

  // Auto-generate slug from name
  const name = form.watch('name');
  const slug = name ? slugify(name, { lower: true, strict: true }) : '';

  const onSubmit = async (data: BlogCategoryFormData) => {
    try {
      setIsLoading(true);

      const formData: BlogCategoryFormData = {
        ...data,
        bannerImage: bannerImage || undefined,
      };

      const result = await updateCategory(category.id, formData);

      if (result.success) {
        toast.success('Category updated successfully!');
        router.push('/dashboard/categories');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update category');
      }
    } catch {
      toast.error('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/categories">
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">
            Update your category information and settings
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                  <CardDescription>
                    Basic information about your category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category name"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed as the category name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL Slug</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        /category/
                      </span>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {slug || 'category-slug'}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Auto-generated from category name
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter category description..."
                            className="min-h-32"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description of what this category represents
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Banner Image</CardTitle>
                  <CardDescription>
                    Upload a banner image for this category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="bannerImage"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Current Image Display */}
                            {category.bannerImage &&
                              typeof category.bannerImage === 'object' &&
                              'url' in category.bannerImage &&
                              !bannerImage && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Current Image
                                  </label>
                                  <div className="relative aspect-video w-full rounded-lg border overflow-hidden">
                                    <Image
                                      src={category.bannerImage.url as string}
                                      alt={
                                        (category.bannerImage
                                          .altText as string) ||
                                        'Category banner'
                                      }
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                              )}

                            {/* New Image Preview */}
                            {bannerImage && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  New Image Preview
                                </label>
                                <div className="relative aspect-video w-full rounded-lg border overflow-hidden">
                                  <Image
                                    src={URL.createObjectURL(bannerImage)}
                                    alt="New banner preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setBannerImage(null)}
                                  disabled={isLoading}
                                >
                                  Remove New Image
                                </Button>
                              </div>
                            )}

                            {/* Upload Input */}
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setBannerImage(file);
                                  }
                                }}
                                disabled={isLoading}
                              />
                              <p className="text-xs text-muted-foreground">
                                Upload a new image to replace the current one.
                                Recommended: 1200x400px
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Category
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
