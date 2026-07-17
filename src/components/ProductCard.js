'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { ShoppingBag, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useUser();
  const { title, slug, price, compare_at_price, images, sizes, new_arrival, flash_sale } = product;

  const hasDiscount = compare_at_price && compare_at_price > price;
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = hasDiscount 
    ? Math.round(((compare_at_price - price) / compare_at_price) * 100) 
    : 0;

  const handleSizeClick = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, product.colors ? product.colors[0] : 'Default', 1);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size if none selected, or open size selector
    if (sizes && sizes.length > 0) {
      addToCart(product, sizes[0], product.colors ? product.colors[0] : 'Default', 1);
    }
  };

  return (
    <div className="product-card" style={{ border: '1px solid #ff8a8a', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Link href={`/products/${slug}`} style={{ display: 'flex', flexDirection: 'column', flex: 1, textDecoration: 'none' }}>
        
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', backgroundColor: '#f5f6f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Watermark JUTAY removed */}

          {/* Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            {hasDiscount && (
              <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '4px 8px', borderRadius: '20px' }}>
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Product Image */}
          <img 
            src={images[0]} 
            alt={title} 
            style={{ width: '90%', height: '90%', objectFit: 'contain', zIndex: 1, transition: 'transform 0.3s ease' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#222', textTransform: 'uppercase', marginBottom: '8px', lineHeight: '1.4' }}>
            {title}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            {hasDiscount ? (
              <>
                <span style={{ color: '#ef4444', fontSize: '15px', fontWeight: '700' }}>Rs.{price.toLocaleString()}</span>
                <span style={{ color: '#9ca3af', fontSize: '12px', textDecoration: 'line-through' }}>Rs.{compare_at_price.toLocaleString()}</span>
              </>
            ) : (
              <span style={{ color: '#ef4444', fontSize: '15px', fontWeight: '700' }}>Rs.{price.toLocaleString()}</span>
            )}
          </div>

          {/* Sizes */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
            {sizes && sizes.map((size) => (
              <div 
                key={size}
                onClick={(e) => handleSizeClick(e, size)}
                style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#666', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: '#fff' }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#666'; }}
              >
                {size}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
            <button 
              onClick={handleAddToCart}
              style={{ flex: 1, backgroundColor: 'var(--color-button-bg, #ef4444)', color: 'var(--color-button-text, #fff)', border: 'none', borderRadius: '6px', padding: '10px 0', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'opacity 0.2s ease' }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
              style={{ width: '40px', height: '40px', backgroundColor: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isWishlisted ? '#ef4444' : '#222' }}
            >
              <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
