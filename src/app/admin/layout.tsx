import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider } from '@/components/admin/SidebarContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <AdminSidebar />
        <main className="lg:ml-64 p-4 lg:p-8 pt-24 lg:pt-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
