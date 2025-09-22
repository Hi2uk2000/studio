
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  CreditCard,
  Wrench,
  FileText,
  Menu,
  CircleUserRound,
  HelpCircle,
  LogOut,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/home-management', label: 'Home Management', icon: Home },
  { href: '/expenses', label: 'Expenses', icon: CreditCard },
  { href: '/assets', label: 'Assets', icon: Building },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/documents', label: 'Documents', icon: FileText },
];

/**
 * Renders the main navigation for the application.
 * Highlights the active link based on the current pathname.
 * @returns {JSX.Element} The SidebarNav component.
 */
function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="grid items-start gap-1 px-2 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            (pathname.startsWith(item.href) && item.href !== '/') || (pathname === '/' && item.href === '/') ? 'bg-muted text-primary' : ''
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Renders the user profile section in the sidebar.
 * It displays the user's avatar, name, and email, and provides a dropdown menu with options for profile, help, and sign out.
 * @returns {JSX.Element | null} The UserProfile component, or null if there is no authenticated user.
 */
function UserProfile() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    if (!user) return null;

    return (
        <div className="mt-auto p-2">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 w-full justify-start p-2 h-auto">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL ?? ''} />
                            <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="text-sm font-medium">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <CircleUserRound className="mr-2 h-4 w-4" />
                        <span>Profile & Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}


/**
 * The main layout for the sidebar content, including the logo, navigation, and user profile.
 * @returns {JSX.Element} The SidebarContentLayout component.
 */
function SidebarContentLayout() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-bold font-headline">
          <Home className="h-7 w-7 text-primary" />
          <span className="text-lg">AssetStream</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
      <div className="mt-auto">
        <UserProfile />
      </div>
    </div>
  );
}


/**
 * The main application sidebar component.
 * It renders a fixed sidebar for desktop and a sheet-based menu for mobile.
 * The sidebar is not displayed on certain routes like login and register.
 * @returns {JSX.Element | null} The AppSidebar component, or null if the route does not require a sidebar.
 */
export function AppSidebar() {
  const pathname = usePathname();

  const noSidebarRoutes = ['/login', '/register', '/register/home-setup'];
  if (noSidebarRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      <aside className="fixed left-0 top-1/2 -translate-y-1/2 z-10 hidden h-[95vh] w-64 flex-col rounded-r-lg border-y border-r bg-card md:flex">
        <SidebarContentLayout />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:hidden">
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
