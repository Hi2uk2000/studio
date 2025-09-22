
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/hooks/use-auth';
import { AuthLayout } from '@/components/layout/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'AssetStream',
  description: 'Your all-in-one home management solution.',
};

/**
 * The root layout for the application.
 * It wraps all pages with necessary providers and components.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The RootLayout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased bg-background')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthLayout>
              <div className="relative flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 md:pl-64">
                  {children}
                </main>
              </div>
              <Toaster />
            </AuthLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
