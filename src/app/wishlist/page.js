'use client';

import React from 'react';
import { useUser } from '../../context/UserContext';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, isHydrated } = useUser();

  if (!isHydrated) {
    return <div style={{ minHeight: '50vh' }}></div>;
  }

  return (
    <div className="container" style={{ padding: '40px 15px', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '30px', textAlign: 'center' }}>My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '20px', color: '#374151', marginBottom: '15px' }}>Your wishlist is currently empty.</h2>
          <p style={{ color: '#6b7280', marginBottom: '25px' }}>Save items you love to review them later.</p>
          <Link href="/collections/all" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
