'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
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
import { createCategory } from '@/lib/actions/blog';
import type { BlogCategoryFormData } from '@/lib/types/blog';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  bannerImage: z.any().optional(),
});

export default function NewCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const form = useForm<BlogCategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Auto-generate slug from name
  const name = form.watch('name');
  const slug = name ? slugify(name, { lower: true, strict: true }) : '';

  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setBannerImage(file);
  };

  const removeImage = () => {
    setBannerImage(null);
  };

  async function onSubmit(values: BlogCategoryFormData) {
    try {
      setIsLoading(true);

      const categoryData: BlogCategoryFormData = {
        ...values,
        bannerImage: bannerImage || undefined,
      };

      const result = await createCategory(categoryData);

      if (result.success) {
        toast.success('Category created successfully!');
        router.push('/dashboard/categories');
      } else {
        toast.error(result.error || 'Failed to create category');
      }
    } catch {
      toast.error('Failed to create category');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Category
          </h1>
          <p className="text-muted-foreground">
            Add a new category to organize your blog posts
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>
                  Basic information for your blog category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter category name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Display name for the category
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Slug (Auto-generated)
                      </label>
                      <Input
                        value={slug}
                        readOnly
                        placeholder="category-slug"
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        URL-friendly version of the name
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what this category is about..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional description to help users understand the
                          category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Banner Image</CardTitle>
                <CardDescription>
                  Optional banner image for the category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="bannerImage"
                    render={() => (
                      <FormItem>
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {form.watch('bannerImage') &&
                            form.watch('bannerImage') instanceof File ? (
                              <div className="relative">
                                <Image
                                  src={URL.createObjectURL(
                                    form.watch('bannerImage') as File
                                  )}
                                  alt="Preview"
                                  width={400}
                                  height={200}
                                  className="rounded-lg object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() =>
                                    form.setValue('bannerImage', undefined)
                                  }
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : null}
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  form.setValue('bannerImage', file);
                                }
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Category
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
