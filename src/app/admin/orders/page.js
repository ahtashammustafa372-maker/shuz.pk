'use client';

import React, { useState, useEffect } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#18181b' }}>Orders Management ({orders.length})</h2>

      <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f4f4f5' }}>
            <tr style={{ color: '#71717a', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '15px' }}>Order ID</th>
              <th style={{ padding: '15px' }}>Customer</th>
              <th style={{ padding: '15px' }}>Items</th>
              <th style={{ padding: '15px' }}>Total</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id || order.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                <td style={{ padding: '15px', fontWeight: '500' }}>#{order._id || order.id}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: '600', color: '#18181b', fontSize: '14px' }}>{order.customerName}</div>
                  <div style={{ fontSize: '12px', color: '#71717a', marginTop: '4px' }}>
                    {order.customerPhone}<br/>
                    {order.shippingAddress}, {order.shippingCity}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '13px', color: '#3f3f46' }}>
                    {order.items.map((item, idx) => (
                      <li key={idx}>{item.title} (x{item.quantity}) - {item.size}</li>
                    ))}
                  </ul>
                </td>
                <td style={{ padding: '15px', fontWeight: '600' }}>Rs. {order.total.toLocaleString()}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    backgroundColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Pending' ? '#fef9c3' : '#e0e7ff',
                    color: order.status === 'Delivered' ? '#16a34a' : order.status === 'Pending' ? '#ca8a04' : '#4f46e5'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id || order.id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e4e4e7', fontSize: '13px', backgroundColor: '#fff' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#71717a' }}>No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
