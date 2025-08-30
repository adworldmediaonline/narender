'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

import { getCategoryById, updateCategory } from '@/lib/actions/blog';
import type { BlogCategory, BlogCategoryFormData } from '@/lib/types/blog';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [currentCategory, setCurrentCategory] = useState<BlogCategory | null>(
    null
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Auto-generate slug from name
  const name = form.watch('name');
  const slug = name ? slugify(name, { lower: true, strict: true }) : '';

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsFetching(true);
        const result = await getCategoryById(categoryId);
        if (!result.success || !result.category) {
          toast.error('Category not found');
          router.push('/dashboard/categories');
          return;
        }

        const category = result.category;
        setCurrentCategory(category);

        // Set form values
        form.reset({
          name: category.name,
          description: category.description || '',
        });
      } catch (error) {
        toast.error('Failed to load category data');
        router.push('/dashboard/categories');
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [categoryId, form, router]);

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

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true);

      const categoryData: BlogCategoryFormData = {
        ...values,
        bannerImage,
      };

      const result = await updateCategory(categoryId, categoryData);

      if (result.success) {
        toast.success('Category updated successfully!');
        router.push('/dashboard/categories');
      } else {
        toast.error(result.error || 'Failed to update category');
      }
    } catch (error) {
      toast.error('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-48 bg-muted rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">
            Update your category information
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
            <CardDescription>
              Update the basic information for your category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                            disabled={isLoading}
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
                          disabled={isLoading}
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

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} size="lg">
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
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banner Image</CardTitle>
            <CardDescription>
              Update the banner image for this category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentCategory?.bannerImage && !bannerImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={currentCategory.bannerImage.url}
                      alt={currentCategory.bannerImage.alt}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Current banner image</p>
                  </div>
                </div>
              ) : bannerImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(bannerImage)}
                      alt="Category banner preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">{bannerImage.name}</p>
                    <p className="text-xs">
                      {(bannerImage.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Upload new banner image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="category-banner"
                  />
                  <div className="mt-4">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <label htmlFor="category-banner">Choose File</label>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
