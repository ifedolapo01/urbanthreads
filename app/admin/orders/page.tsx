// app/admin/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Package, Truck, Home, RefreshCw, Search, Filter, Eye } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  delivery_option: 'pickup' | 'delivery';
  selected_state: string;
  payment_verified: boolean;
  created_at: string;
  receipt_url?: string | null;
  customer_phone?: string;
  delivery_address?: string | null;
  city?: string | null;
  order_items?: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshOrders = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh orders to get updated data
        refreshOrders();
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  // Apply search filter
  const searchedOrders = searchTerm
    ? filteredOrders.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredOrders;

  const getStatusIcon = (status: Order['status']) => {
    switch(status) {
      case 'pending': return <Package className="text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="text-blue-500" />;
      case 'shipped': return <Truck className="text-purple-500" />;
      case 'delivered': return <Home className="text-green-500" />;
      case 'cancelled': return <XCircle className="text-red-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewOrderDetails = (orderId: string) => {
    // You can implement a modal or separate page for order details
    console.log('View order details:', orderId);
    // For now, just show an alert with the order ID
    alert(`View details for order ${orderId}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Orders</h1>
          <p className="text-gray-600 mt-1">
            {searchedOrders.length} order{searchedOrders.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={refreshOrders}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap flex items-center gap-2 ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? (
                  <>
                    <Filter className="w-4 h-4" />
                    All Orders
                  </>
                ) : (
                  <>
                    {getStatusIcon(status as any)}
                    {status}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {searchedOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 md:p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No orders found' : 'No orders yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try a different search term' 
              : 'Orders will appear here when customers place them'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {searchedOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow border overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 md:mb-6">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {getStatusIcon(order.status)}
                      <span className="font-bold text-lg text-gray-900">{order.order_number}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.payment_verified 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.payment_verified ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {order.customer_name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.customer_email}
                      </p>
                      {order.customer_phone && (
                        <p className="text-gray-600 text-sm">
                          📞 {order.customer_phone}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        order.delivery_option === 'pickup' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.delivery_option === 'pickup' ? 'Pickup' : 'Delivery'} • {order.selected_state}
                      </span>
                      {order.receipt_url && (
                        <a
                          href={order.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200"
                        >
                          View Receipt
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-2xl text-gray-900">
                      ₦{order.total_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(order.created_at)}
                    </p>
                    {order.delivery_option === 'delivery' && order.delivery_address && (
                      <p className="text-sm text-gray-600 mt-2 max-w-xs">
                        📍 {order.delivery_address}, {order.city}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Order Items Preview */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-700 text-sm mb-2">Order Items:</p>
                    <div className="space-y-1">
                      {order.order_items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.product_name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {order.order_items.length > 3 && (
                        <p className="text-gray-500 text-xs mt-1">
                          +{order.order_items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order ID: <span className="font-mono text-gray-800">{order.id.slice(0, 8)}...</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                      onClick={() => viewOrderDetails(order.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ₦{orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-600">Paid Orders</p>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.payment_verified).length}
          </p>
        </div>
      </div>
    </div>
  );
}