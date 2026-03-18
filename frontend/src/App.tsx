import { Layout } from "@/components/shared/layout";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { CartProvider, useCart } from "@/hooks/use-cart";
import { getProductById } from "@/mocks/products";
import { CheckoutPage } from "@/pages/checkout";
import { ProductsPage } from "@/pages/products";
import { ArrowLeft, CheckCircle, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { formatPrice } from "./components/shared/product-card";

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </CartProvider>
    );
}

function HomePage() {
    return (
        <div className="space-y-8 text-center">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-primary-foreground">Chào Mừng Đến Với Tiệm Bánh Bé Yêu! 🍰</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Khám phá thế giới bánh kẹo hữu cơ và snacks lành tính dành riêng cho bé yêu! Đầy ắp những món ngon
                    thuần khiết, giàu dinh dưỡng và vẹn tròn vị ngọt tự nhiên đang chờ đón các thiên thần nhỏ.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                {[
                    { emoji: "🍭", label: "Kẹo" },
                    { emoji: "🍰", label: "Bánh" },
                    { emoji: "🥛", label: "Sữa" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="bg-secondary/50 rounded-2xl p-4 hover:bg-secondary transition-colors"
                    >
                        <span className="text-3xl">{item.emoji}</span>
                        <p className="font-semibold mt-2">{item.label}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center">
                <Link to="/products">
                    <Button
                        size="lg"
                        className="px-8 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-full"
                    >
                        Khám Phá Ngay
                    </Button>
                </Link>
            </div>
            <div className="mt-12 rounded-2xl overflow-hidden">
                <img src="/background.jpg" alt="Background" className="w-full h-auto object-cover" />
            </div>
        </div>
    );
}

function CartPage() {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Giỏ Kẹo Của Bé</h1>
                <div className="border rounded-2xl p-6">
                    <p className="text-center text-muted-foreground py-8">Giỏ bánh còn trống lắm!</p>
                    <div className="text-center">
                        <Link to="/products">
                            <Button variant="outline" className="rounded-full">
                                Mua Bánh Thôi!
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Giỏ Bánh Của Bé ({totalItems} món)</h1>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.product.id} className="flex gap-4 border rounded-2xl p-4 bg-card">
                            <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium">{item.product.name}</h3>
                                <p className="text-muted-foreground text-sm">{item.product.category}</p>
                                <p className="font-semibold mt-2 text-primary-foreground">
                                    {formatPrice(item.product.price)}
                                </p>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => removeItem(item.product.id)}
                                    className="text-destructive text-sm hover:underline"
                                >
                                    Xóa
                                </button>
                                <div className="flex items-center gap-2 bg-secondary/30 rounded-full px-2">
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full hover:bg-secondary transition-colors flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full hover:bg-secondary transition-colors flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border rounded-2xl p-6 h-fit space-y-4 bg-card">
                    <h2 className="font-semibold text-lg">Tổng Kết</h2>
                    <div className="flex justify-between">
                        <span>Tạm Tính</span>
                        <span className="font-semibold">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Giao Hàng</span>
                        <span className="text-green-600 font-semibold">Miễn Phí</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Tổng Cộng</span>
                        <span className="text-primary-foreground">{formatPrice(totalPrice)}</span>
                    </div>
                    <Button className="w-full rounded-full" onClick={() => navigate("/checkout")}>
                        Thanh Toán Ngay
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const product = id ? getProductById(id) : undefined;

    if (!product) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Không Tìm Thấy Sản Phẩm</h1>
                <div className="border rounded-2xl p-6">
                    <p className="text-center text-muted-foreground py-8">Ồ! Sản phẩm này đi đâu mất rồi!</p>
                    <div className="text-center">
                        <Link to="/products">
                            <Button variant="outline" className="rounded-full">
                                Quay Lại
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem(product, quantity);
        setQuantity(1);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
        ));
    };

    return (
        <div className="space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-muted-foreground hover:text-primary transition-colors font-medium"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay Lại
            </button>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20">
                        <Image
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                                        selectedImage === idx
                                            ? "border-primary"
                                            : "border-transparent hover:border-secondary"
                                    }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1 font-medium">{product.category}</p>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex">{renderStars(product.rating || 0)}</div>
                            <span className="text-sm text-muted-foreground">
                                ({product.rating?.toFixed(1) || "Chưa"} sao)
                            </span>
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-primary-foreground">{formatPrice(product.price)}</div>

                    <div className="flex items-center gap-2">
                        {product.inStock ? (
                            <>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-green-600 font-medium">Còn Hàng</span>
                            </>
                        ) : (
                            <span className="text-destructive font-medium">Hết Hàng</span>
                        )}
                    </div>

                    <p className="text-muted-foreground">{product.description}</p>

                    {product.inStock && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">Số lượng:</span>
                                <div className="flex items-center border rounded-full bg-secondary/30">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-secondary transition-colors rounded-l-full"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 hover:bg-secondary transition-colors rounded-r-full"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <Button onClick={handleAddToCart} className="w-full sm:w-auto rounded-full" size="lg">
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Thêm Vào Giỏ
                            </Button>
                        </div>
                    )}

                    {!product.inStock && (
                        <Button disabled className="w-full rounded-full" size="lg">
                            Hết Hàng
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function NotFoundPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 space-y-6 text-center">
            <span className="text-6xl">🍪</span>
            <h1 className="text-3xl font-bold">404 - Trang Không Tìm Thấy</h1>
            <p className="text-muted-foreground max-w-2xl">Ôi không! Trang này đi đâu mất rồi!</p>
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

export default App;
