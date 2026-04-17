/**
 * Layout Component
 * Main application wrapper that provides consistent header, main content area, and footer
 */
import type { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';

interface LayoutProps {
  /** Content to render in the main area */
  children: ReactNode;
  /** Whether to show footer (default: true) */
  showFooter?: boolean;
}

/**
 * Main layout component with header and footer
 */
export function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full py-6 px-4 sm:px-6 lg:px-8 pb-12">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}