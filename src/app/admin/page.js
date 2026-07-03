'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShoppingCart, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [pRes, oRes, uRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/users')
        ]);
        
        if (pRes.ok && oRes.ok && uRes.ok) {
          const products = await pRes.json();
          const orders = await oRes.json();
          const users = await uRes.json();
          
          const revenue = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0);
          const recentOrders = [...orders].reverse().slice(0, 5);

          setStats({
            products: products.length,
            orders: orders.length,
            users: users.length,
            revenue,
            recentOrders
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#18181b' }}>Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#71717a', fontWeight: '600', textTransform: 'uppercase' }}>Total Revenue</p>
            <h3 style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: '700', color: '#18181b' }}>Rs. {stats.revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#71717a', fontWeight: '600', textTransform: 'uppercase' }}>Total Orders</p>
            <h3 style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: '700', color: '#18181b' }}>{stats.orders}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#71717a', fontWeight: '600', textTransform: 'uppercase' }}>Products</p>
            <h3 style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: '700', color: '#18181b' }}>{stats.products}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: '#71717a', fontWeight: '600', textTransform: 'uppercase' }}>Registered Users</p>
            <h3 style={{ margin: '5px 0 0', fontSize: '24px', fontWeight: '700', color: '#18181b' }}>{stats.users}</h3>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Recent Orders</h3>
          <Link href="/admin/orders" style={{ fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500' }}>View All Orders</Link>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e4e4e7', color: '#71717a', fontSize: '13px' }}>
              <th style={{ padding: '12px' }}>Order ID</th>
              <th style={{ padding: '12px' }}>Customer</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.length > 0 ? stats.recentOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f4f4f5', fontSize: '14px' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>#{order.id}</td>
                <td style={{ padding: '12px' }}>{order.customerName}</td>
                <td style={{ padding: '12px' }}>Rs. {order.total.toLocaleString()}</td>
                <td style={{ padding: '12px' }}>
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
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#71717a' }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
