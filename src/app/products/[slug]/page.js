'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import ProductCard from '../../../components/ProductCard';
import { ChevronDown, ChevronUp, ShoppingCart, CreditCard, X } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug;

  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [siblingProducts, setSiblingProducts] = useState([]);
  
  // Calculate current stock based on size or fallback to global stock
  const currentStock = product ? (product.sizeStock && product.sizeStock[selectedSize] !== undefined 
    ? product.sizeStock[selectedSize] 
    : product.stock) : 0;

  // Ensure quantity doesn't exceed newly selected size stock
  useEffect(() => {
    if (currentStock > 0 && quantity > currentStock) {
      setQuantity(currentStock);
    } else if (currentStock === 0) {
      setQuantity(1); // will be handled by add to cart logic or disabled button
    }
  }, [selectedSize, currentStock]);

  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Accordion State
  const [accordions, setAccordions] = useState({
    description: true,
    sizeChart: false,
    shipping: false
  });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  useEffect(() => {
    async function loadProductDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products`);
        if (res.ok) {
          const list = await res.json();
          const target = list.find(p => p.slug === productSlug);
          
          if (target) {
            if (target.images && Array.isArray(target.images)) {
              target.images = target.images.flatMap(img => typeof img === 'string' ? img.split(/[\n,]+/).map(i => i.trim()).filter(Boolean) : img);
            }
            setProduct(target);
            setSelectedSize(target.sizes && target.sizes.length > 0 ? target.sizes[0] : null);
            setSelectedColor(target.colors[0]);
            
            // Load recommendations (same category, excluding current product)
            const related = list.filter(p => p.category_slug === target.category_slug && p.id !== target.id);
            setRecommendedProducts(related.slice(0, 4));

            // Find sibling products (color variants) by comparing the base title (before the hyphen)
            const getBaseName = (title) => title.includes('-') ? title.split('-')[0].trim().toLowerCase() : title.toLowerCase();
            const targetBaseName = getBaseName(target.title);
            const siblings = list.filter(p => getBaseName(p.title) === targetBaseName);
            setSiblingProducts(siblings);
          }
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (productSlug) {
      loadProductDetails();
    }
  }, [productSlug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '22px', fontWeight: '500' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    // Add to cart first, then redirect to checkout
    addToCart(product, selectedSize, selectedColor, quantity);
    window.location.href = '/checkout';
  };

  const toggleAccordion = (section) => {
    setAccordions(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div className="breadcrumb" style={{ margin: '20px 0', fontSize: '14px', color: 'var(--color-foreground-secondary)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <Link href={`/collections/${product.category_slug}`} style={{ textDecoration: 'none', color: 'inherit', textTransform: 'capitalize' }}>
          {product.category_slug ? product.category_slug.replace(/-/g, ' ') : 'Category'}
        </Link>
        <span style={{ margin: '0 8px' }}>&gt;</span>
        <span style={{ color: 'var(--color-foreground)', fontWeight: '500' }}>{product.title}</span>
      </div>

      {/* Product Grid Layout */}
      <div className="product-detail-layout">
        {/* Left Side: Images Gallery */}
        <div className="product-gallery">
          <div 
            className="product-main-image-wrap"
            style={{ overflow: 'hidden', cursor: 'zoom-in', position: 'relative' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsLightboxOpen(true)}
          >
            <img 
              src={product.images[activeImgIdx]} 
              alt={product.title} 
              className="product-main-image" 
              style={{ ...zoomStyle, transition: 'transform 0.1s ease-out' }}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="product-thumbnails">
              {product.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`${product.title} thumbnail ${idx + 1}`} 
                  className={`product-thumbnail ${activeImgIdx === idx ? 'active' : ''}`}
                  onClick={() => setActiveImgIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Meta Info & Actions */}
        <div>
          <span className="product-meta-vendor">{product.vendor}</span>
          <h1 className="product-meta-title">{product.title}</h1>
          
          <div className="product-meta-price">
            {hasDiscount ? (
              <>
                <span className="price-sale">Rs. {product.price.toLocaleString()}</span>
                <span className="price-compare" style={{ fontSize: '18px' }}>
                  Rs. {product.compare_at_price.toLocaleString()}
                </span>
                <span style={{ fontSize: '12px', background: 'var(--color-sale)', color: '#fff', padding: '3px 8px', borderRadius: '4px' }}>
                  SAVE {discountPercent}%
                </span>
              </>
            ) : (
              <span className="price-regular">Rs. {product.price.toLocaleString()}</span>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '20px 0' }} />

          {/* Color Option Selector */}
          {siblingProducts.length > 1 ? (
            <div className="product-option-group">
              <span className="product-option-label">Color: <span style={{ fontWeight: '500', color: 'var(--color-foreground-secondary)' }}>{product.colors[0] || 'Default'}</span></span>
              <div className="filter-color-list" style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {siblingProducts.map(sibling => {
                   const siblingColor = sibling.colors && sibling.colors.length > 0 ? sibling.colors[0] : 'Default';
                   return (
                     <button
                       key={sibling.id}
                       className={`color-thumbnail-btn ${sibling.id === product.id ? 'active' : ''}`}
                       onClick={() => window.location.href = `/products/${sibling.slug}`}
                       title={siblingColor}
                       style={{
                         width: '65px', height: '65px', borderRadius: '50%', overflow: 'hidden',
                         padding: 0, border: sibling.id === product.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                         boxShadow: sibling.id === product.id ? '0 0 0 2px #fff inset' : '0 1px 3px rgba(0,0,0,0.1)',
                         cursor: 'pointer', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                         transition: 'transform 0.2s, box-shadow 0.2s'
                       }}
                       onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                       onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                     >
                       <img src={sibling.images[0] || '/placeholder.png'} alt={siblingColor} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </button>
                   );
                })}
              </div>
            </div>
          ) : (
            product.colors && product.colors.length > 0 && (
              <div className="product-option-group">
                <span className="product-option-label">Color: <span style={{ fontWeight: '500', color: 'var(--color-foreground-secondary)' }}>{selectedColor}</span></span>
                <div className="filter-color-list" style={{ marginTop: '5px' }}>
                  {product.colors.map(col => (
                    <button
                      key={col}
                      className={`filter-color-btn ${selectedColor === col ? 'active' : ''}`}
                      onClick={() => setSelectedColor(col)}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Size Option Selector & Inventory */}
          {(() => {
            return (
              <div className="product-option-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: currentStock === 0 ? '#ef4444' : currentStock < 8 ? '#eab308' : 'var(--color-success)' }}></span>
                  {currentStock === 0 ? (
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#ef4444' }}>Out of stock in this size</span>
                  ) : currentStock < 8 ? (
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#eab308' }}>Only {currentStock} left</span>
                  ) : (
                    <span className="status-in">In Stock (Ready to dispatch)</span>
                  )}
                </div>
                
                <span className="product-option-label">Size: <span style={{ fontWeight: '500', color: 'var(--color-foreground-secondary)' }}>{selectedSize}</span></span>
                <div className="swatch-grid" style={{ marginTop: '5px' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`swatch-size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Quantity selector */}
          <div className="product-option-group">
            <span className="product-option-label">Quantity:</span>
            <div className="quantity-selector" style={{ width: '120px', marginTop: '5px' }}>
              <button className="qty-btn" onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={currentStock === 0}>-</button>
              <input type="text" readOnly value={quantity} className="qty-input" />
              <button className="qty-btn" onClick={() => setQuantity(prev => (prev < currentStock ? prev + 1 : prev))} disabled={quantity >= currentStock || currentStock === 0}>+</button>
            </div>
          </div>

          {/* Action Row */}
          <div className="product-action-row">
            <button className="btn-secondary" onClick={handleAddToCart} disabled={currentStock === 0} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: currentStock === 0 ? 0.5 : 1 }}>
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button className="btn-primary" onClick={handleBuyNow} disabled={currentStock === 0} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: currentStock === 0 ? 0.5 : 1 }}>
              <CreditCard size={18} />
              Buy It Now
            </button>
          </div>

          {/* Policy Accordions */}
          <div className="detail-accordion">
            <div className={`accordion-item ${accordions.description ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('description')}>
                <span>Product Description</span>
                {accordions.description ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <div className="accordion-content">
                <p>{product.description}</p>
                <p style={{ marginTop: '10px' }}>
                  <strong>Batch details:</strong> Premium replica, manufactured with high density fabrics and rubbers for a close 1:1 match to original aesthetics.
                </p>
              </div>
            </div>

            <div className={`accordion-item ${accordions.sizeChart ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('sizeChart')}>
                <span>Size Chart & Fit Guide</span>
                {accordions.sizeChart ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <div className="accordion-content">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                      <th style={{ padding: '6px', border: '1px solid #ddd' }}>EU Size</th>
                      <th style={{ padding: '6px', border: '1px solid #ddd' }}>US Size (Men)</th>
                      <th style={{ padding: '6px', border: '1px solid #ddd' }}>Inches</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '6px', border: '1px solid #ddd' }}>40</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>7</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>9.8"</td></tr>
                    <tr><td style={{ padding: '6px', border: '1px solid #ddd' }}>41</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>8</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>10.1"</td></tr>
                    <tr><td style={{ padding: '6px', border: '1px solid #ddd' }}>42</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>8.5</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>10.4"</td></tr>
                    <tr><td style={{ padding: '6px', border: '1px solid #ddd' }}>43</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>9.5</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>10.8"</td></tr>
                    <tr><td style={{ padding: '6px', border: '1px solid #ddd' }}>44</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>10</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>11.1"</td></tr>
                    <tr><td style={{ padding: '6px', border: '1px solid #ddd' }}>45</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>11</td><td style={{ padding: '6px', border: '1px solid #ddd' }}>11.4"</td></tr>
                  </tbody>
                </table>
                <p style={{ marginTop: '10px', fontSize: '12px' }}>* Shoes usually fit true to size. If you have wide feet, we recommend ordering one size larger.</p>
              </div>
            </div>

            <div className={`accordion-item ${accordions.shipping ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('shipping')}>
                <span>Shipping & Cash on Delivery policy</span>
                {accordions.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <div className="accordion-content">
                <p>📦 <strong>Cash on Delivery:</strong> We offer Cash on Delivery (COD) across Pakistan. Pay at your doorstep upon receiving the parcel.</p>
                <p style={{ marginTop: '6px' }}>🚀 <strong>Delivery Timeline:</strong> Orders are processed instantly from our Lahore warehouse. Delivery takes 3 to 5 business days.</p>
                <p style={{ marginTop: '6px' }}>🔄 <strong>Return/Exchange policy:</strong> Easy exchanges within 7 days of delivery. Keep original tag intact.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setIsLightboxOpen(false)}>
          <button style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setIsLightboxOpen(false)}>
            <X size={32} />
          </button>
          <img 
            src={product.images[activeImgIdx]} 
            alt={product.title} 
            style={{ maxWidth: '90%', maxHeight: '90vh', objectFit: 'contain' }} 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <section style={{ margin: '80px 0 50px 0' }}>
          <div className="section-title-wrap">
            <h2 className="section-title" style={{ fontSize: '24px' }}>Recommended For You</h2>
            <p className="section-subtitle">Style pairs you might love</p>
          </div>
          <div className="product-grid">
            {recommendedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
