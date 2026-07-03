'use client';

import React from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';

export default function SeoEditorBox({ seoData, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...seoData,
      [field]: value
    });
  };

  const currentTitle = seoData?.title || '';
  const currentDesc = seoData?.description || '';

  return (
    <div style={{ marginTop: '30px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <Search size={20} color="#475569" />
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>SEO Settings (Yoast-style)</h3>
      </div>
      <div style={{ padding: '20px' }}>
        
        {/* Google Search Preview */}
        <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Google Search Preview</h4>
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '14px', color: '#202124', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', backgroundColor: '#f1f3f4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/favicon.ico" alt="icon" style={{ width: '16px', height: '16px' }} onError={(e) => e.target.style.display='none'} />
              </div>
              <div>
                <span style={{ display: 'block', color: '#202124', lineHeight: '1.2' }}>Jutay.co</span>
                <span style={{ display: 'block', color: '#4d5156', fontSize: '12px', lineHeight: '1.2' }}>https://jutay.co › ...</span>
              </div>
            </div>
            <div style={{ fontSize: '20px', color: '#1a0dab', marginBottom: '4px', cursor: 'pointer', display: 'inline-block', fontFamily: 'Arial, sans-serif' }}>
              {currentTitle || 'Please enter a Meta Title'}
            </div>
            <div style={{ fontSize: '14px', color: '#4d5156', lineHeight: '1.58', fontFamily: 'Arial, sans-serif' }}>
              {currentDesc || 'Please enter a Meta Description. This helps users understand what this page is about before they click.'}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
            Meta Title
            <span style={{ float: 'right', fontSize: '12px', fontWeight: 'normal', color: currentTitle.length > 60 ? '#ef4444' : '#64748b' }}>
              {currentTitle.length} / 60
            </span>
          </label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
            value={currentTitle}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Awesome Sneakers | Jutay.co"
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
          <div style={{ height: '4px', width: '100%', backgroundColor: '#e2e8f0', marginTop: '6px', borderRadius: '2px' }}>
            <div style={{ height: '100%', borderRadius: '2px', backgroundColor: currentTitle.length === 0 ? 'transparent' : currentTitle.length > 60 ? '#ef4444' : currentTitle.length > 30 ? '#10b981' : '#f59e0b', width: `${Math.min(100, (currentTitle.length / 60) * 100)}%`, transition: 'width 0.3s, background-color 0.3s' }}></div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
            Meta Description
            <span style={{ float: 'right', fontSize: '12px', fontWeight: 'normal', color: currentDesc.length > 160 ? '#ef4444' : '#64748b' }}>
              {currentDesc.length} / 160
            </span>
          </label>
          <textarea 
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', minHeight: '80px', transition: 'border-color 0.2s', resize: 'vertical', boxSizing: 'border-box' }}
            value={currentDesc}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="A brief description of the page for search engines..."
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          ></textarea>
          <div style={{ height: '4px', width: '100%', backgroundColor: '#e2e8f0', marginTop: '6px', borderRadius: '2px' }}>
            <div style={{ height: '100%', borderRadius: '2px', backgroundColor: currentDesc.length === 0 ? 'transparent' : currentDesc.length > 160 ? '#ef4444' : currentDesc.length > 120 ? '#10b981' : '#f59e0b', width: `${Math.min(100, (currentDesc.length / 160) * 100)}%`, transition: 'width 0.3s, background-color 0.3s' }}></div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Focus Keywords</label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            value={seoData?.keywords || ''}
            onChange={(e) => handleChange('keywords', e.target.value)}
            placeholder="e.g. sneakers, running shoes, adidas (comma separated)"
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Meta Tags</label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            value={seoData?.tags || ''}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="e.g. best sneakers, buy online pakistan"
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Canonical URL</label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            value={seoData?.canonicalUrl || ''}
            onChange={(e) => handleChange('canonicalUrl', e.target.value)}
            placeholder="https://jutay.co/product/your-product (Leave blank for default)"
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
          <small style={{ color: '#64748b', marginTop: '6px', display: 'block', fontSize: '12px' }}>
            Prevents duplicate content issues if this page can be accessed from multiple URLs.
          </small>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Search Engine Visibility</label>
            <select 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
              value={seoData?.noIndex ? 'noindex' : 'index'}
              onChange={(e) => handleChange('noIndex', e.target.value === 'noindex')}
            >
              <option value="index">Index (Allow search engines to show this page)</option>
              <option value="noindex">NoIndex (Hide from search engines)</option>
            </select>
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>Link Following</label>
            <select 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' }}
              value={seoData?.noFollow ? 'nofollow' : 'follow'}
              onChange={(e) => handleChange('noFollow', e.target.value === 'nofollow')}
            >
              <option value="follow">Follow (Allow search engines to follow links)</option>
              <option value="nofollow">NoFollow (Do not follow links on this page)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
            <ImageIcon size={16} color="#64748b" /> Social Sharing Image (OpenGraph)
          </label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            value={seoData?.ogImage || ''}
            onChange={(e) => handleChange('ogImage', e.target.value)}
            placeholder="/images/logo.png or https://... "
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
          <small style={{ color: '#64748b', marginTop: '6px', display: 'block', fontSize: '12px' }}>
            This image appears when the page is shared on Facebook, Twitter, WhatsApp, etc.
          </small>
        </div>

      </div>
    </div>
  );
}
