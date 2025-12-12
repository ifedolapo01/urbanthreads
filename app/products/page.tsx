'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/data';
import { Filter } from 'lucide-react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Filter by price range
  const priceFilteredProducts = selectedPriceRange === 'all' 
    ? filteredProducts 
    : filteredProducts.filter(product => {
        switch(selectedPriceRange) {
          case 'under-10000':
            return product.price < 10000;
          case '10000-20000':
            return product.price >= 10000 && product.price <= 20000;
          case 'over-20000':
            return product.price > 20000;
          default:
            return true;
        }
      });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm border text-black">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="md:hidden text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {['all', 'men', 'women'].map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded capitalize ${
                        selectedCategory === category
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {category === 'all' ? 'All Products' : `${category}'s Clothing`}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Price Range (₦)</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'under-10000', label: 'Under ₦10,000' },
                    { value: '10000-20000', label: '₦10,000 - ₦20,000' },
                    { value: 'over-20000', label: 'Over ₦20,000' }
                  ].map(range => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedPriceRange(range.value)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        selectedPriceRange === range.value
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Our Collection</h1>
              <p className="text-gray-600">
                {priceFilteredProducts.length} products found
              </p>
            </div>
            <button 
              onClick={() => setShowFilters(true)}
              className="md:hidden flex items-center px-4 py-2 border rounded-lg"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
          
          {priceFilteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {priceFilteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}