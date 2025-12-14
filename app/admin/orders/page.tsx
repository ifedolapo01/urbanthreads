// app/admin/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Package, Truck, Home } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryOption: 'pickup' | 'delivery';
  selectedState: string;
  paymentVerified: boolean;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // Mock data - replace with API
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'UT123456',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        total: 28500,
        status: 'pending',
        deliveryOption: 'delivery',
        selectedState: 'Abuja',
        paymentVerified: true,
        createdAt: '2024-01-15T10:30:00Z',
      },
    ];
    setOrders(mockOrders);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // API call to update status
    console.log('Updating order:', orderId, newStatus);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusIcon = (status: Order['status']) => {
    switch(status) {
      case 'pending': return <Package className="text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="text-blue-500" />;
      case 'shipped': return <Truck className="text-purple-500" />;
      case 'delivered': return <Home className="text-green-500" />;
      case 'cancelled': return <XCircle className="text-red-500" />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      
      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(order.status)}
                  <span className="font-bold">{order.orderNumber}</span>
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.paymentVerified 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentVerified ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <p className="text-gray-600">{order.customerName} • {order.customerEmail}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">₦{order.total.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {order.deliveryOption === 'pickup' ? 'Pickup' : 'Delivery'} to {order.selectedState}
                </p>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  className="border rounded-lg px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}