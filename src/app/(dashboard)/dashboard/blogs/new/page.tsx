'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createBlog, getAllCategories } from '@/lib/actions/blog';
import { useEffect } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  h1: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().array().default([]),
  excerpt: z.string().optional(),
  description: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().array().default([]),
  imageAltText: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// Categories will be loaded from the server

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

export default function NewBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        if (result.success) {
          setCategories(result.categories);
        } else {
          toast.error('Failed to load categories');
        }
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<FormData>({
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
      categoryId: '',
      tags: [],
      imageAltText: '',
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

  const handleImageUpload = (file: File, type: 'blog' | 'banner') => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (type === 'blog') {
      setBlogImage(file);
    } else {
      setBannerImage(file);
    }
  };

  const removeImage = (type: 'blog' | 'banner') => {
    if (type === 'blog') {
      setBlogImage(null);
    } else {
      setBannerImage(null);
    }
  };

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true);

      const blogData: BlogFormData = {
        ...values,
        blogImage,
        bannerImage,
        tags: selectedTags.map(tag => tag.value),
      };

      const result = await createBlog(blogData);

      if (result.success) {
        toast.success('Blog created successfully!');
        router.push('/dashboard/blogs');
      } else {
        toast.error(result.error || 'Failed to create blog');
      }
    } catch (error) {
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
            Write and publish your blog post
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
                    Fill in the main content and metadata for your blog post.
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
                              defaultValue={field.value}
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
                          <Input placeholder="SEO title" {...field} />
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
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoriesLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading categories...
                              </SelectItem>
                            ) : categories.length === 0 ? (
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
                          <MultiSelector
                            values={selectedTags}
                            onValuesChange={setSelectedTags}
                            loop
                            className="w-full"
                          >
                            <MultiSelectorTrigger>
                              <MultiSelectorInput placeholder="Select tags..." />
                            </MultiSelectorTrigger>
                            <MultiSelectorContent>
                              <MultiSelectorList>
                                {mockTags.map(tag => (
                                  <MultiSelectorItem
                                    key={tag.value}
                                    value={tag.value}
                                  >
                                    {tag.label}
                                  </MultiSelectorItem>
                                ))}
                              </MultiSelectorList>
                            </MultiSelectorContent>
                          </MultiSelector>
                        </FormControl>
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blog Image</FormLabel>
                        <FormControl>
                          {blogImage ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(blogImage)}
                                alt="Blog preview"
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => removeImage('blog')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4 text-center">
                              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Upload blog image
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, 'blog');
                                }}
                                className="hidden"
                                id="blog-image"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <label htmlFor="blog-image">Choose File</label>
                              </Button>
                            </div>
                          )}
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
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          {bannerImage ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(bannerImage)}
                                alt="Banner preview"
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => removeImage('banner')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4 text-center">
                              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Upload banner image
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, 'banner');
                                }}
                                className="hidden"
                                id="banner-image"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <label htmlFor="banner-image">
                                  Choose File
                                </label>
                              </Button>
                            </div>
                          )}
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
