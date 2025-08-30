# Admin Dashboard Setup Guide

## Environment Variables

Add these variables to your `.env` file:

### Database (Required)

```bash
DATABASE_URL="your-mongodb-connection-string"
```

### Cloudinary Configuration (Required for Image Uploads)

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Email Configuration (Optional - defaults to Ethereal)

```bash
EMAIL_PROVIDER=ethereal
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your App Name
```

### Better Auth (Optional)

```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up your environment variables** in `.env` file

3. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

4. **Push database schema:**

   ```bash
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Admin Access

To access the admin dashboard, you need to:

1. Sign up as a regular user
2. Manually update the user's role to 'admin' in the database
3. Sign in again to access admin features

## Features Overview

### Blog Management

- ✅ **Create/Edit/Delete** blogs with full content
- ✅ **SEO optimization** (meta title, description, keywords)
- ✅ **Image uploads** (blog image + banner image)
- ✅ **Category association** with dropdown selection
- ✅ **Tags system** with multi-select
- ✅ **Status management** (Draft/Published)
- ✅ **Auto-slug generation** from title

### Category Management

- ✅ **Create/Edit/Delete** categories
- ✅ **Banner image uploads**
- ✅ **Blog count tracking**
- ✅ **Auto-slug generation**

### Dashboard Features

- ✅ **Real-time statistics** (total blogs, published, drafts, categories)
- ✅ **Recent blogs** overview
- ✅ **Category distribution** with counts
- ✅ **Quick actions** for common tasks

### Technical Features

- ✅ **Server Actions** for all mutations (no API routes)
- ✅ **TypeScript** with full type safety
- ✅ **TanStack Table** with sorting, filtering, pagination
- ✅ **shadcn/ui** components throughout
- ✅ **Tailwind CSS v4** styling
- ✅ **NuQS** for URL state management (search/filter persistence)
- ✅ **Cloudinary integration** for image management
- ✅ **Responsive design** (mobile → desktop)
- ✅ **Loading states** and error handling
- ✅ **Toast notifications** for user feedback

## Production Deployment

### Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db push
```

### Environment Setup

- Set `NODE_ENV=production`
- Configure production database URL
- Set up Cloudinary production credentials
- Configure email provider for production

### Admin User Setup

After deployment, create an admin user by updating a user's role in the database:

```javascript
// In MongoDB shell or your database admin
db.user.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } });
```

## File Structure

```
src/
├── app/(dashboard)/
│   ├── dashboard/
│   │   ├── blogs/
│   │   │   ├── page.tsx          # Blogs listing
│   │   │   ├── new/page.tsx      # Create blog
│   │   │   └── [id]/page.tsx     # Edit blog
│   │   ├── categories/
│   │   │   ├── page.tsx          # Categories listing
│   │   │   ├── new/page.tsx      # Create category
│   │   │   └── [id]/page.tsx     # Edit category
│   │   └── page.tsx              # Dashboard overview
├── components/ui/
│   ├── multi-select.tsx          # Custom multi-select component
│   └── ...                       # Other shadcn components
├── lib/
│   ├── actions/
│   │   └── blog.ts               # Server actions for blogs/categories
│   ├── cloudinary.ts             # Cloudinary utilities
│   ├── types/
│   │   └── blog.ts               # TypeScript definitions
│   └── prisma.ts                 # Prisma client
└── prisma/
    └── schema.prisma             # Database schema
```

## Security Considerations

- ✅ **Server Actions** ensure secure server-side operations
- ✅ **Input validation** with Zod schemas
- ✅ **File upload validation** (size, type restrictions)
- ✅ **Admin role verification** for dashboard access
- ✅ **CSRF protection** through Next.js built-in security

## Performance Optimizations

- ✅ **Server-side rendering** for initial page loads
- ✅ **Optimistic updates** for better UX
- ✅ **Lazy loading** for large datasets
- ✅ **Efficient queries** with Prisma
- ✅ **Image optimization** through Cloudinary

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Check `DATABASE_URL` in `.env`
   - Ensure MongoDB is running and accessible

2. **Cloudinary Upload Issues**

   - Verify Cloudinary credentials
   - Check file size limits (5MB max)
   - Ensure correct file types

3. **Email Not Working**

   - For development: Use default Ethereal (no setup needed)
   - For production: Configure SMTP or Gmail credentials

4. **Admin Access Denied**
   - Ensure user has `role: "admin"` in database
   - Try signing out and back in after role update

### Development Commands

```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate types
npx prisma generate
```

## Support

This admin dashboard is built with modern web development best practices and is production-ready. All CRUD operations are fully functional with proper error handling, loading states, and user feedback.

The system uses:

- **Next.js 15** with App Router
- **Prisma** with MongoDB
- **Cloudinary** for image management
- **shadcn/ui** for consistent UI
- **TanStack Table** for data tables
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety
