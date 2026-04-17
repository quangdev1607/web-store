/**
 * Product Grid Component
 * Displays a grid of products with loading and empty states
 */
import { ProductCard, ProductCardSkeleton } from './product-card';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  /** Custom empty message */
  emptyMessage?: string;
  /** Number of skeleton items to show while loading */
  skeletonCount?: number;
  /** Additional className */
  className?: string;
}

/**
 * ProductGrid displays a responsive grid of product cards
 */
export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = 'Không có sản phẩm nào',
  skeletonCount = 8,
  className,
}: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Product grid
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}