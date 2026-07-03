'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();

  const FREE_SHIPPING_THRESHOLD = 15000;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (!cartOpen) return null;

  return (
    <div className={`cart-drawer-backdrop ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <span className="cart-drawer-title">Shopping Cart ({cartItems.length})</span>
          <button className="close-drawer-btn" onClick={() => setCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Shipping Bar */}
        <div className="shipping-progress-container">
          <div className="shipping-progress-text">
            {remainingForFreeShipping > 0 ? (
              <span>Add <strong>Rs. {remainingForFreeShipping.toLocaleString()}</strong> more for <strong>FREE SHIPPING</strong>!</span>
            ) : (
              <span style={{ color: 'var(--color-success)' }}>🎉 You qualify for <strong>FREE SHIPPING</strong>!</span>
            )}
          </div>
          <div className="shipping-progress-bar">
            <div className="shipping-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-foreground-secondary)' }}>
              <p>Your cart is empty.</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '20px' }} 
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div className="cart-item" key={`${item.id}-${item.size}-${item.color}-${idx}`}>
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div className="cart-item-info">
                  <span className="cart-item-title">{item.title}</span>
                  <span className="cart-item-meta">
                    Size: {item.size} | Color: {item.color}
                  </span>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-selector">
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <input 
                        type="text" 
                        readOnly 
                        value={item.quantity} 
                        className="qty-input" 
                      />
                      <button 
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button 
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal:</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <p className="cart-drawer-footer-text">
              Shipping and taxes calculated at checkout.
            </p>
            <Link 
              href="/checkout" 
              className="btn-primary"
              onClick={() => setCartOpen(false)}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
