'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/components/admin/ProductForm';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { getImageUrl } from '@/lib/image-utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch products');
      }

      setProducts(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete product');
      }

      // Refresh products list
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Tổng số sản phẩm: {products.length}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAddNew}>
            <Plus className="size-4" />
            Thêm sản phẩm
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
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <Button variant="outline" onClick={handleFormCancel}>
              Quay lại
            </Button>
          </div>
          <ProductForm
            product={editingProduct}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Hình ảnh</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tên sản phẩm</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Giá</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Danh mục</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Biến thể</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm">{product.id}</td>
                      <td className="px-4 py-3">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>{product.parentCategory}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.subcategory}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {product.variants && product.variants.length > 0 ? (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {product.variants.length} biến thể
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Không có</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
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
