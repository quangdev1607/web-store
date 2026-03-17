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
        name: "Kẹo Mút Hình Thú",
        description: "Kẹo mút ngọt ngào với nhiều hình thú dễ thương. An toàn cho trẻ em, không chất bảo quản độc hại.",
        price: 15000,
        category: "Kẹo",
        images: [
            "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        ],
        inStock: true,
        rating: 5.0,
    },
    {
        id: "2",
        name: "Bánh Quy Socola Chip",
        description: "Bánh quy giòn tan với socola chip mịn màng. Thơm ngon, là món ăn vặt yêu thích của các bé.",
        price: 25000,
        category: "Bánh quy",
        images: [
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
            "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        ],
        inStock: true,
        rating: 4.8,
    },
    {
        id: "3",
        name: "Kẹo Chew Cola",
        description: "Kẹo nhai hương cola sảng khoái, dai dai thú vị. Bé sẽ thích mê ngay từ miếng đầu tiên!",
        price: 12000,
        category: "Kẹo",
        images: [
            "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400",
        ],
        inStock: true,
        rating: 4.5,
    },
    {
        id: "4",
        name: "Snack Khoai Tây",
        description: "Khoai tây chiên giòn rụm, vị nhẹ nhàng phù hợp cho trẻ. Đảm bảo an toàn thực phẩm.",
        price: 20000,
        category: "Snack",
        images: [
            "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400",
            "https://images.unsplash.com/photo-1576645741384-3b5a62bac974?w=400",
        ],
        inStock: true,
        rating: 4.3,
    },
    {
        id: "5",
        name: "Kẹo Sữa Dồn Hộp",
        description: "Kẹo sữa béo ngậy, thơm ngon đậm đà. Đóng hộp xinh xắn, tiện mang đi học.",
        price: 18000,
        category: "Kẹo",
        images: [
            "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
        ],
        inStock: true,
        rating: 4.7,
    },
    {
        id: "6",
        name: "Bánh Gối Mini",
        description: "Bánh gối giòn nhẹ, nhân ngọt hấp dẫn. Kích thước mini vừa vặn cho các bé.",
        price: 22000,
        category: "Bánh quy",
        images: [
            "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
        ],
        inStock: true,
        rating: 4.2,
    },
    {
        id: "7",
        name: "Kẹo Marshmallow",
        description: "Kẹo marshmallow mềm mịn, ngọt dịu. Có thể nướng lên lửa hoặc ăn trực tiếp đều ngon!",
        price: 28000,
        category: "Kẹo",
        images: [
            "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400",
        ],
        inStock: true,
        rating: 4.9,
    },
    {
        id: "8",
        name: "Nước Ép Trái Cây",
        description: "Nước ép tự nhiên 100% từ trái cây tươi, không đường phụ gia. Bổ sung vitamin cho bé.",
        price: 35000,
        category: "Đồ uống",
        images: [
            "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
        ],
        inStock: true,
        rating: 4.6,
    },
];

export const getProductsByCategory = (category: string): Product[] => {
    return mockProducts.filter((product) => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
    return mockProducts.find((product) => product.id === id);
};
