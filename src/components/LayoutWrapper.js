'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // If we are in the admin panel, just render the children without storefront headers
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Otherwise, render the full storefront layout
  return (
    <UserProvider>
      <CartProvider>
        <Header />
      <CartDrawer />
      <main style={{ minHeight: '60vh' }}>
        {children}
      </main>
      

      <Footer />
      </CartProvider>
    </UserProvider>
  );
}
