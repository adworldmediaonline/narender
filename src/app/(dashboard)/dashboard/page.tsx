'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import {
  Clock,
  Edit,
  Eye,
  FileText,
  FolderOpen,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getDashboardStats } from '@/lib/actions/blog';

interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalCategories: number;
  recentBlogs: Array<{
    id: string;
    title: string;
    status: string;
    category: {
      name: string;
    };
    createdAt: Date;
  }>;
  categoriesWithCount: Array<{
    name: string;
    _count: {
      blogs: number;
    };
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const result = await getDashboardStats();
        if (result.success && result.stats) {
          setStats(result.stats);
        } else {
          toast.error('Failed to load dashboard stats');
        }
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-8 w-12 bg-muted rounded animate-pulse"></div>
                <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4 border rounded"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
                        <div className="h-5 w-12 bg-muted rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <div className="space-y-4">
                <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-12 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your blog.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.publishedBlogs}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.publishedBlogs / stats.totalBlogs) * 100)}%
              published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.draftBlogs}
            </div>
            <p className="text-xs text-muted-foreground">Ready for review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">Blog organization</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Blogs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Blogs</CardTitle>
            <CardDescription>
              Your latest blog posts and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBlogs.map(blog => (
                <div
                  key={blog.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {blog.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {blog.category.name}
                      </Badge>
                      <Badge
                        variant={
                          blog.status === 'PUBLISHED' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {blog.status.toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(blog.createdAt, 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${blog.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/blogs/${blog.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/blogs">View All Blogs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Blog distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.categoriesWithCount.slice(0, 5).map((category, index) => {
                const colors = [
                  'bg-blue-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-orange-500',
                  'bg-red-500',
                ];
                return (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colors[index % colors.length]
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {category._count.blogs} blogs
                    </Badge>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/categories">Manage Categories</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to help you manage your blog efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/dashboard/blogs/new">
                <Plus className="h-6 w-6" />
                <span className="text-sm">New Blog</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/dashboard/categories/new">
                <FolderOpen className="h-6 w-6" />
                <span className="text-sm">New Category</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/dashboard/blogs">
                <FileText className="h-6 w-6" />
                <span className="text-sm">All Blogs</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/dashboard/categories">
                <Users className="h-6 w-6" />
                <span className="text-sm">Categories</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
