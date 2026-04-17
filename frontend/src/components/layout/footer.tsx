/**
 * Footer Component
 * Application footer with company info and links
 */
import { Link } from 'react-router-dom';

/**
 * Footer component
 */
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Cửa hàng bánh ngọt chính hãng - Với nhiều năm kinh nghiệm trong ngành
              làm bánh, chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng
              nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold">Liên kết nhanh</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Đơn hàng của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">Liên hệ</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Email: contact@bakery.com</li>
              <li>Điện thoại: 1900 xxxx</li>
              <li>Địa chỉ: TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Bakery Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}