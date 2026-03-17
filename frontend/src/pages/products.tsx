import { ProductCard } from "@/components/shared/product-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProducts } from "@/mocks/products";
import type { Product } from "@/types";
import { Search } from "lucide-react";
import { useState } from "react";

export function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
    const [sortBy, setSortBy] = useState<string>("featured");

    const categories = ["Tất cả", ...Array.from(new Set(mockProducts.map((p: Product) => p.category)))];

    const filteredProducts = mockProducts
        .filter(
            (product: Product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .filter((product: Product) => selectedCategory === "Tất cả" || product.category === selectedCategory)
        .sort((a: Product, b: Product) => {
            if (sortBy === "price-low-high") return a.price - b.price;
            if (sortBy === "price-high-low") return b.price - a.price;
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            return 0; // featured/default
        });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="w-full max-w-xs"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-3 w-full sm:w-auto">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Danh mục:</span>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tất Cả Danh Mục" />
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
                        <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Nổi Bật" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="featured">Nổi Bật</SelectItem>
                                <SelectItem value="price-low-high">Giá: Thấp đến Cao</SelectItem>
                                <SelectItem value="price-high-low">Giá: Cao đến Thấp</SelectItem>
                                <SelectItem value="rating">Đánh Giá: Cao đến Thấp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product: Product) => <ProductCard key={product.id} product={product} />)
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
