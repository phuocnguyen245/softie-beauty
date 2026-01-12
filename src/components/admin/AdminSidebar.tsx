'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderTree, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

const navigation = [
  {
    name: 'Bảng điều khiển',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Danh mục',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    name: 'Sản phẩm',
    href: '/admin/products',
    icon: Package,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-card border-r transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile when clicking a link
                    if (window.innerWidth < 1024) {
                      toggle();
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="size-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden top-16"
          onClick={toggle}
        />
      )}
    </>
  );
}
