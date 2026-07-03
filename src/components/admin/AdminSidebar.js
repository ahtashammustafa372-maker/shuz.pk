'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, Navigation, Settings, FileText, RotateCcw } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Products', href: '/admin/products', icon: <ShoppingBag size={18} /> },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={18} /> },
    { label: 'Returns', href: '/admin/returns', icon: <RotateCcw size={18} /> },
    { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
    { label: 'Category Boxes', href: '/admin/category-boxes', icon: <LayoutDashboard size={18} /> },
    { label: 'Navigation', href: '/admin/navigation', icon: <Navigation size={18} /> },
    { label: 'Footer Settings', href: '/admin/footer', icon: <LayoutDashboard size={18} /> },
    { label: 'Pages & Policies', href: '/admin/pages', icon: <FileText size={18} /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> }
  ];

  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#1e1e2f',
      color: '#fff',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #2a2a3c', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', backgroundColor: 'var(--color-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>S</div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '1px', margin: 0 }}>Shuz.pk CMS</h2>
      </div>

      <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <li key={item.label} style={{ marginBottom: '5px' }}>
                <Link href={item.href} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  color: isActive ? '#fff' : '#a1a1aa',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--color-primary)' : '4px solid transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s'
                }}>
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid #2a2a3c', fontSize: '12px', color: '#a1a1aa', textAlign: 'center' }}>
        &copy; {new Date().getFullYear()} shuz.pk
      </div>
    </aside>
  );
}
