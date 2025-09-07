'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, CreditCard, Wrench, FileText, Sparkles, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/recommendations', label: 'AI Services', icon: Sparkles },
];

function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary',
            pathname === item.href && 'bg-primary/10 text-primary'
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AppSidebar() {
  return (
    <>
      <aside className="fixed left-0 top-0 z-10 hidden h-screen w-64 border-r bg-card md:flex flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold font-headline">
            <Home className="h-7 w-7 text-primary" />
            <span className="text-lg">HomeHub</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav />
        </div>
      </aside>

      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold font-headline">
          <Home className="h-7 w-7 text-primary" />
          <span className="text-lg">HomeHub</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col p-4">
            <div className="flex h-16 items-center border-b px-2 mb-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Home className="h-7 w-7 text-primary" />
                    <span className="text-lg">HomeHub</span>
                </Link>
            </div>
            <SidebarNav />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
