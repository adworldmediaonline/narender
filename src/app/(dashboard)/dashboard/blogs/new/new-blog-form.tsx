'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
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
import {
  ImageUpload,
  ImageUploadContent,
  ImageUploadError,
  ImageUploadPreview,
  ImageUploadTrigger,
} from '@/components/ui/image-upload';
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
import { createBlog } from '@/lib/actions/blog';
import type { CreateBlogFormData } from '@/lib/types/blog';
import { toast } from 'sonner';

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
  blogImage: z.any().refine(file => file !== null && file !== undefined, {
    message: 'Blog image is required',
  }),
  bannerImage: z.any().refine(file => file !== null && file !== undefined, {
    message: 'Banner image is required',
  }),
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

interface NewBlogFormProps {
  categories: Array<{ id: string; name: string }>;
}

export default function NewBlogForm({ categories }: NewBlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateBlogFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      h1: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      excerpt: '',
      description: '',
      status: 'DRAFT',
      blogImage: null,
      bannerImage: null,
      categoryId: '',
      tags: [],
      imageAltText: '',
    },
  });

  // Auto-generate slug from title
  const title = form.watch('title');
  const slug = title ? slugify(title, { lower: true, strict: true }) : '';

  // No need for custom handlers - FormControl handles this automatically

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

  async function onSubmit(values: CreateBlogFormData) {
    try {
      setIsLoading(true);

      // Form validation already ensures images are present
      const blogData: CreateBlogFormData = {
        ...values,
      };

      const result = await createBlog(blogData);

      if (result.success) {
        toast.success('Blog created successfully!');
        router.push('/dashboard/blogs');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create blog');
      }
    } catch {
      toast.error('Failed to create blog');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-7xl">
      {/* Header Section */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Blog
            </h1>
            <p className="text-muted-foreground">
              Create engaging content for your audience
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Essential details for your blog post
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                  </CardContent>
                </Card>

                {/* Content Editor Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content Editor</CardTitle>
                    <CardDescription>
                      Write your blog post content using our rich text editor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                {/* SEO Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>SEO Settings</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Optional
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Optimize your blog for search engines
                    </CardDescription>
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
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>Organization</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Required
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Categorize and tag your blog post
                    </CardDescription>
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
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>Images</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        Required
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Upload images for your blog post
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Blog Image */}
                    <FormField
                      control={form.control}
                      name="blogImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blog Image *</FormLabel>
                          <FormControl>
                            <ImageUpload
                              {...field}
                              maxSize={1 * 1024 * 1024} // 1MB
                              disabled={isLoading}
                              className="w-full"
                            >
                              <ImageUploadPreview />
                              <ImageUploadTrigger>
                                <ImageUploadContent />
                              </ImageUploadTrigger>
                              <ImageUploadError />
                            </ImageUpload>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Banner Image */}
                    <FormField
                      control={form.control}
                      name="bannerImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banner Image *</FormLabel>
                          <FormControl>
                            <ImageUpload
                              {...field}
                              maxSize={1 * 1024 * 1024} // 1MB
                              disabled={isLoading}
                              className="w-full"
                            >
                              <ImageUploadPreview />
                              <ImageUploadTrigger>
                                <ImageUploadContent />
                              </ImageUploadTrigger>
                              <ImageUploadError />
                            </ImageUpload>
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
                              placeholder="Describe the images for accessibility"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Important for SEO and accessibility
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Section */}
            <div className="lg:col-span-3">
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">Ready to publish?</h3>
                      <p className="text-sm text-muted-foreground">
                        Review your blog post and publish when ready
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Create Blog
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
