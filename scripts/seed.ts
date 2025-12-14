// scripts/seed.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sampleProducts = [
  {
    name: 'Essential Cotton Tee',
    description: 'Soft 100% cotton crewneck t-shirt.',
    price: 8500,
    category: 'men',
    main_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    images: [],
    colors: ['White', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50,
    is_active: true,
  },
  // Add more sample products
];

async function seedDatabase() {
  // Insert products
  for (const product of sampleProducts) {
    const { error } = await supabase
      .from('products')
      .insert([product]);

    if (error) {
      console.error('Error seeding product:', error);
    }
  }

  console.log('Database seeded successfully!');
}

seedDatabase();