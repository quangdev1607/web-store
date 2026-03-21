import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage - 404 error page
 * Displayed when user navigates to a non-existent route
 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 space-y-6 text-center">
      {/* Error Icon */}
      <span className="text-6xl">🍪</span>

      {/* Error Message */}
      <h1 className="text-3xl font-bold">404 - Trang Không Tìm Thấy</h1>
      <p className="text-muted-foreground max-w-2xl">Ôi không! Trang này đi đâu mất rồi!</p>

      {/* Navigation Options */}
      <div className="flex justify-center space-x-4">
        <Link to="/">
          <Button className="rounded-full">Về Trang Chủ</Button>
        </Link>
        <Link to="/products">
          <Button variant="outline" className="rounded-full">
            Mua Bánh Thôi
          </Button>
        </Link>
      </div>
    </div>
  );
}
