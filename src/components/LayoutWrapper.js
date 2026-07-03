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
      
      {/* Floating Elements */}
      <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer" className="whatsapp-float">
        <svg xmlns="http://www.svgrepo.com/show/176768/whatsapp-social-media.svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'white', stroke: 'none' }}>
          <path d="M20.52 3.449a11.908 11.908 0 00-8.525-3.447C5.45 0 0 5.405 0 11.92c0 2.228.56 4.385 1.62 6.3L.12 24l5.955-1.545a11.933 11.933 0 005.92 1.572h.005c6.545 0 11.995-5.405 11.995-11.921A11.895 11.895 0 0020.52 3.45zM11.995 22.04c-1.895 0-3.755-.5-5.385-1.455l-.385-.225-4.005 1.04.105-3.92-.25-.395A9.972 9.972 0 011.995 11.92c0-5.46 4.48-9.94 9.995-9.94a9.927 9.927 0 017.065 2.925A9.945 9.945 0 0121.99 11.92c0 5.46-4.48 9.94-10.005 9.94v-.005h.01zM17.48 14.535c-.3-.15-1.785-.87-2.06-.97-.275-.1-.475-.15-.675.15s-.78.97-.955 1.17c-.175.2-.35.225-.65.075-.3-.15-1.275-.465-2.43-1.49-.895-.8-1.5-1.785-1.675-2.085-.175-.3-.02-.46.13-.61.135-.135.3-.345.45-.52.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.605-.925-2.2-.24-.58-.485-.5-.675-.51h-.575c-.2 0-.525.075-.8.375-.275.3-1.05 1.01-1.05 2.46s1.075 2.85 1.225 3.05c.15.2 2.1 3.175 5.05 4.43 2.065.885 2.85.955 3.82.8 1.04-.165 2.815-1.135 3.21-2.235.4-1.1.4-2.045.275-2.245-.125-.2-.475-.3-.775-.45z"/>
        </svg>
      </a>
      <Footer />
      </CartProvider>
    </UserProvider>
  );
}
