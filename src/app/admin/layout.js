'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';
import { ShieldAlert } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Admin Password. Hint: admin123');
    }
  };

  if (isChecking) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5' }}></div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f4f5' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShieldAlert size={30} style={{ color: 'var(--color-sale)' }} />
          </div>
          <h2 style={{ marginBottom: '10px', fontSize: '24px', fontWeight: '700' }}>Admin Login Required</h2>
          <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '30px' }}>Access restricted to store managers. Enter password below to unlock the professional dashboard.</p>
          
          <form onSubmit={handleLogin}>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Password</label>
              <input 
                type="password" 
                style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '15px' }}
                placeholder="Hint: admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p style={{ color: 'var(--color-error)', fontSize: '13px', marginBottom: '15px', textAlign: 'left' }}>{error}</p>}
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#f4f4f5', minHeight: '100vh' }}>
      <AdminSidebar />
      <div style={{ marginLeft: '250px', width: 'calc(100% - 250px)', display: 'flex', flexDirection: 'column' }}>
        <AdminTopbar />
        <main style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
