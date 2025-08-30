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

// Mock data - replace with actual data fetching
const stats = {
  totalBlogs: 24,
  publishedBlogs: 18,
  draftBlogs: 6,
  totalCategories: 8,
  recentBlogs: [
    {
      id: '1',
      title: 'Getting Started with Next.js 15',
      status: 'PUBLISHED',
      category: 'Technology',
      createdAt: new Date('2024-01-15'),
      views: 1234,
    },
    {
      id: '2',
      title: 'Building Modern Web Applications',
      status: 'DRAFT',
      category: 'Development',
      createdAt: new Date('2024-01-10'),
      views: 0,
    },
    {
      id: '3',
      title: 'UI/UX Best Practices',
      status: 'PUBLISHED',
      category: 'Design',
      createdAt: new Date('2024-01-08'),
      views: 856,
    },
  ],
  categories: [
    { name: 'Technology', count: 8, color: 'bg-blue-500' },
    { name: 'Development', count: 6, color: 'bg-green-500' },
    { name: 'Design', count: 5, color: 'bg-purple-500' },
    { name: 'Tutorial', count: 3, color: 'bg-orange-500' },
    { name: 'News', count: 2, color: 'bg-red-500' },
  ],
};

export default function DashboardPage() {
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
                        {blog.category}
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
                      {blog.views > 0 && ` • ${blog.views} views`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${blog.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/blogs/${blog.id}/edit`}>
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
              {stats.categories.map(category => (
                <div
                  key={category.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <Badge variant="outline">{category.count} blogs</Badge>
                </div>
              ))}
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
