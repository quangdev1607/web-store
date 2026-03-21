import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/**
 * HomePage - Main landing page of the bakery store
 * Displays welcome message, category shortcuts, and CTA to browse products
 */
export function HomePage() {
  return (
    <div className="space-y-8 text-center">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-primary-foreground">
          Chào Mừng Đến Với Tiệm Bánh Bé Yêu! 🍰
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Khám phá thế giới bánh kẹo hữu cơ và snacks lành tính dành riêng cho bé yêu! Đầy ắp những món ngon
          thuần khiết, giàu dinh dưỡng và vẹn tròn vị ngọt tự nhiên đang chờ đón các thiên thần nhỏ.
        </p>
      </div>

      {/* Category Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
        {[
          { emoji: '🍭', label: 'Kẹo' },
          { emoji: '🍰', label: 'Bánh' },
          { emoji: '🥛', label: 'Sữa' },
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

      {/* CTA Button */}
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

      {/* Background Image */}
      <div className="mt-12 rounded-2xl overflow-hidden">
        <img
          src="/background.jpg"
          alt="Background"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}
