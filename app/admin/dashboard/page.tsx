// app/admin/dashboard/page.tsx
'use client';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Total Products</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₦0</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <a 
            href="/admin/products" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Product
          </a>
          <a 
            href="/admin/orders" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View Orders
          </a>
        </div>
      </div>
    </div>
  );
}