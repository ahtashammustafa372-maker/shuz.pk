'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Search, ShoppingBag, Menu, X, User, Heart, ChevronDown } from 'lucide-react';

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { setCartOpen, cartCount } = useCart();
  const { wishlist } = useUser();
  const { generalSettings } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  const [megaMenuProducts, setMegaMenuProducts] = useState([]);

  // Use header menus from general settings or fallback
  const fallbackNavItems = [
    { label: "Men", url: "/collections/men" },
    { label: "Women", url: "/collections/women" },
    { label: "New Arrival", url: "/collections/new-arrival" },
    { label: "Major Loafers", url: "/collections/major-loafers" },
    { label: "On Cloud", url: "/collections/on-cloud" },
    { label: "Runners", url: "/collections/runners" },
    { label: "Air Jordan", url: "/collections/air-jordan" },
    { label: "T-shirts", url: "/collections/t-shirts" },
    { label: "Flash Sale", url: "/collections/flash-sale" }
  ];

  const navItems = (generalSettings?.headerMenus && generalSettings.headerMenus.length > 2)
    ? generalSettings.headerMenus
    : fallbackNavItems;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Fetch some products for the mega menu
    async function fetchMegaMenu() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Filter products for 'Men' or just take first 4 featured
          setMegaMenuProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Mega menu fetch failed", err);
      }
    }
    fetchMegaMenu();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search fetch
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowSearchDropdown(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          // limit to 5 results for the dropdown
          setSearchResults(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/collections/all?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="site-header">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-container">
            <div className="top-bar-left">
              <a href="https://instagram.com" className="social-link-top"><InstagramIcon size={16} /> 163k Followers</a>
              <a href="https://facebook.com" className="social-link-top"><FacebookIcon size={16} /> 8k Followers</a>
            </div>
            <div className="top-bar-center">
              Free Shipping all Over Pakistan
            </div>
            <div className="top-bar-right">
              Orders over 20,000 need a 10% advance.
            </div>
          </div>
        </div>

        {/* Middle Bar */}
        <div className="middle-bar">
          <div className="middle-bar-container">
            {/* Mobile Hamburger - Only visible on small screens */}
            <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(true)}>
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="middle-bar-search" ref={searchRef}>
              <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products"
                  className="search-input-box"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  onFocus={() => { if (searchQuery.trim()) setShowSearchDropdown(true); }}
                />

                {/* Search Dropdown */}
                {showSearchDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {isSearching ? (
                      <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>Searching...</div>
                    ) : searchResults.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {searchResults.map(product => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => setShowSearchDropdown(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 15px',
                              borderBottom: '1px solid var(--color-border)',
                              textDecoration: 'none',
                              color: 'inherit'
                            }}
                          >
                            <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }} />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{product.title}</div>
                              <div style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: '600' }}>Rs.{product.price}</div>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/collections/all?q=${encodeURIComponent(searchQuery.trim())}`}
                          onClick={() => setShowSearchDropdown(false)}
                          style={{
                            display: 'block',
                            padding: '10px 15px',
                            textAlign: 'center',
                            fontSize: '13px',
                            color: 'var(--color-primary)',
                            fontWeight: '600',
                            textDecoration: 'none',
                            backgroundColor: '#f9f9f9'
                          }}
                        >
                          View all results for "{searchQuery}"
                        </Link>
                      </div>
                    ) : (
                      <div style={{ padding: '15px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="middle-bar-logo">
              <Link href="/">
                {/* Fallback to text if the image URL is broken, but we try to load the actual logo from jutay.co */}
                <img
                  src="/images/logo.png"
                  alt="JUTAY"
                  className="logo-img"
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
                <span style={{ display: 'none', fontSize: '32px', fontWeight: '900', color: '#b11e22', textShadow: '2px 2px 0px #000' }}>JUTAY</span>
              </Link>
            </div>

            <div className="middle-bar-icons">
              {/* Search Icon for Mobile only */}
              <button className="icon-btn hide-on-desktop mobile-search-btn" onClick={() => { }}>
                <Search size={22} />
              </button>
              <Link href="/account" className="icon-btn hide-on-mobile"><User size={22} /></Link>
              <Link href="/wishlist" className="icon-btn hide-on-mobile">
                <Heart size={22} />
                {wishlist?.length > 0 && <span className="cart-count-badge">{wishlist.length}</span>}
              </Link>
              <button className="icon-btn" onClick={() => setCartOpen(true)}>
                <ShoppingBag size={22} />
                {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="bottom-nav">
          <div className="bottom-nav-container">
            <ul className="nav-list">
              {navItems.length > 0 ? navItems.map((item, idx) => (
                <li key={item.id || idx} className="nav-item">
                  <Link href={item.url || item.link || '/'} className="nav-link-main" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {item.label}
                    {item.label === 'Men' && <ChevronDown size={14} />}
                  </Link>
                  
                  {/* Mega Menu Dropdown for Men */}
                  {item.label === 'Men' && (
                    <div className="mega-menu-container">
                      <div className="mega-menu-col-links">
                        <Link href="/collections/basketball">Basketball</Link>
                        <Link href="/collections/sneakers">Sneakers</Link>
                        <Link href="/collections/7a-premium">7a Premium</Link>
                        <Link href="/collections/slides">Slides</Link>
                        <Link href="/collections/caps">Caps</Link>
                      </div>
                      <div className="mega-menu-products">
                        {megaMenuProducts.map(prod => (
                          <Link key={prod.id} href={`/products/${prod.slug}`} className="mega-product-card">
                            <img src={prod.images?.[0] || '/images/placeholder.png'} alt={prod.title} />
                            <div className="title">{prod.title}</div>
                            <div className="price">Rs.{prod.price.toLocaleString()}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              )) : (
                <>
                  <li><Link href="/collections/sneakers" className="nav-link-main">Sneakers</Link></li>
                  <li><Link href="/collections/runners" className="nav-link-main">Runners</Link></li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu - kept simple for this task */}
      <div className={`cart-drawer-backdrop ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        <div className="cart-drawer" style={{ left: 0, right: 'auto', transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)' }} onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <span className="cart-drawer-title">MENU</span>
            <button className="close-drawer-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '18px', fontWeight: '600', textTransform: 'uppercase' }}>
              <li><Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
              {navItems.map((item, idx) => (
                <li key={item.id || idx}><Link href={item.url || item.link || '/'} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
