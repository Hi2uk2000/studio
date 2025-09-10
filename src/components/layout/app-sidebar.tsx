
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, CreditCard, Wrench, FileText, Menu, LogOut, Building, Settings } from 'lucide-react';
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
  { href: '/home-management', label: 'Home Management', icon: Home },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/assets', label: 'Assets', icon: Building },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/profile', label: 'Profile & Settings', icon: Settings },
];

function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  
  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant={pathname.startsWith(item.href) && item.href !== '/' || pathname === '/' && item.href === '/' ? "secondary" : "ghost"}
          className="w-full justify-start gap-3"
          onClick={() => router.push(item.href)}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </Button>
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
        <div className="space-y-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-full justify-start gap-2 px-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'}/>
                            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-left -space-y-1">
                            <span className="text-base font-medium truncate">{user.displayName}</span>
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
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile & Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export function AppSidebar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const noSidebarRoutes = ['/login', '/register', '/register/home-setup'];
  if (noSidebarRoutes.includes(pathname) || loading) {
    return null;
  }
  
  const SidebarContentLayout = () => (
    <>
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-bold font-headline">
            <Home className="h-7 w-7 text-primary" />
            <span className="text-lg">AssetStream</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <SidebarNav />
      </div>
      <div className="border-t p-2">
        <UserProfile />
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 z-10 hidden h-screen w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-bold font-headline">
                    <Home className="h-7 w-7 text-primary" />
                    <span className="text-lg">AssetStream</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                <SidebarNav />
            </div>
            <div className="border-t p-2">
                <UserProfile />
            </div>
        </div>
      </aside>

      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold font-headline">
          <Home className="h-7 w-7 text-primary" />
          <span className="text-lg">AssetStream</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-64">
             <div className="flex h-full flex-col">
                <div className="flex h-16 shrink-0 items-center border-b px-4">
                    <Link href="/" className="flex items-center gap-2 font-bold font-headline">
                        <Home className="h-7 w-7 text-primary" />
                        <span className="text-lg">AssetStream</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    <SidebarNav />
                </div>
                <div className="border-t p-2">
                    <UserProfile />
                </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
