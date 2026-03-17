export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    inStock: boolean;
    rating?: number;
}

export const mockProducts: Product[] = [
    {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: 89.99,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        ],
        inStock: true,
        rating: 4.5,
    },
    {
        id: "2",
        name: "Smart Watch Series 5",
        description: "Feature-rich smartwatch with heart rate monitoring, GPS, and 50m water resistance.",
        price: 199.99,
        category: "Electronics",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
        ],
        inStock: true,
        rating: 4.3,
    },
    {
        id: "3",
        name: "Organic Cotton T-Shirt",
        description: "Comfortable and eco-friendly t-shirt made from 100% organic cotton.",
        price: 24.99,
        category: "Clothing",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            "https://images.unsplash.com/photo-1583743814966-8936c5b7de1a?w=400",
        ],
        inStock: true,
        rating: 4.0,
    },
    {
        id: "4",
        name: "Leather Backpack",
        description: "Durable leather backpack with multiple compartments for laptop and accessories.",
        price: 79.99,
        category: "Accessories",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
            "https://images.unsplash.com/photo-1603334806442-887a26816e70?w=400",
        ],
        inStock: false,
        rating: 4.7,
    },
    {
        id: "5",
        name: "Coffee Maker Deluxe",
        description: "Programmable coffee maker with thermal carafe and strength control settings.",
        price: 129.99,
        category: "Home & Kitchen",
        images: ["https://images.unsplash.com/photo-1569161238483-4c6375c59d68?w=400"],
        inStock: true,
        rating: 4.2,
    },
    {
        id: "6",
        name: "Yoga Mat Premium",
        description: "Non-slip yoga mat with alignment guides and carrying strap included.",
        price: 39.99,
        category: "Sports & Outdoors",
        images: [
            "https://images.unsplash.com/photo-1637157216470-d92cd2edb2e8?w=400",
            "https://images.unsplash.com/photo-1641913640860-ab4c2bfb2bb0?w=400",
        ],
        inStock: true,
        rating: 4.4,
    },
];

export const getProductsByCategory = (category: string): Product[] => {
    return mockProducts.filter((product) => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
    return mockProducts.find((product) => product.id === id);
};
