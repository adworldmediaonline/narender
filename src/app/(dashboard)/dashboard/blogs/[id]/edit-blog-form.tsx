'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
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
import { MultiSelect } from '@/components/ui/multi-select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { updateBlog } from '@/lib/actions/blog';
import type { Blog, EditBlogFormData } from '@/lib/types/blog';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  h1: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().array().optional().default([]),
  excerpt: z.string().optional(),
  description: z
    .string()
    .min(1, 'Content is required')
    .refine(html => {
      // Remove HTML tags and check if there's actual content
      const textContent = html.replace(/<[^>]*>/g, '').trim();
      return textContent.length > 0;
    }, 'Content cannot be empty'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  blogImage: z
    .any()
    .nullable() // Allow null for edit form (can keep existing image)
    .optional(),
  bannerImage: z
    .any()
    .nullable() // Allow null for edit form (can keep existing image)
    .optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().array().min(1, 'At least one tag is required'),
  imageAltText: z.string().optional(),
});

// Mock tags - replace with actual data
const mockTags = [
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'guide', label: 'Guide' },
];

interface EditBlogFormProps {
  blog: Blog;
  categories: Array<{ id: string; name: string }>;
}

export default function EditBlogForm({ blog, categories }: EditBlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const form = useForm<EditBlogFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog.title,
      h1: blog.h1 || '',
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      metaKeywords: blog.metaKeywords,
      excerpt: blog.excerpt || '',
      description: blog.description,
      status: blog.status,
      categoryId: blog.categoryId,
      tags: blog.tags,
      imageAltText: blog.imageAltText || '',
    },
  });

  // Auto-generate slug from title
  const title = form.watch('title');
  const slug = title ? slugify(title, { lower: true, strict: true }) : '';

  // Auto-generate meta fields from title and excerpt
  const handleAutoFillMeta = () => {
    const currentTitle = form.getValues('title');
    const currentExcerpt = form.getValues('excerpt');

    if (currentTitle && !form.getValues('metaTitle')) {
      form.setValue('metaTitle', currentTitle);
    }

    if (currentExcerpt && !form.getValues('metaDescription')) {
      form.setValue('metaDescription', currentExcerpt.slice(0, 160));
    }

    if (currentTitle && !form.getValues('h1')) {
      form.setValue('h1', currentTitle);
    }
  };

  async function onSubmit(values: EditBlogFormData) {
    try {
      setIsLoading(true);

      const blogData: EditBlogFormData = {
        ...values,
        blogImage: blogImage || undefined,
        bannerImage: bannerImage || undefined,
      };

      const result = await updateBlog(blog.id, blogData);

      if (result.success) {
        toast.success('Blog updated successfully!');
        router.push('/dashboard/blogs');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update blog');
      }
    } catch {
      toast.error('Failed to update blog');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog</h1>
          <p className="text-muted-foreground">
            Update your blog post information
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Content</CardTitle>
                  <CardDescription>
                    Update the main content and metadata for your blog post.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter blog title"
                                disabled={isLoading}
                                {...field}
                                onBlur={handleAutoFillMeta}
                              />
                            </FormControl>
                            <FormDescription>
                              The main title of your blog post
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
                          placeholder="blog-slug"
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          URL-friendly version of your title
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="h1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>H1 Heading</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="H1 heading for SEO"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="PUBLISHED">
                                  Published
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief summary of your blog post (for previews)"
                              className="resize-none"
                              rows={3}
                              disabled={isLoading}
                              {...field}
                              onBlur={handleAutoFillMeta}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content *</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              {...field}
                              placeholder="Write your blog content here..."
                              size="lg"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SEO title"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Recommended: 50-60 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="SEO description"
                            className="resize-none"
                            rows={2}
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Recommended: 150-160 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Keywords</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="keyword1, keyword2, keyword3"
                            disabled={isLoading}
                            {...field}
                            onChange={e => {
                              const keywords = e.target.value
                                .split(',')
                                .map(k => k.trim())
                                .filter(Boolean);
                              field.onChange(keywords);
                            }}
                            value={field.value?.join(', ') || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Category & Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.length === 0 ? (
                              <SelectItem value="no-categories" disabled>
                                No categories available
                              </SelectItem>
                            ) : (
                              categories.map(category => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={mockTags}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select tags..."
                            name={field.name}
                          />
                        </FormControl>
                        <FormDescription>
                          Select relevant tags for your blog post.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Blog Image */}
                  <FormField
                    control={form.control}
                    name="blogImage"
                    render={() => (
                      <FormItem>
                        <FormLabel>Blog Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Current Image Display */}
                            {blog.blogImage &&
                              typeof blog.blogImage === 'object' &&
                              'url' in blog.blogImage &&
                              !blogImage && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Current Image
                                  </label>
                                  <div className="relative aspect-video w-full rounded-lg border overflow-hidden">
                                    <Image
                                      src={blog.blogImage.url as string}
                                      alt={
                                        (blog.blogImage.altText as string) ||
                                        'Blog image'
                                      }
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                              )}

                            {/* New Image Preview */}
                            {blogImage && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  New Image Preview
                                </label>
                                <div className="relative aspect-video w-full rounded-lg border overflow-hidden">
                                  <Image
                                    src={URL.createObjectURL(blogImage)}
                                    alt="New blog preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setBlogImage(null)}
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
                                    // Validate file size (5MB limit)
                                    if (file.size > 5 * 1024 * 1024) {
                                      toast.error(
                                        'Image size should be less than 5MB'
                                      );
                                      return;
                                    }

                                    // Validate file type
                                    if (!file.type.startsWith('image/')) {
                                      toast.error(
                                        'Please select a valid image file'
                                      );
                                      return;
                                    }

                                    setBlogImage(file);
                                  }
                                }}
                                disabled={isLoading}
                              />
                              <p className="text-xs text-muted-foreground">
                                Upload a new image to replace the current one.
                                Max size: 5MB. Recommended: 800x400px
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Banner Image */}
                  <FormField
                    control={form.control}
                    name="bannerImage"
                    render={() => (
                      <FormItem>
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Current Image Display */}
                            {blog.bannerImage &&
                              typeof blog.bannerImage === 'object' &&
                              'url' in blog.bannerImage &&
                              !bannerImage && (
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Current Image
                                  </label>
                                  <div className="relative aspect-video w-full rounded-lg border overflow-hidden">
                                    <Image
                                      src={blog.bannerImage.url as string}
                                      alt={
                                        (blog.bannerImage.altText as string) ||
                                        'Banner image'
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
                                    // Validate file size (5MB limit)
                                    if (file.size > 5 * 1024 * 1024) {
                                      toast.error(
                                        'Image size should be less than 5MB'
                                      );
                                      return;
                                    }

                                    // Validate file type
                                    if (!file.type.startsWith('image/')) {
                                      toast.error(
                                        'Please select a valid image file'
                                      );
                                      return;
                                    }

                                    setBannerImage(file);
                                  }
                                }}
                                disabled={isLoading}
                              />
                              <p className="text-xs text-muted-foreground">
                                Upload a new image to replace the current one.
                                Max size: 5MB. Recommended: 1200x400px
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageAltText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe the image for accessibility"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Blog
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
