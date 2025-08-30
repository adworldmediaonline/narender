'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'slugify';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
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
  description: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  blogImage: z.any().refine(file => file !== null && file !== undefined, {
    message: 'Blog image is required',
  }),
  bannerImage: z.any().refine(file => file !== null && file !== undefined, {
    message: 'Banner image is required',
  }),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().array().optional().default([]),
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
  const [selectedTags, setSelectedTags] = useState<
    Array<{ value: string; label: string }>
  >([]);

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
        tags: selectedTags.map(tag => tag.value),
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
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/blogs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Blog</h1>
          <p className="text-muted-foreground">
            Create a new blog post for your audience
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
                    Create engaging content for your blog post.
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
                            <Textarea
                              placeholder="Write your blog content here..."
                              className="resize-none min-h-[200px]"
                              disabled={isLoading}
                              {...field}
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <MultiSelect
                      options={mockTags}
                      selected={selectedTags.map(tag => tag.value)}
                      onChange={selectedValues => {
                        const selectedTagsData = mockTags.filter(tag =>
                          selectedValues.includes(tag.value)
                        );
                        setSelectedTags(selectedTagsData);
                      }}
                      placeholder="Select tags..."
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTags.map(tag => (
                        <Badge
                          key={tag.value}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog Image *</FormLabel>
                        <FormControl>
                          <ImageUpload
                            {...field}
                            maxSize={5 * 1024 * 1024} // 5MB
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
                            maxSize={5 * 1024 * 1024} // 5MB
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
                  Create Blog
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
