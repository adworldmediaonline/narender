# Image Upload Component

A fully composable, accessible image upload component built following Shadcn UI patterns.

## Features

- **Drag & drop support** with React Dropzone
- **File validation** with customizable size limits and accepted formats
- **Composable structure** following Shadcn patterns
- **Built-in error handling** with form integration
- **Progress indicators** (ready for upload progress implementation)
- **Variant support** using class-variance-authority
- **Full TypeScript support** with proper type safety
- **Accessibility first** with proper ARIA support and focus management

## Basic Usage

### Single Image Upload

```tsx
import {
  ImageUpload,
  ImageUploadTrigger,
  ImageUploadContent,
  ImageUploadPreview,
  ImageUploadError,
} from '@/components/ui/image-upload';

function SingleImageExample() {
  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profile Image</FormLabel>
          <FormControl>
            <ImageUpload
              {...field}
              maxSize={5 * 1024 * 1024} // 5MB
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
  );
}
```

### Multiple Images Upload

```tsx
function MultipleImagesExample() {
  return (
    <FormField
      control={form.control}
      name="gallery"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image Gallery</FormLabel>
          <FormControl>
            <ImageUpload
              {...field}
              multiple
              maxFiles={5}
              maxSize={5 * 1024 * 1024}
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
  );
}
```

## Built-in Zod Validation

The component works seamlessly with Zod validation - no extra setup needed!

### Single Image Validation

```tsx
import { z } from 'zod';

const formSchema = z.object({
  profileImage: z
    .any()
    .refine(file => file !== null && file !== undefined, {
      message: 'Profile image is required',
    })
    .refine(file => file instanceof File, {
      message: 'Please upload a valid file',
    })
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    }),
});

function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileImage: null,
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="profileImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Image *</FormLabel>
            <FormControl>
              <ImageUpload {...field} maxSize={5 * 1024 * 1024}>
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
    </Form>
  );
}
```

### Multiple Images Validation

```tsx
const gallerySchema = z.object({
  gallery: z
    .array(z.any())
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed')
    .refine(
      files => files.every(file => file instanceof File),
      'All items must be valid files'
    )
    .refine(
      files => files.every(file => file.size <= 5 * 1024 * 1024),
      'Each file must be less than 5MB'
    ),
});

function GalleryForm() {
  const form = useForm({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      gallery: [],
    },
  });

  return (
    <FormField
      control={form.control}
      name="gallery"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image Gallery *</FormLabel>
          <FormControl>
            <ImageUpload
              {...field}
              multiple
              maxFiles={5}
              maxSize={5 * 1024 * 1024}
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
  );
}
```

### Optional Images

```tsx
const optionalImageSchema = z.object({
  avatar: z
    .any()
    .nullable()
    .optional()
    .refine(file => !file || file instanceof File, 'Must be a valid file'),
});
```

## Variants

The component supports different sizes and states:

```tsx
// Different sizes
<ImageUpload size="sm" />
<ImageUpload size="default" />
<ImageUpload size="lg" />

// Different states (auto-detected or manually set)
<ImageUpload state="idle" />
<ImageUpload state="active" />
<ImageUpload state="accept" />
<ImageUpload state="reject" />
<ImageUpload state="disabled" />
```

## Custom Content

You can customize the upload content:

```tsx
<ImageUpload value={file} onChange={setFile}>
  <ImageUploadPreview />
  <ImageUploadTrigger>
    <ImageUploadContent>
      <div className="text-center">
        <FileImage className="h-12 w-12 mx-auto text-gray-400" />
        <p className="mt-2 text-sm font-medium">Drop your image here</p>
        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    </ImageUploadContent>
  </ImageUploadTrigger>
  <ImageUploadError />
</ImageUpload>
```

## With Progress (Ready for Implementation)

The component is ready for progress implementation:

```tsx
<ImageUpload value={file} onChange={setFile} onError={handleError}>
  <ImageUploadPreview />
  <ImageUploadTrigger>
    <ImageUploadContent />
  </ImageUploadTrigger>
  <ImageUploadProgress value={progress} isVisible={isUploading} />
  <ImageUploadError />
  <ImageUploadSuccess>Image uploaded successfully!</ImageUploadSuccess>
</ImageUpload>
```

## Architecture

The component follows Shadcn's composable architecture:

1. **ImageUploadRoot** - Provides context and dropzone functionality
2. **ImageUploadTrigger** - Clickable area for file selection
3. **ImageUploadContent** - Upload instructions and icons
4. **ImageUploadPreview** - Shows selected/current image
5. **ImageUploadProgress** - Upload progress indicator
6. **ImageUploadError** - Error display
7. **ImageUploadSuccess** - Success state

## Styling

Uses class-variance-authority for consistent styling with built-in variants for:

- Different visual states (idle, active, accept, reject, disabled)
- Different sizes (sm, default, lg)
- Proper focus, hover, and disabled states
- Dark mode support

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Error announcements
