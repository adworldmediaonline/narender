'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle, FileImage, Upload, X } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// No need for form field hooks - FormControl handles this via Slot

// Types
interface CloudinaryImageData {
  public_id: string;
  secure_url: string;
  url?: string;
  width: number;
  height: number;
  format: string;
  alt?: string;
  [key: string]: string | number | boolean | undefined;
}

// Variants for the upload area
const imageUploadVariants = cva(
  'relative w-full rounded-lg border-2 border-dashed transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      state: {
        idle: 'border-input hover:border-primary/50 hover:bg-muted/25',
        active: 'border-primary bg-primary/5',
        accept: 'border-green-500 bg-green-50 dark:bg-green-950/20',
        reject: 'border-destructive bg-destructive/5',
        disabled: 'border-input/50 bg-muted/20 cursor-not-allowed opacity-60',
      },
      size: {
        sm: 'min-h-[120px] p-4',
        default: 'min-h-[180px] p-6',
        lg: 'min-h-[240px] p-8',
      },
    },
    defaultVariants: {
      state: 'idle',
      size: 'default',
    },
  }
);

// Single/Multiple file types
type SingleFile = File | CloudinaryImageData | null;
type MultipleFiles = (File | CloudinaryImageData)[] | null;
type FileValue = SingleFile | MultipleFiles;

// Component interfaces - following Shadcn pattern exactly
interface ImageUploadRootProps
  extends Omit<React.ComponentProps<'div'>, 'onChange' | 'onError'>,
    VariantProps<typeof imageUploadVariants> {
  value?: FileValue;
  onChange?: (value: FileValue) => void;
  onUploadError?: (error: string) => void; // Renamed to avoid conflict
  maxSize?: number;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number; // For multiple uploads
  name?: string;
  disabled?: boolean;
}

interface ImageUploadTriggerProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
}

type ImageUploadContentProps = React.ComponentProps<'div'>;

interface ImageUploadPreviewProps extends React.ComponentProps<'div'> {
  file?: File | CloudinaryImageData;
  files?: (File | CloudinaryImageData)[];
  onRemove?: (index?: number) => void;
  showRemove?: boolean;
}

interface ImageUploadProgressProps extends React.ComponentProps<'div'> {
  value: number;
  isVisible: boolean;
}

interface ImageUploadErrorProps extends React.ComponentProps<'div'> {
  error?: string;
}

// Context for sharing state between components
interface ImageUploadContextValue {
  value?: FileValue;
  onChange?: (value: FileValue) => void;
  onUploadError?: (error: string) => void;
  maxSize: number;
  accept: Record<string, string[]>;
  disabled: boolean;
  multiple: boolean;
  maxFiles: number;
  isDragActive: boolean;
  isValid: boolean;
  error?: string;
}

const ImageUploadContext = React.createContext<ImageUploadContextValue | null>(
  null
);

const useImageUpload = () => {
  const context = React.useContext(ImageUploadContext);
  if (!context) {
    throw new Error(
      'ImageUpload components must be used within ImageUploadRoot'
    );
  }
  return context;
};

// Root component that provides context and dropzone functionality
function ImageUploadRoot({
  className,
  state: stateProp,
  size,
  value,
  onChange,
  onUploadError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
  },
  disabled = false,
  multiple = false,
  maxFiles = multiple ? 10 : 1,
  name,
  children,
  ...props
}: ImageUploadRootProps) {
  const [error, setError] = React.useState<string>();

  const handleError = React.useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      onUploadError?.(errorMessage);
    },
    [onUploadError]
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Clear previous errors
      setError(undefined);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          handleError(
            `File size should be less than ${Math.round(
              maxSize / (1024 * 1024)
            )}MB`
          );
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          handleError('Please select a valid image file');
        } else {
          handleError('Invalid file. Please try again.');
        }
        return;
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        if (multiple) {
          // Multiple files mode
          const currentFiles = Array.isArray(value) ? value : [];
          const newFiles = [...currentFiles, ...acceptedFiles];

          // Check max files limit
          if (newFiles.length > maxFiles) {
            handleError(`Maximum ${maxFiles} files allowed`);
            return;
          }

          onChange?.(newFiles);
        } else {
          // Single file mode
          onChange?.(acceptedFiles[0]);
        }
      }
    },
    [onChange, handleError, maxSize, multiple, value, maxFiles]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    disabled,
  });

  // Determine the current state
  const state = React.useMemo(() => {
    if (stateProp) return stateProp;
    if (disabled) return 'disabled';
    if (error) return 'reject';
    if (isDragReject) return 'reject';
    if (isDragAccept) return 'accept';
    if (isDragActive) return 'active';
    return 'idle';
  }, [stateProp, disabled, isDragActive, isDragAccept, isDragReject, error]);

  const isValid = !error && (isDragAccept || !isDragActive);

  const contextValue: ImageUploadContextValue = {
    value,
    onChange,
    onUploadError: handleError,
    maxSize,
    accept,
    disabled,
    multiple,
    maxFiles,
    isDragActive,
    isValid,
    error,
  };

  return (
    <ImageUploadContext.Provider value={contextValue}>
      <div
        {...getRootProps()}
        data-slot="image-upload"
        data-state={state}
        className={cn(
          imageUploadVariants({ state, size }),
          // Add validation styles similar to Input component
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      >
        <input {...getInputProps()} name={name} />
        {children}
      </div>
    </ImageUploadContext.Provider>
  );
}

// Trigger area for drag and drop
function ImageUploadTrigger({
  className,
  children,
  ...props
}: ImageUploadTriggerProps) {
  const { disabled } = useImageUpload();

  return (
    <div
      data-slot="image-upload-trigger"
      className={cn(
        'flex flex-col items-center justify-center space-y-4 text-center cursor-pointer',
        disabled && 'cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Content area with upload instructions
function ImageUploadContent({
  className,
  children,
  ...props
}: ImageUploadContentProps) {
  const { isDragActive, maxSize, accept, multiple, maxFiles } =
    useImageUpload();

  const acceptedFormats = Object.values(accept)
    .flat()
    .map(ext => ext.replace('.', '').toUpperCase())
    .join(', ');

  const getUploadText = () => {
    if (isDragActive) {
      return multiple ? 'Drop your images here' : 'Drop your image here';
    }
    return multiple
      ? 'Drag & drop images here, or click to select'
      : 'Drag & drop an image here, or click to select';
  };

  const getSubText = () => {
    const sizeText = `Max size: ${Math.round(maxSize / (1024 * 1024))}MB`;
    const formatText = `Formats: ${acceptedFormats}`;
    const limitText = multiple ? ` • Max ${maxFiles} files` : '';
    return `${sizeText} • ${formatText}${limitText}`;
  };

  return (
    <div
      data-slot="image-upload-content"
      className={cn('space-y-2', className)}
      {...props}
    >
      {children || (
        <>
          <div className="mx-auto">
            {isDragActive ? (
              <FileImage className="h-10 w-10 text-primary animate-pulse" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{getUploadText()}</p>
            <p className="text-xs text-muted-foreground">{getSubText()}</p>
          </div>
        </>
      )}
    </div>
  );
}

// Preview component for showing selected/current image(s)
function ImageUploadPreview({
  className,
  file,
  files,
  onRemove,
  showRemove = true,
  ...props
}: ImageUploadPreviewProps) {
  const { value, onChange, multiple } = useImageUpload();

  // Determine what to display
  const displayFiles =
    files ||
    (file ? [file] : Array.isArray(value) ? value : value ? [value] : []);

  if (!displayFiles.length) return null;

  const handleRemove = (index?: number) => {
    if (onRemove) {
      onRemove(index);
    } else if (multiple && Array.isArray(value) && typeof index === 'number') {
      // Remove specific file from array
      const newFiles = value.filter((_, i) => i !== index);
      onChange?.(newFiles.length ? newFiles : null);
    } else {
      // Single file or remove all
      onChange?.(null);
    }
  };

  const renderSingleImage = (
    item: File | CloudinaryImageData,
    index: number
  ) => {
    const isFile = item instanceof File;
    const isCloudinaryImage =
      item && typeof item === 'object' && 'secure_url' in item;

    const imageUrl = isFile
      ? URL.createObjectURL(item)
      : isCloudinaryImage
      ? (item as CloudinaryImageData).secure_url ||
        (item as CloudinaryImageData).url ||
        ''
      : '';

    const altText = isCloudinaryImage
      ? (item as CloudinaryImageData).alt || 'Preview'
      : 'Preview';

    return (
      <div
        key={index}
        className={cn(
          'relative aspect-video overflow-hidden rounded-lg border bg-muted',
          multiple ? 'w-24 h-24' : 'w-full'
        )}
      >
        <Image src={imageUrl} alt={altText} fill className="object-cover" />
        {showRemove && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={() => handleRemove(multiple ? index : undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {isFile && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
            {item.name}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      data-slot="image-upload-preview"
      className={cn(
        'w-full',
        multiple ? 'flex flex-wrap gap-2' : '',
        className
      )}
      {...props}
    >
      {displayFiles.map((item, index) => renderSingleImage(item, index))}
    </div>
  );
}

// Progress component for upload status
function ImageUploadProgress({
  className,
  value,
  isVisible,
  ...props
}: ImageUploadProgressProps) {
  if (!isVisible) return null;

  return (
    <div
      data-slot="image-upload-progress"
      className={cn('space-y-2', className)}
      {...props}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Uploading...</span>
        <span className="font-medium">{Math.round(value)}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

// Error display component
function ImageUploadError({
  className,
  error: errorProp,
  ...props
}: ImageUploadErrorProps) {
  const { error: contextError } = useImageUpload();

  // Priority: explicit error prop > context error
  const error = errorProp || contextError;

  if (!error) return null;

  return (
    <div
      data-slot="image-upload-error"
      className={cn(
        'flex items-center space-x-2 text-sm text-destructive bg-destructive/10 rounded-md p-3',
        className
      )}
      {...props}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{error}</span>
    </div>
  );
}

// Success state component
function ImageUploadSuccess({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="image-upload-success"
      className={cn(
        'flex items-center space-x-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 rounded-md p-3',
        className
      )}
      {...props}
    >
      <CheckCircle className="h-4 w-4 shrink-0" />
      <span>{children || 'Image uploaded successfully'}</span>
    </div>
  );
}

// Export all components
export {
  // Re-export for convenience
  ImageUploadRoot as ImageUpload,
  ImageUploadContent,
  ImageUploadError,
  ImageUploadPreview,
  ImageUploadProgress,
  ImageUploadRoot,
  ImageUploadSuccess,
  ImageUploadTrigger,
  imageUploadVariants,
};

// Export types
export type {
  CloudinaryImageData,
  ImageUploadContentProps,
  ImageUploadErrorProps,
  ImageUploadPreviewProps,
  ImageUploadProgressProps,
  ImageUploadRootProps,
  ImageUploadTriggerProps,
};
