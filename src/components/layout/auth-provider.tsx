// src/components/layout/auth-provider.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const protectedRoutes = ['/', '/expenses', '/maintenance', '/documents', '/recommendations'];
const publicRoutes = ['/login', '/register', '/register/home-setup'];


export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = protectedRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && isProtectedRoute) {
      router.push('/login');
    }
    
    if(user && isPublicRoute){
       router.push('/');
    }
    
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>;
  }
  
  if (!user && protectedRoutes.includes(pathname)) {
    return null; // or a loading spinner
  }
  
  if(user && publicRoutes.includes(pathname)){
    return null;
  }

  return <>{children}</>;
}
