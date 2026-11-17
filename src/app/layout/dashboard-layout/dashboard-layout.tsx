import { Outlet } from 'react-router';
import { SidebarInset, SidebarProvider } from '@/shadcn/components/ui/sidebar';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { Breadcrumb } from './breadcrumb/breadcrumb';
import { Footer } from './footer/footer';

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      {/* Sidebar */}
      <Sidebar />
      <SidebarInset className="min-w-0">
        {/* Header */}
        <Header />
        {/* Breadcrumb */}
        <Breadcrumb />
        {/* Content */}
        <main className="flex-1 -mt-6 md:-mt-10 relative z-20">
          <div className="mx-auto max-w-(--breakpoint-1xl) p-4 md:p-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-white dark:border-zinc-800">
              <Outlet />
            </div>
          </div>
        </main>
        {/* Footer */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
