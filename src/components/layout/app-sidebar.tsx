
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, CreditCard, Wrench, FileText, Menu, LogOut, Building, User, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';


const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/home-management', label: 'Home Management', icon: Home },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/assets', label: 'Assets', icon: Building },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/documents', label: 'Documents', icon: FileText },
];

function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  
  return (
    <nav className="flex flex-col space-y-1 p-2">
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
        <div className="p-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'}/>
                            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-left -space-y-1 overflow-hidden">
                            <span className="text-sm font-medium truncate">{user.displayName}</span>
                            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                     <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile & Settings</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>Help & Support</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export function AppSidebar() {
  const pathname = usePathname();

  const noSidebarRoutes = ['/login', '/register', '/register/home-setup'];
  if (noSidebarRoutes.includes(pathname)) {
    return null;
  }
  
  const SidebarContentLayout = () => (
     <div className="flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-bold font-headline">
                <Home className="h-7 w-7 text-primary" />
                <span className="text-lg">AssetStream</span>
            </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
            <SidebarNav />
        </div>
        <div className="mt-auto border-t">
          <UserProfile />
        </div>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-1/2 -translate-y-1/2 z-10 hidden h-[95vh] w-64 flex-col rounded-r-lg border-y border-r bg-card md:flex">
        <SidebarContentLayout />
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
             <SidebarContentLayout />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
