'use client';

import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSidebar } from './SidebarContext';

function AdminHeaderContent() {
  const router = useRouter();
  const { toggle } = useSidebar();

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // TODO: Implement logout logic
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side: Toggle + Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">SB</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Bảng quản trị</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Softie Beauty
              </p>
            </div>
          </div>
        </div>

        {/* Right side: User info + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="size-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Quản trị viên</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function AdminHeader() {
  return <AdminHeaderContent />;
}
