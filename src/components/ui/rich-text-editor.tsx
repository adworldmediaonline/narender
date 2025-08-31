'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import {
  EditorContent,
  useEditor,
  type AnyExtension,
  type Editor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Bold,
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Table as TableIcon,
  Type,
  Undo,
} from 'lucide-react';

// Component variants
const richTextEditorVariants = cva(
  'relative rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'min-h-[100px]',
        default: 'min-h-[200px]',
        lg: 'min-h-[300px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Component interfaces
interface RichTextEditorProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'>,
    VariantProps<typeof richTextEditorVariants> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showToolbar?: boolean;
  extensions?: AnyExtension[];
  name?: string;
}

interface ToolbarProps {
  editor: Editor;
}

// Helper to get current heading level
function getCurrentHeadingLevel(editor: Editor): string {
  if (editor.isActive('heading', { level: 1 })) return 'h1';
  if (editor.isActive('heading', { level: 2 })) return 'h2';
  if (editor.isActive('heading', { level: 3 })) return 'h3';
  if (editor.isActive('heading', { level: 4 })) return 'h4';
  if (editor.isActive('heading', { level: 5 })) return 'h5';
  if (editor.isActive('heading', { level: 6 })) return 'h6';
  return 'paragraph';
}

// Toolbar button component with tooltip
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  tooltip,
  children,
  className,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'h-8 w-8',
            isActive &&
              'tiptap-button-active bg-primary text-primary-foreground',
            disabled && 'tiptap-button-disabled',
            className
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Toolbar component
function EditorToolbar({ editor }: ToolbarProps) {
  const addImage = React.useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = React.useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addTable = React.useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const addHorizontalRule = React.useCallback(() => {
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  const handleHeadingChange = React.useCallback(
    (value: string) => {
      if (value === 'paragraph') {
        editor.chain().focus().setParagraph().run();
      } else {
        const level = parseInt(value.replace('h', ''), 10) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6;
        editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    [editor]
  );

  const currentHeading = getCurrentHeadingLevel(editor);

  return (
    <TooltipProvider>
      <div className="rich-text-toolbar flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
        {/* Text Style Dropdown */}
        <div className="flex items-center gap-1">
          <Select value={currentHeading} onValueChange={handleHeadingChange}>
            <SelectTrigger className="h-8 w-24 text-xs">
              <SelectValue>
                <div className="flex items-center gap-1">
                  <Type className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {currentHeading === 'paragraph'
                      ? 'Text'
                      : currentHeading.toUpperCase()}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <span>Normal Text</span>
                </div>
              </SelectItem>
              <SelectItem value="h1">
                <div className="flex items-center gap-2">
                  <Heading1 className="h-4 w-4" />
                  <span>Heading 1</span>
                </div>
              </SelectItem>
              <SelectItem value="h2">
                <div className="flex items-center gap-2">
                  <Heading2 className="h-4 w-4" />
                  <span>Heading 2</span>
                </div>
              </SelectItem>
              <SelectItem value="h3">
                <div className="flex items-center gap-2">
                  <Heading3 className="h-4 w-4" />
                  <span>Heading 3</span>
                </div>
              </SelectItem>
              <SelectItem value="h4">
                <div className="flex items-center gap-2">
                  <Heading3 className="h-4 w-4" />
                  <span>Heading 4</span>
                </div>
              </SelectItem>
              <SelectItem value="h5">
                <div className="flex items-center gap-2">
                  <Heading3 className="h-4 w-4" />
                  <span>Heading 5</span>
                </div>
              </SelectItem>
              <SelectItem value="h6">
                <div className="flex items-center gap-2">
                  <Heading3 className="h-4 w-4" />
                  <span>Heading 6</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            tooltip="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            tooltip="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            tooltip="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            tooltip="Inline Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            tooltip="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            tooltip="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive('taskList')}
            tooltip="Task List"
          >
            <CheckSquare className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Quote & Divider */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            tooltip="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton onClick={addHorizontalRule} tooltip="Horizontal Rule">
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Insert Elements */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            tooltip="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton onClick={addImage} tooltip="Insert Image">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton onClick={addTable} tooltip="Insert Table">
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            tooltip="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            tooltip="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Main RichTextEditor component
function RichTextEditor({
  className,
  size,
  value = '',
  onChange,
  placeholder = 'Start writing...',
  disabled = false,
  showToolbar = true,
  extensions = [],
  name,
  ...props
}: RichTextEditorProps) {
  const defaultExtensions = [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class:
          'text-primary underline underline-offset-2 hover:text-primary/80',
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto',
      },
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Placeholder.configure({
      placeholder,
    }),
    ...extensions,
  ];

  const editor = useEditor({
    extensions: defaultExtensions,
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: cn(
          'tiptap p-4 min-h-0',
          disabled && 'opacity-50 cursor-not-allowed'
        ),
      },
    },
    editable: !disabled,
  });

  // Update editor content when value changes externally
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn(richTextEditorVariants({ size }), className)} {...props}>
      {showToolbar && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        name={name}
        className={cn('min-h-0 flex-1', !showToolbar && 'p-4')}
      />
    </div>
  );
}

export { RichTextEditor, type RichTextEditorProps };
