/**
 * Header Component
 * Main navigation header with logo, navigation links, and cart/icon
 */
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Header component with navigation
 */
export function Header() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-24 w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/products"
            className="text-sm font-semibold hover:text-primary transition-colors"
          >
            Sản phẩm
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/orders"
                className="text-sm font-semibold hover:text-primary transition-colors"
              >
                Đơn hàng
              </Link>
              {user?.roles.includes('Admin') && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold hover:text-primary transition-colors"
                >
                  Quản lý
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link to="/cart" className="relative flex items-center hover:text-primary transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-1 hover:text-primary transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">
                  {user?.firstName}
                </span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Thông tin tài khoản
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm hover:bg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đơn hàng của tôi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-accent text-destructive"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/products"
              className="block py-2 text-sm font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="block py-2 text-sm font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đơn hàng
                </Link>
                {user?.roles.includes('Admin') && (
                  <Link
                    to="/admin"
                    className="block py-2 text-sm font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Quản lý
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}