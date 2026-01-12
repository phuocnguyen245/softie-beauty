'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus, X, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch categories');
      }

      setCategories(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.error || 'Failed to delete category');
        return;
      }

      await fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = editingCategory
        ? `/api/categories/${encodeURIComponent(editingCategory.id)}`
        : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save category');
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '' });
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '' });
    setError(null);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
          <p className="text-muted-foreground mt-1">
            Tổng số danh mục: {categories.length}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAddNew}>
            <Plus className="size-4" />
            Thêm danh mục
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="size-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : editingCategory ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tên danh mục</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Số subcategories</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {category.slug}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {category.subcategories.length}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/categories/${encodeURIComponent(category.id)}`)}
                          >
                            <Settings className="size-4 mr-2" />
                            Quản lý Subcategories
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
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
