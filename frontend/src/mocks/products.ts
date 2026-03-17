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
        name: "Tai nghe Bluetooth không dây",
        description: "Tai nghe không dây chất lượng cao với tính năng khử tiếng ồn và thời lượng pin 30 giờ.",
        price: 89.99,
        category: "Điện tử",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        ],
        inStock: true,
        rating: 4.5,
    },
    {
        id: "2",
        name: "Đồng hồ thông minh Series 5",
        description: "Đồng hồ thông minh đa năng với tính năng theo dõi nhịp tim, GPS và khả năng chống nước 50m.",
        price: 199.99,
        category: "Điện tử",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
        ],
        inStock: true,
        rating: 4.3,
    },
    {
        id: "3",
        name: "Áo thun Cotton hữu cơ",
        description: "Áo thun thoải mái và thân thiện với môi trường, được làm từ 100% cotton hữu cơ.",
        price: 24.99,
        category: "Quần áo",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=400",
        ],
        inStock: true,
        rating: 4.0,
    },
    {
        id: "4",
        name: "Balo da",
        description: "Balo da bền bỉ với nhiều ngăn chứa máy tính xách tay và phụ kiện.",
        price: 79.99,
        category: "Phụ kiện",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
            "https://images.unsplash.com/photo-1549943872-f7ff0b2b51be?w=400",
        ],
        inStock: false,
        rating: 4.7,
    },
    {
        id: "5",
        name: "Máy pha cà phê Deluxe",
        description: "Máy pha cà phê có thể lập trình với bình giữ nhiệt và các chế độ kiểm soát độ đậm đặc.",
        price: 129.99,
        category: "Nhà cửa & Bếp",
        images: ["https://images.unsplash.com/photo-1569161238483-4c6375c59d68?w=400"],
        inStock: true,
        rating: 4.2,
    },
    {
        id: "6",
        name: "Thảm Yoga cao cấp",
        description: "Thảm yoga chống trượt có vạch định hướng căn chỉnh và kèm theo dây đeo.",
        price: 39.99,
        category: "Thể thao & Ngoài trời",
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
