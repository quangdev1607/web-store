/**
 * Product Filter Component
 * Provides filtering and sorting controls for product listing
 */
import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SORT_OPTIONS } from '@/config/constants';

interface ProductFilterProps {
  /** Current search query */
  searchQuery?: string;
  /** Current category filter */
  category?: string;
  /** Current sort option */
  sortBy?: string;
  /** Available categories for filter */
  categories?: string[];
  /** Callback when filter changes */
  onSearchChange?: (value: string) => void;
  /** Callback when category changes */
  onCategoryChange?: (value: string) => void;
  /** Callback when sort changes */
  onSortChange?: (value: string) => void;
  /** Callback when filters are cleared */
  onClearFilters?: () => void;
}

/**
 * ProductFilter provides UI controls for filtering products
 */
export function ProductFilter({
  searchQuery = '',
  category,
  sortBy = 'newest',
  categories = [],
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClearFilters,
}: ProductFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(localSearch);
  };

  const hasActiveFilters = searchQuery || category !== 'all';

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="secondary">
          Tìm
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(showFilters && 'bg-accent')}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </form>

      {/* Advanced filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
          {/* Category filter */}
          <div className="flex-1 min-w-[200px]">
            <Select
              value={category || 'all'}
              onValueChange={(value) => onCategoryChange?.(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort options */}
          <div className="flex-1 min-w-[200px]">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={() => {
                onClearFilters?.();
                setLocalSearch('');
              }}
              className="text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      )}
    </div>
  );
}