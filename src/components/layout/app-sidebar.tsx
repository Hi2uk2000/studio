'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, CreditCard, Wrench, FileText, Sparkles, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

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

function UserProfile() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };
    
    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-full justify-start gap-2 px-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'}/>
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                     <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{user.displayName}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function AppSidebar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (pathname === '/login' || loading) {
    return null;
  }

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
         <div className="mt-auto p-4 border-t">
            <UserProfile />
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
            <div className="mt-auto p-2 border-t">
                <UserProfile />
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
