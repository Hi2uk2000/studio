// src/components/layout/auth-provider.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const protectedRoutes = ['/', '/expenses', '/maintenance', '/documents', '/recommendations'];
const publicRoutes = ['/login', '/register', '/register/home-setup'];


/**
 * A layout component that handles authentication logic.
 * It is intended to protect routes and redirect users based on their authentication status.
 * Currently, the logic is commented out.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The AuthLayout component.
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if (loading) return;

    // const isProtectedRoute = protectedRoutes.some(route => pathname === route);
    // const isPublicRoute = publicRoutes.includes(pathname);
    
    // if (isProtectedRoute && !user) {
    //   router.push('/login');
    // }
     
    // if(user && isPublicRoute){
    //    router.push('/');
    // }
    
  }, [user, loading, router, pathname]);

  // if (loading) {
  //   return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>;
  // }
  
  // if (!user && protectedRoutes.some(route => pathname === route)) {
  //   return null; // Or a loading spinner, to prevent flicker while redirecting
  // }
  
  // if(user && publicRoutes.includes(pathname)){
  //    return null; // Or a loading spinner
  // }

  return <>{children}</>;
}
