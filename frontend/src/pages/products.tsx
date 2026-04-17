/**
 * ProductsPage - Product listing page
 * Displays all products with search, filter by category, and sort functionality
 */
import { ProductCard } from '@/components/shared/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProducts, getProductCategories } from '@/api/products';
import type { Product, ProductFilters } from '@/types';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
    const [sortBy, setSortBy] = useState<string>("featured");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    getProducts(),
                    getProductCategories()
                ]);
                setProducts(productsRes.items);
                setCategories(["Tất cả", ...categoriesRes]);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products
        .filter(
            (product: Product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
        )
        .filter((product: Product) => selectedCategory === "Tất cả" || product.category === selectedCategory)
        .sort((a: Product, b: Product) => {
            if (sortBy === "price-low-high") return (a.price || 0) - (b.price || 0);
            if (sortBy === "price-high-low") return (b.price || 0) - (a.price || 0);
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            return 0;
        });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold">Danh Sách Bánh & Kẹo</h1>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Bé ăn gì nào..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pl-9 w-full sm:w-64 rounded-full"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Loại:</span>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[140px] rounded-full">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Sắp xếp:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[140px] rounded-full">
                                <SelectValue placeholder="Nổi bật" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="featured">Nổi bật</SelectItem>
                                <SelectItem value="price-low-high">Giá: Thấp → Cao</SelectItem>
                                <SelectItem value="price-high-low">Giá: Cao → Thấp</SelectItem>
                                <SelectItem value="rating">Đánh giá</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">Đang tải sản phẩm...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product: Product) => <ProductCard key={product.id} product={product} />)
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground text-lg">Không tìm thấy món nào phù hợp!</p>
                        <p className="text-sm text-muted-foreground mt-2">Thử tìm kiếm với từ khóa khác nhé</p>
                    </div>
                )}
            </div>
        </div>
    );
}
