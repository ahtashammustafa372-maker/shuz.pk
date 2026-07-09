'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function HomePageSectionsAdmin() {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Default structure if not present
  const defaultHomepage = {
    slidesSection: {
      title: 'Slides',
      subtitle: 'Easy Wear',
      viewAllLink: '/collections/flip-flops',
      productSlugs: []
    },
    trendingSection: {
      title: 'Trending Styles',
      subtitle: 'Top-tier quality replicas, designed to impress',
      viewAllLink: '/collections/all',
      tabs: [
        { id: 'new-arrivals', label: 'New Arrivals', filter: 'new_arrival' },
        { id: 'best-sellers', label: 'Best Sellers', filter: 'featured' },
        { id: 'flash-sale', label: 'Flash Sale', filter: 'flash_sale' }
      ]
    },
    middleBanner: {
      image: 'https://jutay.co/cdn/shop/files/Shoes_Banner_f01545a0-435e-4dba-b58e-63e09c18ed63.webp?v=1775473103',
      link: '/collections/all',
      enabled: true
    }
  };

  const [homepage, setHomepage] = useState(defaultHomepage);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/products')
        ]);
        if (settingsRes.ok && productsRes.ok) {
          const settingsData = await settingsRes.json();
          const productsData = await productsRes.json();
          setSettings(settingsData);
          setProducts(productsData);
          
          if (settingsData.homepage) {
            setHomepage({
              slidesSection: { ...defaultHomepage.slidesSection, ...settingsData.homepage.slidesSection },
              trendingSection: { ...defaultHomepage.trendingSection, ...settingsData.homepage.trendingSection },
              middleBanner: { ...defaultHomepage.middleBanner, ...settingsData.homepage.middleBanner }
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        homepage
      };
      
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      
      if (res.ok) {
        alert('Home Page Sections saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  // Slides Handlers
  const addSlideProduct = () => {
    setHomepage(prev => ({
      ...prev,
      slidesSection: {
        ...prev.slidesSection,
        productSlugs: [...prev.slidesSection.productSlugs, '']
      }
    }));
  };

  const removeSlideProduct = (index) => {
    setHomepage(prev => ({
      ...prev,
      slidesSection: {
        ...prev.slidesSection,
        productSlugs: prev.slidesSection.productSlugs.filter((_, i) => i !== index)
      }
    }));
  };

  const updateSlideProduct = (index, value) => {
    setHomepage(prev => {
      const newSlugs = [...prev.slidesSection.productSlugs];
      newSlugs[index] = value;
      return {
        ...prev,
        slidesSection: {
          ...prev.slidesSection,
          productSlugs: newSlugs
        }
      };
    });
  };

  // Trending Tabs Handlers
  const updateTrendingTab = (index, field, value) => {
    setHomepage(prev => {
      const newTabs = [...prev.trendingSection.tabs];
      newTabs[index] = { ...newTabs[index], [field]: value };
      return {
        ...prev,
        trendingSection: {
          ...prev.trendingSection,
          tabs: newTabs
        }
      };
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Home Page Sections</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Slides Section Manager */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
            Slides Section (Easy Wear)
          </h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Section Title</label>
            <input 
              type="text" 
              value={homepage.slidesSection.title}
              onChange={(e) => setHomepage(prev => ({ ...prev, slidesSection: { ...prev.slidesSection, title: e.target.value } }))}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Section Subtitle</label>
            <input 
              type="text" 
              value={homepage.slidesSection.subtitle}
              onChange={(e) => setHomepage(prev => ({ ...prev, slidesSection: { ...prev.slidesSection, subtitle: e.target.value } }))}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>"View All" Link URL</label>
            <input 
              type="text" 
              value={homepage.slidesSection.viewAllLink}
              onChange={(e) => setHomepage(prev => ({ ...prev, slidesSection: { ...prev.slidesSection, viewAllLink: e.target.value } }))}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
            />
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '15px' }}>Selected Products</h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Select the products you want to display in the slides carousel. Order is top to bottom.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {homepage.slidesSection.productSlugs.map((slug, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select 
                  value={slug} 
                  onChange={(e) => updateSlideProduct(idx, e.target.value)}
                  style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                >
                  <option value="">-- Select a Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.slug}>{p.title} (Rs.{p.price})</option>
                  ))}
                </select>
                <button 
                  onClick={() => removeSlideProduct(idx)}
                  style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={addSlideProduct}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Trending Styles Manager */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
            Trending Styles Section
          </h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Section Title</label>
            <input 
              type="text" 
              value={homepage.trendingSection.title}
              onChange={(e) => setHomepage(prev => ({ ...prev, trendingSection: { ...prev.trendingSection, title: e.target.value } }))}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Section Subtitle</label>
            <input 
              type="text" 
              value={homepage.trendingSection.subtitle}
              onChange={(e) => setHomepage(prev => ({ ...prev, trendingSection: { ...prev.trendingSection, subtitle: e.target.value } }))}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
            />
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>"View All" Link URL</label>
            <input 
              type="text" 
              value={homepage.trendingSection.viewAllLink}
              onChange={(e) => setHomepage(prev => ({ ...prev, trendingSection: { ...prev.trendingSection, viewAllLink: e.target.value } }))}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
            />
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '15px' }}>Tabs Configuration</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {homepage.trendingSection.tabs.map((tab, idx) => (
              <div key={idx} style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Tab Label (e.g. New Arrivals)</label>
                  <input 
                    type="text" 
                    value={tab.label}
                    onChange={(e) => updateTrendingTab(idx, 'label', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Data Filter</label>
                  <select 
                    value={tab.filter}
                    onChange={(e) => updateTrendingTab(idx, 'filter', e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  >
                    <option value="new_arrival">New Arrivals (Auto-generated)</option>
                    <option value="featured">Best Sellers / Featured</option>
                    <option value="flash_sale">Flash Sale</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Banner Manager */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginTop: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          Middle Promotional Banner (Below New Arrivals)
        </h2>
        
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input 
            type="checkbox" 
            id="middleBannerEnabled"
            checked={homepage.middleBanner.enabled}
            onChange={(e) => setHomepage(prev => ({ ...prev, middleBanner: { ...prev.middleBanner, enabled: e.target.checked } }))}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="middleBannerEnabled" style={{ fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
            Enable Middle Banner
          </label>
        </div>

        {homepage.middleBanner.enabled && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Banner Image URL</label>
              <input 
                type="text" 
                value={homepage.middleBanner.image}
                onChange={(e) => setHomepage(prev => ({ ...prev, middleBanner: { ...prev.middleBanner, image: e.target.value } }))}
                placeholder="e.g. /images/promo_banner.jpg or https://..."
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Banner Link URL</label>
              <input 
                type="text" 
                value={homepage.middleBanner.link}
                onChange={(e) => setHomepage(prev => ({ ...prev, middleBanner: { ...prev.middleBanner, link: e.target.value } }))}
                placeholder="e.g. /collections/all"
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
            </div>
            
            {homepage.middleBanner.image && (
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '10px' }}>Preview:</p>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', backgroundColor: '#fafafa' }}>
                  <img 
                    src={homepage.middleBanner.image} 
                    alt="Middle Banner Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x400?text=Invalid+Image+URL' }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
