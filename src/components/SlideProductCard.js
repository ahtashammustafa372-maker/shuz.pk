'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export default function SlideProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useUser();
  const { title, slug, price, compare_at_price, images, sizes } = product;

  const hasDiscount = compare_at_price && compare_at_price > price;
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = hasDiscount 
    ? Math.round(((compare_at_price - price) / compare_at_price) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (sizes && sizes.length > 0) {
      addToCart(product, sizes[0], product.colors ? product.colors[0] : 'Default', 1);
    }
  };

  return (
    <div className="slide-product-card">
      <Link href={`/products/${slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        {hasDiscount && (
          <div className="slide-badge">-{discountPercent}%</div>
        )}
        <div className="slide-product-media">
          <img src={images && images.length > 0 ? images[0] : ''} alt={title} className="slide-product-image" />
        </div>
        <div className="slide-product-info">
          <div className="slide-product-title">{title}</div>
          <div className="slide-product-price">
            <span className="slide-price-sale">Rs.{price.toLocaleString()}</span>
            {hasDiscount && (
              <span className="slide-price-compare">Rs.{compare_at_price.toLocaleString()}</span>
            )}
          </div>
          <div className="slide-sizes">
            {sizes && sizes.map(size => (
              <span key={size} className="slide-size-badge">{size}</span>
            ))}
          </div>
        </div>
      </Link>
      
      {/* Actions outside Link to prevent navigation on click */}
      <div className="slide-actions" style={{ padding: '0 15px 15px 15px' }}>
        <button className="slide-add-btn" onClick={handleAddToCart}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Add to Cart
        </button>
        <button 
          className="slide-wishlist-btn" 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          style={{ color: isWishlisted ? '#ef4444' : 'currentColor' }}
        >
          <svg viewBox="0 0 24 24" fill={isWishlisted ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
    </div>
  );
}
