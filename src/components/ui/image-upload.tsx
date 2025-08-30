'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle, FileImage, Upload, X } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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

// Component interfaces
interface ImageUploadRootProps
  extends Omit<React.ComponentProps<'div'>, 'onChange' | 'onError'>,
    VariantProps<typeof imageUploadVariants> {
  value?: File | CloudinaryImageData | null;
  onChange: (file: File | null) => void;
  onError?: (error: string) => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
  disabled?: boolean;
  multiple?: boolean;
}

interface ImageUploadTriggerProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
}

type ImageUploadContentProps = React.ComponentProps<'div'>;

interface ImageUploadPreviewProps extends React.ComponentProps<'div'> {
  file?: File | CloudinaryImageData;
  onRemove?: () => void;
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
  value?: File | CloudinaryImageData | null;
  onChange: (file: File | null) => void;
  onError?: (error: string) => void;
  maxSize: number;
  accept: Record<string, string[]>;
  disabled: boolean;
  multiple: boolean;
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
  onError,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
  },
  disabled = false,
  multiple = false,
  children,
  ...props
}: ImageUploadRootProps) {
  const [error, setError] = React.useState<string>();

  const handleError = React.useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      onError?.(errorMessage);
    },
    [onError]
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
        onChange(acceptedFiles[0]);
      }
    },
    [onChange, handleError, maxSize]
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
    disabled,
  });

  // Determine the current state
  const state = React.useMemo(() => {
    if (stateProp) return stateProp;
    if (disabled) return 'disabled';
    if (isDragReject) return 'reject';
    if (isDragAccept) return 'accept';
    if (isDragActive) return 'active';
    return 'idle';
  }, [stateProp, disabled, isDragActive, isDragAccept, isDragReject]);

  const isValid = !error && (isDragAccept || !isDragActive);

  const contextValue: ImageUploadContextValue = {
    value,
    onChange,
    onError: handleError,
    maxSize,
    accept,
    disabled,
    multiple,
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
        className={cn(imageUploadVariants({ state, size }), className)}
        {...props}
      >
        <input {...getInputProps()} />
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
  const { isDragActive, maxSize, accept } = useImageUpload();

  const acceptedFormats = Object.values(accept)
    .flat()
    .map(ext => ext.replace('.', '').toUpperCase())
    .join(', ');

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
            <p className="text-sm font-medium">
              {isDragActive
                ? 'Drop your image here'
                : 'Drag & drop an image here, or click to select'}
            </p>
            <p className="text-xs text-muted-foreground">
              Max size: {Math.round(maxSize / (1024 * 1024))}MB • Formats:{' '}
              {acceptedFormats}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Preview component for showing selected/current image
function ImageUploadPreview({
  className,
  file,
  onRemove,
  showRemove = true,
  ...props
}: ImageUploadPreviewProps) {
  const { value, onChange } = useImageUpload();
  const currentFile = file || value;

  if (!currentFile) return null;

  const isFile = currentFile instanceof File;
  const isCloudinaryImage =
    currentFile &&
    typeof currentFile === 'object' &&
    'secure_url' in currentFile;

  const imageUrl = isFile
    ? URL.createObjectURL(currentFile)
    : isCloudinaryImage
    ? (currentFile as CloudinaryImageData).secure_url ||
      (currentFile as CloudinaryImageData).url ||
      ''
    : '';

  const altText = isCloudinaryImage
    ? (currentFile as CloudinaryImageData).alt || 'Preview'
    : 'Preview';

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange(null);
    }
  };

  return (
    <div
      data-slot="image-upload-preview"
      className={cn('relative w-full', className)}
      {...props}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
        <Image src={imageUrl} alt={altText} fill className="object-cover" />
        {showRemove && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isFile && (
        <div className="mt-2 text-xs text-muted-foreground">
          {currentFile.name} ({Math.round(currentFile.size / 1024)}KB)
        </div>
      )}
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
