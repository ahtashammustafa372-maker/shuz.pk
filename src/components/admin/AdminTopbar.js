'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ExternalLink, UserCircle, Bell, LogOut } from 'lucide-react';

export default function AdminTopbar() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      try {
        await fetch('/api/notifications', { method: 'PUT' });
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    window.location.reload();
  };

  return (
    <header style={{
      height: '60px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e4e4e7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      position: 'sticky',
      top: 0,
      zIndex: 999
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#18181b' }}>Admin Panel</h1>
        <Link href="/" target="_blank" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#3f3f46',
          textDecoration: 'none',
          backgroundColor: '#f4f4f5',
          padding: '6px 12px',
          borderRadius: '20px',
          fontWeight: '500'
        }}>
          View Live Store <ExternalLink size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button onClick={handleToggleNotifications} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', position: 'relative' }}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', width: '320px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e4e4e7', zIndex: 1000, overflow: 'hidden' }}>
              <div style={{ padding: '12px 15px', borderBottom: '1px solid #e4e4e7', backgroundColor: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Notifications</h3>
              </div>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px' }}>No notifications yet.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ padding: '12px 15px', borderBottom: '1px solid #f4f4f5', backgroundColor: n.read ? '#fff' : '#f0f9ff' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#18181b', marginBottom: '2px' }}>{n.title}</div>
                      <div style={{ fontSize: '12px', color: '#52525b', marginBottom: '4px' }}>{n.message}</div>
                      <div style={{ fontSize: '10px', color: '#a1a1aa' }}>{new Date(n.created_at).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '20px', borderLeft: '1px solid #e4e4e7' }}>
          <UserCircle size={28} color="#71717a" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#18181b' }}>Admin User</span>
            <span style={{ fontSize: '11px', color: '#71717a' }}>admin@jutay.co</span>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ marginLeft: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '500' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
