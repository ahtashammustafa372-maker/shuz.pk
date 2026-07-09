'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import SlideProductCard from '../components/SlideProductCard';
import { Truck, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [slider, setSlider] = useState([]);
  const [categoryBoxes, setCategoryBoxes] = useState([]);
  
  const defaultHomepage = {
    slidesSection: {
      title: 'Slides', subtitle: 'Easy Wear', viewAllLink: '/collections/flip-flops', productSlugs: []
    },
    trendingSection: {
      title: 'Trending Styles', subtitle: 'Top-tier quality replicas, designed to impress', viewAllLink: '/collections/all',
      tabs: [
        { id: 'new-arrivals', label: 'New Arrivals', filter: 'new_arrival' },
        { id: 'best-sellers', label: 'Best Sellers', filter: 'featured' },
        { id: 'flash-sale', label: 'Flash Sale', filter: 'flash_sale' }
      ]
    }
  };
  const [homepageSettings, setHomepageSettings] = useState(defaultHomepage);
  const [activeTab, setActiveTab] = useState('new-arrivals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/settings')
        ]);
        if (pRes.ok && sRes.ok) {
          const pData = await pRes.json();
          const sData = await sRes.json();
          setProducts(pData);
          setSlider(sData.slider || []);
          setCategoryBoxes(sData.categoryBoxes || []);
          if (sData.homepage) {
            setHomepageSettings({
              slidesSection: { ...defaultHomepage.slidesSection, ...sData.homepage.slidesSection },
              trendingSection: { ...defaultHomepage.trendingSection, ...sData.homepage.trendingSection }
            });
            if (sData.homepage.trendingSection?.tabs?.length > 0) {
              setActiveTab(sData.homepage.trendingSection.tabs[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getFilteredProducts = () => {
    const activeTabObj = homepageSettings.trendingSection.tabs.find(t => t.id === activeTab);
    if (!activeTabObj) return products;

    if (activeTabObj.filter === 'new_arrival') {
      return products.filter(p => p.new_arrival);
    } else if (activeTabObj.filter === 'featured') {
      return products.filter(p => p.featured);
    } else if (activeTabObj.filter === 'flash_sale') {
      return products.filter(p => p.price < p.compare_at_price);
    }
    return products;
  };

  const chunkArray = (arr, size) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const chunkedCategoryBoxes = chunkArray(categoryBoxes, 2);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-slider swiper-container-custom">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          style={{ width: '100%' }}
        >
          {(slider && slider.length > 0 ? slider : [
            {
              id: 1,
              link: "/collections/sneakers",
              image: "https://jutay.co/cdn/shop/files/new1_1.webp?v=1781527977"
            },
            {
              id: 2,
              link: "/collections/mens-shoes",
              image: "https://jutay.co/cdn/shop/files/Shoes_Banner_f01545a0-435e-4dba-b58e-63e09c18ed63.webp?v=1775473103"
            },
            {
              id: 3,
              link: "/collections/womens-shoes",
              image: "https://jutay.co/cdn/shop/files/1_copy_5_326273d6-1833-449b-8cbd-efeef43d9fa8.webp?v=1744279321"
            }
          ]).map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="hero-slide active" style={{ width: '100%', display: 'block' }}>
                <Link href={slide.link} style={{ display: 'block', width: '100%' }}>
                  <img src={slide.image} alt="Slider Banner" className="hero-slide-image" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* New Arrivals Section */}
      <section className="fluid-container" style={{ padding: '20px 0' }}>
        <div className="section-title-wrap" style={{ textAlign: 'center', marginTop: '10px', marginBottom: '30px' }}>
          <h2 className="section-title" style={{ fontSize: '32px', fontWeight: '400', marginBottom: '8px' }}>New Arrivals</h2>
          <p className="section-subtitle" style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>Fresh Picks</p>
          <div style={{ width: '40px', height: '2px', backgroundColor: '#ef4444', margin: '0 auto' }}></div>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0', fontSize: '18px', fontWeight: '500' }}>
            Loading products...
          </div>
        ) : (
          <div className="new-arrivals-slider" style={{ position: 'relative', padding: '0 30px' }}>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={5}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 3, spaceBetween: 15 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 5, spaceBetween: 20 },
              }}
            >
              {products.filter(p => p.new_arrival).slice(0, 10).map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom Navigation Arrows */}
            <div className="swiper-button-prev-custom" style={{ position: 'absolute', left: 0, top: '35%', transform: 'translateY(-50%)', zIndex: 10, width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div className="swiper-button-next-custom" style={{ position: 'absolute', right: 0, top: '35%', transform: 'translateY(-50%)', zIndex: 10, width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/collections/new-arrivals" style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '12px 40px', fontWeight: '500', borderRadius: '4px', fontSize: '15px' }}>
            View All
          </Link>
        </div>
      </section>

      {/* Category Boxes Slider Section */}
      <section className="fluid-container" style={{ padding: '10px 0 20px 0' }}>
        <div style={{ position: 'relative', padding: '0 30px' }}>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={5}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{
              nextEl: '.cat-button-next',
              prevEl: '.cat-button-prev',
            }}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 2.5, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1280: { slidesPerView: 5, spaceBetween: 20 },
            }}
          >
            {chunkedCategoryBoxes.map((col, index) => (
              <SwiperSlide key={index}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {col.map((cat, i) => (
                    <Link key={i} href={cat.link} style={{ display: 'block', textDecoration: 'none' }}>
                      <div style={{
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <img src={cat.image} alt={cat.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    </Link>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="cat-button-prev" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <div className="cat-button-next" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '36px', height: '36px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>
      </section>

      {/* Marquee Slider */}
      <section className="marquee-container">
        <div className="marquee-content">
          {[...Array(2)].map((_, j) => (
            <React.Fragment key={j}>
              <div className="marquee-item">
                <img src="https://cdn.shopify.com/s/files/1/0609/8416/4583/files/icons8-shipping-64.png?v=1744286155" alt="Shipping" className="marquee-icon" />
                <span className="marquee-text">FREE DELIVERY on Every Order</span>
              </div>
              <div className="marquee-item">
                <img src="https://cdn.shopify.com/s/files/1/0609/8416/4583/files/icons8-shoes-80.png?v=1744290534" alt="Shoe" className="marquee-icon" />
                <span className="marquee-text">New Season Essential</span>
              </div>
              <div className="marquee-item">
                <img src="https://cdn.shopify.com/s/files/1/0609/8416/4583/files/icons8-shoes-80.png?v=1744290534" alt="Shoe" className="marquee-icon" />
                <span className="marquee-text">Gear up with fresh picks for the season.</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Slides Easy Wear Section */}
      <section className="fluid-container" style={{ padding: '0 0 20px 0' }}>
        <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ fontSize: '36px', fontWeight: '400', margin: '0 0 10px 0' }}>{homepageSettings.slidesSection.title}</h2>
          <p className="section-subtitle" style={{ fontSize: '15px', color: '#666', position: 'relative', display: 'inline-block', paddingBottom: '10px', marginTop: 0 }}>
            {homepageSettings.slidesSection.subtitle}
            <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '30px', height: '2px', backgroundColor: '#e84e4e' }}></span>
          </p>
        </div>

        <div style={{ position: 'relative', padding: '0 10px' }}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={5}
            navigation={{
              nextEl: '.slides-button-next',
              prevEl: '.slides-button-prev',
            }}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 2.5, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1280: { slidesPerView: 5, spaceBetween: 20 },
            }}
          >
            {homepageSettings.slidesSection.productSlugs.length > 0 ? (
              homepageSettings.slidesSection.productSlugs.map((slug, index) => {
                const product = products.find(p => p.slug === slug);
                if (!product) return null;
                return (
                  <SwiperSlide key={index}>
                    <SlideProductCard product={product} />
                  </SwiperSlide>
                );
              })
            ) : (
              products.slice(0, 6).map((product, index) => (
                <SwiperSlide key={index}>
                  <SlideProductCard product={product} />
                </SwiperSlide>
              ))
            )}
          </Swiper>

          <div className="slides-button-prev" style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </div>
          <div className="slides-button-next" style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link href={homepageSettings.slidesSection.viewAllLink} style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', border: 'none', padding: '12px 35px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', borderRadius: '5px', textDecoration: 'none' }}>
            View All
          </Link>
        </div>
      </section>

      {/* Featured Products Tabs */}
      <section className="fluid-container" style={{ padding: '0 0 20px 0' }}>
        <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ margin: '0 0 10px 0' }}>{homepageSettings.trendingSection.title}</h2>
          <p className="section-subtitle" style={{ marginTop: 0 }}>{homepageSettings.trendingSection.subtitle}</p>
        </div>

        <div className="tabs-header">
          {homepageSettings.trendingSection.tabs.map(tab => (
            <button 
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0', fontSize: '18px', fontWeight: '500' }}>
            Loading products...
          </div>
        ) : (
          <div className="product-grid">
            {getFilteredProducts().slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href={homepageSettings.trendingSection.viewAllLink} className="btn-secondary" style={{ display: 'inline-block', maxWidth: '200px' }}>
            View All Products
          </Link>
        </div>
      </section>

      {/* Promo Grid */}
      <section className="fluid-container">
        <div className="promo-grid">
          <div className="promo-banner">
            <img src="/images/sneaker_white.jpg" alt="Summer shoes" className="promo-banner-image" />
            <div className="promo-banner-content">
              <span className="promo-tag">Exclusive 7A Tier</span>
              <h3 className="promo-title">Casual Lifestyle</h3>
              <Link href="/collections/spezial" className="promo-link">Explore Spezial</Link>
            </div>
          </div>
          <div className="promo-banner">
            <img src="/images/runner_red.jpg" alt="Athletic" className="promo-banner-image" />
            <div className="promo-banner-content">
              <span className="promo-tag">High Performance</span>
              <h3 className="promo-title">Carbon Plated Runners</h3>
              <Link href="/collections/runners" className="promo-link">Shop Running</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Text Block */}
      <section className="fluid-container" style={{ padding: '40px 15px', maxWidth: '1400px', margin: '0 auto' }}>
        <div 
          className="seo-scroll-container custom-scrollbar" 
          style={{ 
            color: '#333', 
            lineHeight: '1.6', 
            fontSize: '14px', 
            textAlign: 'left',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '20px 30px',
            border: '1px solid #f0f0f0',
            backgroundColor: '#fafafa'
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '12px', color: '#222' }}>Step into Style with Jutay New Arrivals</h2>
          <p style={{ marginBottom: '25px' }}>For those who love footwear, we at Jutay always have something original and interesting to present. Our <strong>New Arrivals</strong> section brings you the newest trends, modern styles, and daily comfort all in one place. Styles selected are carefully chosen to satisfy both everyday needs and current street trends. Whether you want striking alternatives for special events or casual pairs for everyday wear, our New Arrivals span everything. There are fashionable Slides, Runners, Spezial, Sambas, Sneakers, Bad Bunny, and Puma lines for every way of life. Frequent changes in this area guarantee you never lose sight of current market trends. Every pair combines style and utility so that you feel at ease at the same time and look good. We place quality, longevity, and intelligent pricing first in <strong>Jutay.</strong> Customers depend on our New Arrivals daily for dependable style and long-lasting comfort.</p>

          <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '12px', color: '#222' }}>Standout Designs Based on Trend</h2>
          <p style={{ marginBottom: '25px' }}>Our <strong>New Arrivals</strong> reflect the latest global fashion trends. We follow what people love and deliver those styles straight to Jutay. Vibrant colors, modern shapes, and crisp details help you stand out confidently. Every design adds personality to your wardrobe and keeps your look fresh and stylish.</p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '12px', color: '#222' }}>Comfort That Supports Every Step</h2>
          <p style={{ marginBottom: '25px' }}>Comfort is at the heart of every pair. Breathable materials reduce sweat, cushioned soles absorb shock, and stable support keeps you relaxed all day. Whether you walk, travel, or work long hours, our shoes keep your feet stress-free from morning to night.</p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '12px', color: '#222' }}>Casual Daily Choices for Calm Vibes</h2>
          <p style={{ marginBottom: '25px' }}>Discover stylish Slides, Runners Spezial, Sambas, Sneakers, Bad Bunny, and Puma that perfectly match your everyday routine. Slides give instant comfort, runners provide light support, and retro styles add a trendy street look. Easy to wear, easy to style — just slip them on and go.</p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '12px', color: '#222' }}>Classic Favorites and Iconic Streetwear</h2>
          <p style={{ marginBottom: '25px' }}>Inspired by street culture and sports heritage, these collections combine timeless designs with modern updates. As one of the best shoes brands in Pakistan, our range offers something for every style preference. Choose clean neutrals for a minimal look or bold colors for a statement outfit. Our New Arrivals balance classic and contemporary style effortlessly.</p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '12px', color: '#222' }}>Constructed for Enduring Performance</h2>
          <p style={{ marginBottom: '25px' }}>Performance counts as much as design does. That is why our New Arrivals provide toughness and durability together with an amazing appearance. The high-quality materials used in our Slides, Runners, Spezial, Sambas, Sneakers, and Pumas, can resist everyday usage. Good rubber outsoles help you stop slipping and increase your grip. Shock absorption and foot fatigue alleviation come by means of cushioned midsoles. Uppers that breathe keep your feet fresh and cool. Whether you are staying on the run all day or walking long distances, these New Arrivals promote active lifestyles. At Jutay, we create shoes that match your effort level. Our New Arrivals last longer and remain comfy over time, hence you won't need to swiftly replace your shoes. They become a wise and realistic investment as a result.</p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '12px', color: '#222' }}>Great Variety for Every Size and Taste</h2>
          <p style={{ marginBottom: '25px' }}>At Jutay, everyone finds their perfect fit. Multiple sizes, colors, and styles ensure something for every preference. Browse our full collection anytime at Bad Bunny and enjoy easy shopping with fresh options always available.</p>
          
          <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '12px', color: '#222' }}>Shop Jutay Newly Arrived Today</h2>
          <p style={{ marginBottom: '10px' }}>Upgrade your look with shoes that combine trend, comfort, and value. Explore our latest arrivals now and step into confidence with Jutay — where modern style meets everyday comfort.</p>
        </div>
      </section>

      {/* Trust Badges Banner */}
      <section className="fluid-container">
        <div className="trust-features">
          <div className="trust-item">
            <div className="trust-icon">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="trust-title">Free Shipping</h4>
              <p className="trust-desc">On orders above Rs. 15,000</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="trust-title">Cash on Delivery</h4>
              <p className="trust-desc">Pay at your doorstep in Pakistan</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="trust-title">7-Day Easy Returns</h4>
              <p className="trust-desc">Simple exchanges & replacements</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="trust-title">Premium 7A Quality</h4>
              <p className="trust-desc">Detailed craftsmanship checks</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
