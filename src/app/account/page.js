'use client';

import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { User, MapPin, Package, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user, setUser, isHydrated } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock Orders State
  const [orders, setOrders] = useState([
    { id: 101, date: '2026-06-15', total: 18500, status: 'Delivered', product_name: 'PRIME X3 STRUNG - TRIPLE BLACK', image: '/images/sneaker_black.jpg' },
    { id: 102, date: '2026-06-25', total: 14500, status: 'Processing', product_name: 'AIRFORCE 1 MIDS - MOCHA', image: '/images/sneaker_white.jpg' }
  ]);

  // Return Modal State
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [orderToReturn, setOrderToReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('Size Issue');
  const [returnComment, setReturnComment] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  if (!isHydrated) {
    return <div style={{ minHeight: '50vh' }}></div>;
  }

  const handleLogout = () => {
    // For demo purposes, we'll just show an alert since it's a dummy user
    alert('Logged out successfully!');
    // If you had real auth, you'd clear the token and redirect
    // window.location.href = '/login';
  };

  const openReturnModal = (order) => {
    setOrderToReturn(order);
    setReturnReason('Size Issue');
    setReturnComment('');
    setReturnModalOpen(true);
  };

  const submitReturn = async (e) => {
    e.preventDefault();
    setSubmittingReturn(true);
    
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderToReturn.id,
          customer_name: user.name,
          customer_email: user.email,
          product_name: orderToReturn.product_name,
          reason: `${returnReason} - ${returnComment}`
        })
      });

      if (res.ok) {
        // Update local order status
        setOrders(orders.map(o => o.id === orderToReturn.id ? { ...o, status: 'Return Requested' } : o));
        setReturnModalOpen(false);
        alert('Return request submitted successfully. You can track it in your admin panel.');
      } else {
        alert('Failed to submit return request.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting return.');
    } finally {
      setSubmittingReturn(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 15px', minHeight: '60vh' }}>
      <div style={{ display: 'flex', gap: '30px', flexDirection: 'column' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
            <User size={40} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Hello, {user.name}</h1>
          <p style={{ color: '#6b7280' }}>{user.email}</p>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Sidebar / Tabs */}
          <div style={{ flex: '1 1 250px', backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('profile')} 
                  style={{ width: '100%', textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'profile' ? '#fff' : 'transparent', color: activeTab === 'profile' ? 'var(--color-primary)' : '#4b5563', fontWeight: activeTab === 'profile' ? '600' : '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: activeTab === 'profile' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                >
                  <User size={18} /> Account Details
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('orders')} 
                  style={{ width: '100%', textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'orders' ? '#fff' : 'transparent', color: activeTab === 'orders' ? 'var(--color-primary)' : '#4b5563', fontWeight: activeTab === 'orders' ? '600' : '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: activeTab === 'orders' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                >
                  <Package size={18} /> Order History
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('addresses')} 
                  style={{ width: '100%', textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'addresses' ? '#fff' : 'transparent', color: activeTab === 'addresses' ? 'var(--color-primary)' : '#4b5563', fontWeight: activeTab === 'addresses' ? '600' : '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: activeTab === 'addresses' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                >
                  <MapPin size={18} /> Addresses
                </button>
              </li>
              <li style={{ marginTop: '20px' }}>
                <button 
                  onClick={handleLogout} 
                  style={{ width: '100%', textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: '#fef2f2', color: '#ef4444', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div style={{ flex: '3 1 500px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '30px' }}>
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Account Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>Full Name</label>
                    <input type="text" value={user.name} readOnly style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#f9fafb' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>Email Address</label>
                    <input type="email" value={user.email} readOnly style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#f9fafb' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '5px' }}>Phone Number</label>
                    <input type="text" placeholder="+92 3XX XXXXXXX" style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                  </div>
                </div>
                <button className="btn-primary" style={{ marginTop: '30px' }}>Save Changes</button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Order History</h2>
                
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed #d1d5db', borderRadius: '8px' }}>
                    <Package size={40} style={{ color: '#d1d5db', margin: '0 auto 10px' }} />
                    <p style={{ color: '#6b7280', marginBottom: '15px' }}>You haven't placed any orders yet.</p>
                    <Link href="/collections/all" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none', padding: '8px 20px' }}>Start Shopping</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map(order => (
                      <div key={order.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <div style={{ width: '60px', height: '60px', backgroundColor: '#f9fafb', borderRadius: '8px', backgroundImage: `url(${order.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                          <div>
                            <p style={{ fontWeight: '600', color: '#18181b', marginBottom: '3px' }}>Order #{order.id}</p>
                            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '3px' }}>{order.product_name}</p>
                            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Placed on: {order.date}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: '600', color: '#18181b', marginBottom: '5px' }}>Rs. {order.total}</p>
                          <span style={{ 
                            fontSize: '12px', 
                            padding: '4px 8px', 
                            borderRadius: '20px', 
                            backgroundColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Processing' ? '#e0e7ff' : '#fef9c3',
                            color: order.status === 'Delivered' ? '#166534' : order.status === 'Processing' ? '#3730a3' : '#854d0e',
                            fontWeight: '600',
                            display: 'inline-block',
                            marginBottom: '10px'
                          }}>
                            {order.status}
                          </span>
                          {order.status === 'Delivered' && (
                            <div>
                              <button 
                                onClick={() => openReturnModal(order)}
                                style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                              >
                                Return Item
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Saved Addresses</h2>
                <div style={{ padding: '20px', border: '1px solid #d1d5db', borderRadius: '8px', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '12px', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>Default</span>
                  <p style={{ fontWeight: '600', marginBottom: '5px' }}>{user.name}</p>
                  <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                    123 Main Street<br />
                    Block 4, Clifton<br />
                    Karachi, Pakistan
                  </p>
                  <button style={{ marginTop: '15px', color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', padding: 0 }}>Edit Address</button>
                </div>
                <button className="btn-secondary" style={{ marginTop: '20px', width: '100%' }}>Add New Address</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {returnModalOpen && orderToReturn && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', width: '500px', maxWidth: '100%' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#18181b' }}>Initiate Return</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
              You are requesting a return for <strong>Order #{orderToReturn.id}</strong> ({orderToReturn.product_name}).
            </p>
            
            <form onSubmit={submitReturn}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Reason for Return</label>
                <select 
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                >
                  <option value="Size Issue">Size Issue (Too big/small)</option>
                  <option value="Defective Item">Defective or Damaged Item</option>
                  <option value="Wrong Item">Received Wrong Item</option>
                  <option value="Not as expected">Item not as expected</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Additional Comments (Optional)</label>
                <textarea 
                  value={returnComment}
                  onChange={(e) => setReturnComment(e.target.value)}
                  placeholder="Please provide more details about the issue..."
                  rows={4}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setReturnModalOpen(false)}
                  style={{ padding: '10px 15px', backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingReturn}
                  style={{ padding: '10px 15px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: submittingReturn ? 'not-allowed' : 'pointer' }}
                >
                  {submittingReturn ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
