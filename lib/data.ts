export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // This will now be in Naira
  category: 'men' | 'women';
  image: string;
  colors: string[];
  sizes: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Essential Cotton Tee',
    description: 'Soft 100% cotton crewneck t-shirt. Perfect for everyday wear.',
    price: 8500, // About $5.67
    category: 'men',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop',
    colors: ['White', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Oversized Hoodie',
    description: 'Cozy oversized hoodie with kangaroo pocket.',
    price: 18000, // About $12
    category: 'men',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w-800&auto=format&fit=crop',
    colors: ['Charcoal', 'Olive', 'Burgundy'],
    sizes: ['M', 'L', 'XL']
  },
  {
    id: '3',
    name: 'Slim Fit Chinos',
    description: 'Modern slim-fit chinos with stretch for comfort.',
    price: 12500, // About $8.33
    category: 'men',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop',
    colors: ['Khaki', 'Navy', 'Grey'],
    sizes: ['30x32', '32x32', '34x32']
  },
  {
    id: '4',
    name: 'Wrap Midi Dress',
    description: 'Elegant wrap dress with adjustable tie waist.',
    price: 22000, // About $14.67
    category: 'women',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
    colors: ['Emerald', 'Black', 'Dusty Rose'],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: '5',
    name: 'High-Waist Leggings',
    description: 'Buttery soft leggings with high-waist support.',
    price: 9500, // About $6.33
    category: 'women',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
    colors: ['Black', 'Charcoal', 'Plum'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '6',
    name: 'Denim Jacket',
    description: 'Classic denim jacket with modern tailoring.',
    price: 16500, // About $11
    category: 'women',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop',
    colors: ['Light Wash', 'Dark Wash'],
    sizes: ['S', 'M', 'L']
  }
];