'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';
import { ShieldAlert } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
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
          <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '30px' }}>Access restricted to store managers. Enter your credentials to unlock the professional dashboard.</p>
          
          <form onSubmit={handleLogin}>
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Email</label>
              <input 
                type="email" 
                style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '15px' }}
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Password</label>
              <input 
                type="password" 
                style={{ width: '100%', padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '15px' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'var(--color-error)', fontSize: '13px', marginBottom: '15px', textAlign: 'left' }}>{error}</p>}
            <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
              {isLoading ? 'Authenticating...' : 'Unlock Dashboard'}
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
