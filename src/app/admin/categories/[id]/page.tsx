'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Category, SubcategoryItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus, X, ArrowLeft } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = decodeURIComponent(params.id as string);

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryItem | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch category and subcategories
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch category
      const categoryResponse = await fetch('/api/categories');
      const categoryResult = await categoryResponse.json();
      
      if (!categoryResult.success) {
        throw new Error('Failed to fetch category');
      }

      const foundCategory = categoryResult.data.find((cat: Category) => cat.id === categoryId);
      if (!foundCategory) {
        throw new Error('Category not found');
      }

      setCategory(foundCategory);
      setSubcategories(foundCategory.subcategories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  // Handle delete subcategory
  const handleDelete = async (subcategory: SubcategoryItem) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục con "${subcategory.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/categories/${encodeURIComponent(categoryId)}/subcategories/${encodeURIComponent(subcategory.id)}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (!result.success) {
        alert(result.error || 'Failed to delete subcategory');
        return;
      }

      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete subcategory');
    }
  };

  // Handle edit
  const handleEdit = (subcategory: SubcategoryItem) => {
    setEditingSubcategory(subcategory);
    setFormData({ name: subcategory.name });
    setShowForm(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = editingSubcategory
        ? `/api/categories/${encodeURIComponent(categoryId)}/subcategories/${encodeURIComponent(editingSubcategory.id)}`
        : `/api/categories/${encodeURIComponent(categoryId)}/subcategories`;
      const method = editingSubcategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save subcategory');
      }

      setShowForm(false);
      setEditingSubcategory(null);
      setFormData({ name: '' });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingSubcategory(null);
    setFormData({ name: '' });
    setError(null);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingSubcategory(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center">
        <p className="text-destructive">Không tìm thấy danh mục</p>
        <Button onClick={() => router.push('/admin/categories')} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/categories')}
          className="mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Quay lại danh sách
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý subcategories • Tổng số: {subcategories.length}
            </p>
          </div>
          {!showForm && (
            <Button onClick={handleAddNew}>
              <Plus className="size-4" />
              Thêm subcategory
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="bg-card border rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingSubcategory ? 'Chỉnh sửa subcategory' : 'Thêm subcategory mới'}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="size-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên subcategory *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                placeholder="Nhập tên subcategory"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : editingSubcategory ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          {subcategories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Chưa có subcategory nào. Hãy thêm subcategory đầu tiên!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tên subcategory</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subcategories.map((subcategory) => (
                    <tr key={subcategory.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{subcategory.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {subcategory.slug}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(subcategory)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(subcategory)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
