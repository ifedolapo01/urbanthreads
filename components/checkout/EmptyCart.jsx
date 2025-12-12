import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h1>
      <Link
        href="/products"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Shop Now
      </Link>
    </div>
  );
}