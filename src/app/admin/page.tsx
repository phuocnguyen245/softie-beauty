'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, FolderTree, Package, TrendingUp } from 'lucide-react';
import { Category } from '@/types';

interface DashboardStats {
  totalCategories: number;
  totalSubcategories: number;
  totalProducts: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCategories: 0,
    totalSubcategories: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentCategories, setRecentCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesResult = await categoriesResponse.json();

        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsResult = await productsResponse.json();

        if (categoriesResult.success && productsResult.success) {
          const categories: Category[] = categoriesResult.data;
          const products = productsResult.data;

          // Calculate stats
          const totalSubcategories = categories.reduce(
            (sum, cat) => sum + cat.subcategories.length,
            0
          );

          setStats({
            totalCategories: categories.length,
            totalSubcategories,
            totalProducts: products.length,
          });

          // Get recent categories (last 5)
          setRecentCategories(categories.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
        <p className="text-muted-foreground mt-1">
          Tổng quan hệ thống quản lý
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng Categories</p>
              <p className="text-3xl font-bold mt-2">{stats.totalCategories}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <FolderTree className="size-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng Subcategories</p>
              <p className="text-3xl font-bold mt-2">{stats.totalSubcategories}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="size-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng Products</p>
              <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="size-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push('/admin/categories')}>
            <Plus className="size-4 mr-2" />
            Thêm Category
          </Button>
          <Button onClick={() => router.push('/admin/products')} variant="outline">
            <Plus className="size-4 mr-2" />
            Thêm Product
          </Button>
          <Button
            onClick={() => router.push('/admin/categories')}
            variant="outline"
          >
            <FolderTree className="size-4 mr-2" />
            Quản lý Categories
          </Button>
          <Button
            onClick={() => router.push('/admin/products')}
            variant="outline"
          >
            <Package className="size-4 mr-2" />
            Quản lý Products
          </Button>
        </div>
      </div>

      {/* Recent Categories */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Categories gần đây</h2>
        {recentCategories.length === 0 ? (
          <p className="text-muted-foreground">Chưa có category nào</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tên Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Subcategories</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentCategories.map((category) => (
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
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/categories/${encodeURIComponent(category.id)}`)
                          }
                        >
                          Quản lý
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
    </div>
  );
}
