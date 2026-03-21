/**
 * Layout Component
 * Main application wrapper that provides consistent header and main content area
 * 
 * Features:
 * - Sticky header with navigation
 * - Cart icon with item count badge
 * - Responsive design
 */
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  /** Content to render in the main area */
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { totalItems } = useCart();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/logo.png" alt="Logo" className="h-24 w-auto" />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/products" className="text-sm font-semibold hover:text-primary transition-colors">
                            <span className="hidden sm:inline">Sản phẩm</span>
                        </Link>
                        <Link to="/cart" className="relative flex items-center hover:text-primary transition-colors">
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </nav>
            </header>
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 pb-12">{children}</main>
        </div>
    );
}
