# RichTextEditor Component

A comprehensive rich text editor built with Tiptap, following Shadcn UI patterns and best practices.

## Features

- **Rich text editing** with formatting, headings, lists, quotes
- **Link management** with URL prompt
- **Image insertion** with URL support
- **Table creation** with resizable columns
- **Task lists** with nested support
- **Undo/Redo** functionality
- **Keyboard shortcuts** for all formatting options
- **Form integration** compatible with React Hook Form
- **TypeScript support** with proper type safety
- **Accessible** with proper ARIA attributes
- **Customizable** with variants and extensions

## Basic Usage

### Simple Editor

```tsx
import { RichTextEditor } from '@/components/ui/rich-text-editor';

function BasicExample() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Start writing your blog post..."
    />
  );
}
```

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

function BlogForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content *</FormLabel>
            <FormControl>
              <RichTextEditor
                {...field}
                placeholder="Write your blog content here..."
                size="lg"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}
```

### Zod Validation

```tsx
const blogSchema = z.object({
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .refine(html => {
      // Remove HTML tags and check if there's actual content
      const textContent = html.replace(/<[^>]*>/g, '').trim();
      return textContent.length > 0;
    }, 'Content cannot be empty'),
});
```

## Variants

### Size Variants

```tsx
{
  /* Small editor */
}
<RichTextEditor size="sm" />;

{
  /* Default size */
}
<RichTextEditor size="default" />;

{
  /* Large editor */
}
<RichTextEditor size="lg" />;
```

### Without Toolbar

```tsx
<RichTextEditor
  showToolbar={false}
  placeholder="Simple text editor without toolbar..."
/>
```

### Disabled State

```tsx
<RichTextEditor disabled={isLoading} value={content} onChange={setContent} />
```

## Keyboard Shortcuts

- **Bold**: `Ctrl/Cmd + B`
- **Italic**: `Ctrl/Cmd + I`
- **Strike**: `Ctrl/Cmd + Shift + S`
- **Code**: `Ctrl/Cmd + E`
- **Heading 1**: `Ctrl/Cmd + Alt + 1`
- **Heading 2**: `Ctrl/Cmd + Alt + 2`
- **Heading 3**: `Ctrl/Cmd + Alt + 3`
- **Bullet List**: `Ctrl/Cmd + Shift + 8`
- **Ordered List**: `Ctrl/Cmd + Shift + 7`
- **Blockquote**: `Ctrl/Cmd + Shift + B`
- **Undo**: `Ctrl/Cmd + Z`
- **Redo**: `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z`

## Custom Extensions

```tsx
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';

function CustomEditor() {
  const customExtensions = [
    TextStyle,
    Color.configure({ types: [TextStyle.name] }),
  ];

  return (
    <RichTextEditor
      extensions={customExtensions}
      value={content}
      onChange={setContent}
    />
  );
}
```

## Styling

The editor automatically adapts to your theme and includes:

- **Dark mode support** with proper color schemes
- **Responsive design** that works on all screen sizes
- **Focus states** with ring indicators
- **Hover effects** for interactive elements
- **Disabled states** with opacity changes

## Content Processing

### HTML Output

The editor outputs clean HTML that can be safely stored and displayed:

```tsx
// Save to database
const htmlContent = editor.getHTML();

// Display in frontend
<div
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: htmlContent }}
/>;
```

### Plain Text Extraction

```tsx
// Get plain text without HTML
const plainText = editor.getText();

// Use for excerpts or search
const excerpt = plainText.substring(0, 150) + '...';
```

## Error Handling

```tsx
function SafeEditor() {
  const [error, setError] = useState<string>();

  return (
    <div>
      <RichTextEditor
        value={content}
        onChange={html => {
          try {
            setContent(html);
            setError(undefined);
          } catch (err) {
            setError('Failed to update content');
          }
        }}
      />
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
```

## Advanced Features

### Table Editing

- Click table icon to insert 3x3 table
- Tables are resizable and support header rows
- Navigate with Tab/Shift+Tab between cells

### Link Management

- Select text and click link icon to add/edit links
- Empty URL removes the link
- Links open in new tab by default

### Image Insertion

- Click image icon and enter URL
- Images are responsive and rounded
- Supports alt text (can be extended)

### Task Lists

- Create nested task lists
- Check/uncheck items by clicking
- Supports markdown-style syntax

This editor component provides a production-ready rich text editing experience while maintaining consistency with your existing design system!
