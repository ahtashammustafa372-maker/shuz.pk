'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';

export default function CollectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const collectionSlug = params.slug || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');
  const initialSize = searchParams.get('size') || '';
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  // Get query search if available
  const urlQuery = searchParams.get('q') || '';

  // Get collections name
  const getCollectionName = () => {
    switch (collectionSlug) {
      case 'sneakers': return 'Sneakers';
      case 'basketball': return 'Basketball';
      case '7a-premium': return '7A Premium';
      case 'flip-flops': return 'Slides';
      case 'runners': return 'Runners';
      case 'caps': return 'Caps';
      case 'men': return 'Men';
      case 'women': return 'Women';
      case 'new-arrival': return 'New Arrival';
      case 'major-loafers': return 'Major Loafers';
      case 'oncloud':
      case 'on-cloud': return 'On Cloud';
      case 'aj-iv':
      case 'air-jordan': return 'Air Jordan';
      case 't-shirts': return 'T-Shirts';
      case '12-12-sale': return 'Flash Sale';
      case 'all': return 'All Collections';
      default: return collectionSlug.toUpperCase().replace('-', ' ');
    }
  };

  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      setVisibleCount(12);
      try {
        let apiUrl = `/api/products?collection=${collectionSlug}`;
        if (urlQuery) apiUrl += `&q=${encodeURIComponent(urlQuery)}`;
        if (selectedSize) apiUrl += `&size=${selectedSize}`;
        if (selectedBrand) apiUrl += `&brand=${encodeURIComponent(selectedBrand)}`;
        if (sortOption) {
          if (sortOption === 'price-low-high') apiUrl += `&sort=price-ascending`;
          else if (sortOption === 'price-high-low') apiUrl += `&sort=price-descending`;
          else if (sortOption === 'newest') apiUrl += `&sort=date-descending`;
        }

        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load collection products", err);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredProducts();
  }, [collectionSlug, urlQuery, selectedSize, selectedBrand, sortOption]);

  const handleSizeClick = (size) => {
    setSelectedSize(prev => prev === size ? '' : size);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(prev => prev === brand ? '' : brand);
  };

  // Brands list dynamically extracted from products, but we can hardcode key targets
  const brands = ['Adidas', 'Nike', 'New Balance', 'Hermes', 'Philipp Plein'];
  // Shoe sizes 39 to 45
  const sizes = [39, 40, 41, 42, 43, 44, 45];

  // Collection Banners mapping
  const collectionBanners = {
    'oncloud': '/images/on_cloud_banner.png',
    'on-cloud': '/images/on_cloud_banner.png',
    'aj-iv': '/images/aj1_banner.png',
    'air-jordan': '/images/aj1_banner.png',
  };

  const currentBanner = collectionBanners[collectionSlug];

  return (
    <>
      {/* Category Top Banner (if available) - Full width edge-to-edge */}
      {currentBanner && (
        <div style={{ width: '100%', marginBottom: '20px' }}>
          <img 
            src={currentBanner} 
            alt={`${getCollectionName()} Banner`} 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '400px', 
              objectFit: 'cover', 
              objectPosition: 'center',
              display: 'block' 
            }} 
          />
        </div>
      )}

      <div className="fluid-container">
        {/* Category Banner/Header */}
        <div className="section-title-wrap" style={{ marginTop: currentBanner ? '10px' : '40px' }}>
          <h1 className="section-title" style={{ fontSize: '36px' }}>{getCollectionName()}</h1>
          {urlQuery && <p className="section-subtitle">Search results for: "{urlQuery}"</p>}
        </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="catalog-sidebar">
          {/* Brand Filter */}
          <div className="filter-widget">
            <h4 className="filter-title">Filter by Brand</h4>
            <div className="filter-color-list">
              {brands.map(brand => (
                <button
                  key={brand}
                  className={`filter-color-btn ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => handleBrandClick(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="filter-widget">
            <h4 className="filter-title">Filter by Size</h4>
            <div className="filter-size-grid">
              {sizes.map(size => (
                <button
                  key={size}
                  className={`filter-size-btn ${selectedSize === String(size) ? 'active' : ''}`}
                  onClick={() => handleSizeClick(String(size))}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedBrand || selectedSize) && (
            <button 
              className="btn-secondary" 
              style={{ width: '100%', fontSize: '13px', padding: '10px' }}
              onClick={() => {
                setSelectedBrand('');
                setSelectedSize('');
              }}
            >
              Clear Filters
            </button>
          )}
        </aside>

        {/* Main Products catalog */}
        <main className="catalog-main">
          {/* Sorting panel */}
          <div className="catalog-header">
            <span className="catalog-count">{products.length} products found</span>
            <div className="catalog-sort">
              <label htmlFor="sort-select" style={{ fontSize: '14px', fontWeight: '500' }}>Sort By:</label>
              <select 
                id="sort-select" 
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Best Match</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '20px', fontWeight: '500' }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-foreground-secondary)' }}>
              <h3>No products found.</h3>
              <p style={{ marginTop: '10px' }}>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="product-grid" style={{ margin: '0 0 40px 0' }}>
                {products.slice(0, visibleCount).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {visibleCount < products.length && (
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '12px 40px', fontSize: '16px', borderRadius: '4px' }}
                    onClick={() => setVisibleCount(prev => prev + 12)}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      </div>
    </>
  );
}
