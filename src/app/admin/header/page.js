'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';

export default function AdminHeader() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [headerSettings, setHeaderSettings] = useState({
    logoUrl: '/images/logo.png',
    topBarLeftText1: '163k Followers',
    topBarLeftLink1: 'https://instagram.com',
    topBarLeftIcon1: 'instagram',
    topBarLeftText2: '8k Followers',
    topBarLeftLink2: 'https://facebook.com',
    topBarLeftIcon2: 'facebook',
    topBarCenterText: 'Free Shipping all Over Pakistan',
    topBarRightText: 'Orders over 20,000 need a 10% advance.'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.header) {
          setHeaderSettings({ ...headerSettings, ...data.header });
        }
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeaderSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSaving(true);
    setMessage({ text: 'Uploading image...', type: '' });
    
    const formData = new FormData();
    formData.append('files', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.urls && data.urls.length > 0) {
          setHeaderSettings(prev => ({ ...prev, logoUrl: data.urls[0] }));
          setMessage({ text: 'Image uploaded successfully!', type: 'success' });
        }
      } else {
        setMessage({ text: 'Failed to upload image.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error uploading image.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ header: headerSettings })
      });

      if (res.ok) {
        setMessage({ text: 'Header settings saved successfully!', type: 'success' });
        // Give time for context to re-fetch or let user manually refresh to see changes
        setTimeout(() => {
            window.location.reload();
        }, 1500);
      } else {
        setMessage({ text: 'Failed to save settings.', type: 'error' });
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}><Loader className="animate-spin" /> Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Header Settings</h1>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'var(--color-primary)', color: '#fff',
            border: 'none', padding: '10px 20px', borderRadius: '6px',
            cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600'
          }}
        >
          {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message.text && (
        <div style={{ 
          padding: '15px', 
          marginBottom: '20px', 
          borderRadius: '6px',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b',
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        {/* Logo Section */}
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Logo</h2>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Logo Image URL</label>
          <input 
            type="text" 
            name="logoUrl" 
            value={headerSettings.logoUrl} 
            onChange={handleChange}
            placeholder="/images/logo.png or https://..."
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', marginBottom: '10px' }}
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Upload a new logo image, or enter a full URL above.</p>
          {headerSettings.logoUrl && (
            <div style={{ marginTop: '15px', padding: '15px', border: '1px dashed #ccc', borderRadius: '6px', display: 'inline-block', backgroundColor: '#f9f9f9' }}>
               <img src={headerSettings.logoUrl} alt="Logo Preview" style={{ height: '50px', objectFit: 'contain' }} />
            </div>
          )}
        </div>

        {/* Top Bar Section */}
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Top Bar</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Item 1 */}
          <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Left Item 1</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Text</label>
              <input type="text" name="topBarLeftText1" value={headerSettings.topBarLeftText1} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Link (URL)</label>
              <input type="text" name="topBarLeftLink1" value={headerSettings.topBarLeftLink1} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Icon</label>
              <select name="topBarLeftIcon1" value={headerSettings.topBarLeftIcon1} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="none">None</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="phone">Phone</option>
                <option value="mail">Email</option>
              </select>
            </div>
          </div>

          {/* Item 2 */}
          <div style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Left Item 2</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Text</label>
              <input type="text" name="topBarLeftText2" value={headerSettings.topBarLeftText2} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Link (URL)</label>
              <input type="text" name="topBarLeftLink2" value={headerSettings.topBarLeftLink2} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Icon</label>
              <select name="topBarLeftIcon2" value={headerSettings.topBarLeftIcon2} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="none">None</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="phone">Phone</option>
                <option value="mail">Email</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Center Text</label>
          <input 
            type="text" 
            name="topBarCenterText" 
            value={headerSettings.topBarCenterText} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Right Text</label>
          <input 
            type="text" 
            name="topBarRightText" 
            value={headerSettings.topBarRightText} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
          />
        </div>

      </div>
    </div>
  );
}
