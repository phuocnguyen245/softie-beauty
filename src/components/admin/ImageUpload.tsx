'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image-utils';

interface ImageUploadProps {
  value?: string; // Current image URL or path
  onChange: (path: string) => void;
  type: 'categories' | 'subcategories' | 'products';
  label?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  type,
  label = 'Hình ảnh',
  required = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload image');
      }

      // Update parent with new path
      onChange(result.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Update preview when value changes (e.g., when editing)
  useEffect(() => {
    if (value) {
      // Convert to proper URL format (handles old /uploads/ format)
      const imageUrl = getImageUrl(value);
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">
        {label} {required && '*'}
      </Label>

      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="size-4" />
            </Button>
          </div>
        )}

        {/* Upload area */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={uploading}
            className="gap-2"
          >
            {uploading ? (
              <>
                <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Đang tải lên...
              </>
            ) : preview ? (
              <>
                <Upload className="size-4" />
                Thay đổi ảnh
              </>
            ) : (
              <>
                <ImageIcon className="size-4" />
                Chọn ảnh
              </>
            )}
          </Button>
          {value && !preview && (
            <span className="text-sm text-muted-foreground">
              Đang sử dụng ảnh hiện tại
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Current image info */}
        {value && !preview && (
          <div className="text-xs text-muted-foreground">
            Ảnh hiện tại: {value}
          </div>
        )}
      </div>
    </div>
  );
}
