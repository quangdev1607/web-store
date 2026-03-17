import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { totalItems } = useCart();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-50">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-xl font-semibold">
                            Cửa Hàng Vạn Năng
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/products" className="text-sm font-medium hover:text-muted-foreground">
                            Sản Phẩm
                        </Link>
                        <Link to="/cart" className="relative flex items-center">
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
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
