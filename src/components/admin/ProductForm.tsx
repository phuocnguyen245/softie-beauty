'use client';

import { useState, useEffect } from 'react';
import { Product, ProductVariant, Category, SubcategoryItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from './ImageUpload';
import { formatPrice } from '@/lib/utils';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    parentCategory: '',
    subcategory: '',
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newVariant, setNewVariant] = useState({ name: '', price: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when parent category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.parentCategory) {
        setSubcategories([]);
        setFormData((prev) => ({ ...prev, subcategory: '' }));
        return;
      }
      try {
        const response = await fetch(
          `/api/categories/${encodeURIComponent(formData.parentCategory)}/subcategories`
        );
        const result = await response.json();
        if (result.success) {
          setSubcategories(result.data);
          // Reset subcategory if current one is not in the new list
          if (formData.subcategory && !result.data.some((sub: SubcategoryItem) => sub.name === formData.subcategory)) {
            setFormData((prev) => ({ ...prev, subcategory: '' }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch subcategories:', err);
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [formData.parentCategory]);

  // Load product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price ? product.price.toLocaleString('vi-VN') : '',
        image: product.image || '',
        description: product.description || '',
        parentCategory: product.parentCategory || '',
        subcategory: product.subcategory || '',
      });
      setVariants(product.variants || []);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format price input with thousand separators (VNĐ format)
    if (name === 'price') {
      // Remove all non-digit characters
      const cleanedValue = value.replace(/\D/g, '');
      // Format with thousand separators (dấu chấm)
      if (cleanedValue) {
        const numValue = parseInt(cleanedValue, 10);
        if (!isNaN(numValue)) {
          const formattedValue = numValue.toLocaleString('vi-VN');
          setFormData((prev) => ({ ...prev, [name]: formattedValue }));
        } else {
          setFormData((prev) => ({ ...prev, [name]: '' }));
        }
      } else {
        setFormData((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Reset subcategory when parent category changes
    if (name === 'parentCategory') {
      setFormData((prev) => ({ ...prev, subcategory: '' }));
    }
  };

  const handleAddVariant = () => {
    if (newVariant.name && newVariant.price) {
      // Parse price: remove thousand separators (dấu chấm) and convert to number
      const priceValue = parseInt(newVariant.price.replace(/\./g, ''), 10);
      if (isNaN(priceValue) || priceValue <= 0) {
        alert('Vui lòng nhập giá hợp lệ cho biến thể');
        return;
      }
      setVariants([
        ...variants,
        { name: newVariant.name, price: priceValue },
      ]);
      setNewVariant({ name: '', price: '' });
    }
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // If image is empty and we're editing, keep the old image
      const imagePath = formData.image || (product?.image || '');

      if (!imagePath) {
        throw new Error('Vui lòng chọn hoặc upload ảnh sản phẩm');
      }

      // Parse price: remove thousand separators (dấu chấm) and convert to number
      const priceValue = typeof formData.price === 'string' 
        ? parseInt(formData.price.replace(/\./g, ''), 10)
        : parseInt(formData.price, 10);
      
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Vui lòng nhập giá hợp lệ');
      }

      const productData = {
        ...formData,
        image: imagePath,
        price: priceValue,
        variants: variants.length > 0 ? variants : undefined,
      };

      const url = product
        ? `/api/products/${product.id}`
        : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save product');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên sản phẩm *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Giá (VNĐ) *</Label>
          <Input
            id="price"
            name="price"
            type="text"
            value={formData.price}
            onChange={handleInputChange}
            required
            placeholder="Nhập giá (ví dụ: 55000 hoặc 55.000)"
          />
          {formData.price && (
            <p className="text-xs text-muted-foreground">
              Giá hiển thị: {formatPrice(parseInt(formData.price.replace(/\./g, ''), 10) || 0)}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <ImageUpload
            value={formData.image}
            onChange={(path) => setFormData((prev) => ({ ...prev, image: path }))}
            type="products"
            label="Hình ảnh"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentCategory">Danh mục chính *</Label>
          <select
            id="parentCategory"
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleInputChange}
            required
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subcategory">Danh mục phụ *</Label>
          <select
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleInputChange}
            required
            disabled={!formData.parentCategory || subcategories.length === 0}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Chọn danh mục phụ</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Mô tả *</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Nhập mô tả sản phẩm"
          />
        </div>
      </div>

      {/* Variants Section */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label>Biến thể sản phẩm (tùy chọn)</Label>
        </div>

        {variants.length > 0 && (
          <div className="space-y-2">
            {variants.map((variant, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <span className="flex-1 text-sm">
                  {variant.name} - {formatPrice(variant.price)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveVariant(index)}
                >
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Tên biến thể"
            value={newVariant.name}
            onChange={(e) =>
              setNewVariant({ ...newVariant, name: e.target.value })
            }
            className="flex-1"
          />
          <Input
            type="text"
            placeholder="Giá (VNĐ)"
            value={newVariant.price}
            onChange={(e) => {
              // Format price input with thousand separators (VNĐ format)
              const value = e.target.value;
              const cleanedValue = value.replace(/\D/g, '');
              if (cleanedValue) {
                const numValue = parseInt(cleanedValue, 10);
                if (!isNaN(numValue)) {
                  const formattedValue = numValue.toLocaleString('vi-VN');
                  setNewVariant({ ...newVariant, price: formattedValue });
                } else {
                  setNewVariant({ ...newVariant, price: '' });
                }
              } else {
                setNewVariant({ ...newVariant, price: '' });
              }
            }}
            className="w-40"
          />
          <Button
            type="button"
            variant="default"
            onClick={handleAddVariant}
            disabled={!newVariant.name || !newVariant.price}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Thêm
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : product ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
