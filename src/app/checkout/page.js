'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingProvince, setShippingProvince] = useState('Punjab');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Coupon Discount
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in Rs.
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Order submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const SHIPPING_FEE = cartTotal >= 15000 ? 0 : 250;
  const finalTotal = Math.max(0, cartTotal - appliedDiscount + SHIPPING_FEE);

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    
    if (couponCode.toUpperCase() === 'SAVE10') {
      const discount = Math.round(cartTotal * 0.1);
      setAppliedDiscount(discount);
      setCouponSuccess(`10% discount applied! Saved Rs. ${discount.toLocaleString()}`);
    } else {
      setCouponError('Invalid coupon code. Try applying: SAVE10');
      setAppliedDiscount(0);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !shippingAddress || !shippingCity) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        shippingCity,
        shippingProvince,
        paymentMethod,
        subtotal: cartTotal,
        shippingFee: SHIPPING_FEE,
        total: finalTotal,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const orderResult = await res.json();
        setSubmittedOrder(orderResult);
        clearCart(); // Empty the cart on successful checkout
      } else {
        alert("There was an issue processing your order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout order submission failed", err);
      alert("Failed to submit order. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (submittedOrder) {
    return (
      <div className="success-overlay">
        <div className="success-icon-wrap">
          <CheckCircle2 size={44} />
        </div>
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for shopping with Jutay.co! Your order has been registered and is being prepared at our Lahore warehouse.
        </p>

        <div className="success-details-card">
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', marginBottom: '15px', fontWeight: '600', fontSize: '15px' }}>
            ORDER DETAILS (ID: #{submittedOrder.id})
          </div>
          <div className="success-detail-row">
            <span style={{ color: 'var(--color-foreground-secondary)' }}>Customer:</span>
            <strong>{submittedOrder.customerName}</strong>
          </div>
          <div className="success-detail-row">
            <span style={{ color: 'var(--color-foreground-secondary)' }}>Contact Phone:</span>
            <strong>{submittedOrder.customerPhone}</strong>
          </div>
          <div className="success-detail-row">
            <span style={{ color: 'var(--color-foreground-secondary)' }}>Shipping Address:</span>
            <strong>{submittedOrder.shippingAddress}, {submittedOrder.shippingCity}</strong>
          </div>
          <div className="success-detail-row">
            <span style={{ color: 'var(--color-foreground-secondary)' }}>Payment Method:</span>
            <strong>{submittedOrder.paymentMethod}</strong>
          </div>
          <div className="success-detail-row" style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '10px', marginTop: '10px', fontWeight: '700', fontSize: '16px' }}>
            <span>Total Payable:</span>
            <span style={{ color: 'var(--color-sale)' }}>Rs. {submittedOrder.total.toLocaleString()}</span>
          </div>
        </div>

        <Link href="/collections/sneakers" className="btn-primary" style={{ maxWidth: '250px' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  // If cart is empty and checkout hasn't been completed
  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Your cart is empty</h2>
        <p style={{ margin: '15px 0 25px 0', color: 'var(--color-foreground-secondary)' }}>
          Please add products to your cart before proceeding to checkout.
        </p>
        <Link href="/collections/sneakers" className="btn-primary" style={{ display: 'inline-block', maxWidth: '250px' }}>
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="checkout-layout">
        {/* Left Side: Delivery Details Form */}
        <form onSubmit={handleSubmitOrder}>
          <div className="checkout-section-title">1. Delivery Contact Details</div>
          
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input 
              type="text" 
              className="form-control" 
              required
              placeholder="e.g. Ali Khan" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label className="form-label">WhatsApp/Phone Number *</label>
              <input 
                type="tel" 
                className="form-control" 
                required
                placeholder="e.g. 03001234567" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="e.g. ali@gmail.com" 
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="checkout-section-title" style={{ marginTop: '30px' }}>2. Shipping Address</div>

          <div className="form-group">
            <label className="form-label">Street Address *</label>
            <input 
              type="text" 
              className="form-control" 
              required
              placeholder="House #, Street name, Area..." 
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label className="form-label">City *</label>
              <input 
                type="text" 
                className="form-control" 
                required
                placeholder="e.g. Lahore, Karachi" 
                value={shippingCity}
                onChange={(e) => setShippingCity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Province *</label>
              <select 
                className="form-control"
                value={shippingProvince}
                onChange={(e) => setShippingProvince(e.target.value)}
              >
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Islamabad">Islamabad Capital</option>
                <option value="Azad Kashmir">Azad Kashmir</option>
                <option value="Gilgit Baltistan">Gilgit Baltistan</option>
              </select>
            </div>
          </div>

          <div className="checkout-section-title" style={{ marginTop: '30px' }}>3. Payment Method</div>
          
          <div className="payment-options-list">
            <div 
              className={`payment-option-card ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('Cash on Delivery')}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={() => setPaymentMethod('Cash on Delivery')}
              />
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Cash on Delivery (COD)</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)' }}>Pay with cash upon delivery. Safe and simple.</span>
              </div>
            </div>
            
            <div 
              className={`payment-option-card ${paymentMethod === 'Bank Transfer' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('Bank Transfer')}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'Bank Transfer'}
                onChange={() => setPaymentMethod('Bank Transfer')}
              />
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Direct Bank Transfer</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-foreground-secondary)' }}>Transfer directly to our bank account. Details sent on WhatsApp.</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Right Side: Order Summary */}
        <aside className="checkout-summary-card">
          <h3 className="checkout-summary-title">Order Summary</h3>

          {/* Cart items list */}
          <div className="checkout-line-items">
            {cartItems.map((item, idx) => (
              <div className="checkout-line-item" key={`${item.id}-${item.size}-${item.color}-${idx}`}>
                <div className="checkout-line-item-info">
                  <img src={item.image} alt={item.title} className="checkout-line-item-img" />
                  <div>
                    <div className="checkout-line-item-name">{item.title}</div>
                    <div className="checkout-line-item-meta">Size: {item.size} | Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="checkout-line-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Coupon discount field */}
          <div className="promo-code-wrap">
            <input 
              type="text" 
              className="promo-input" 
              placeholder="Discount code (e.g. SAVE10)" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="button" className="promo-apply-btn" onClick={handleApplyCoupon}>Apply</button>
          </div>
          {couponError && <p style={{ color: 'var(--color-error)', fontSize: '12px', marginBottom: '15px' }}>{couponError}</p>}
          {couponSuccess && <p style={{ color: 'var(--color-success)', fontSize: '12px', marginBottom: '15px' }}>{couponSuccess}</p>}

          {/* Subtotals & Final Payable */}
          <div className="checkout-summary-totals">
            <div className="checkout-totals-row">
              <span style={{ color: 'var(--color-foreground-secondary)' }}>Subtotal:</span>
              <strong>Rs. {cartTotal.toLocaleString()}</strong>
            </div>
            {appliedDiscount > 0 && (
              <div className="checkout-totals-row" style={{ color: 'var(--color-success)' }}>
                <span>Discount applied:</span>
                <strong>- Rs. {appliedDiscount.toLocaleString()}</strong>
              </div>
            )}
            <div className="checkout-totals-row">
              <span style={{ color: 'var(--color-foreground-secondary)' }}>Shipping Fee:</span>
              <strong>{SHIPPING_FEE === 0 ? 'FREE' : `Rs. ${SHIPPING_FEE}`}</strong>
            </div>
            
            <div className="checkout-totals-row final-total">
              <span>Total:</span>
              <span style={{ color: 'var(--color-sale)' }}>Rs. {finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
