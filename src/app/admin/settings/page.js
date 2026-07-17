'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    theme: { primaryColor: '#c10000', secondaryColor: '#111111', fontSizeBase: '14px', buttonBgColor: '#000000', buttonTextColor: '#ffffff' },
    general: { storeName: '', shippingPolicy: '' },
    contact: { address: '', phone: '', facebookUrl: '', instagramUrl: '', karachiTimings: '', lahoreTimings: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({
          theme: { ...prev.theme, ...data.theme },
          general: { ...prev.general, ...data.general },
          contact: { ...prev.contact, ...data.contact }
        }));
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: settings.theme, general: settings.general, contact: settings.contact })
      });
      if (res.ok) {
        alert("Settings saved successfully! Refresh the public site to see changes.");
      }
    } catch (err) {
      console.error("Failed to save settings", err);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#18181b' }}>Store Settings</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Theme Settings */}
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e4e4e7', padding: '25px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>Theme & Appearance</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Primary Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="color" 
                value={settings.theme.primaryColor} 
                onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                style={{ width: '50px', height: '40px', padding: '0', border: '1px solid #e4e4e7', borderRadius: '4px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#71717a' }}>{settings.theme.primaryColor}</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Secondary Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="color" 
                value={settings.theme.secondaryColor} 
                onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, secondaryColor: e.target.value } })}
                style={{ width: '50px', height: '40px', padding: '0', border: '1px solid #e4e4e7', borderRadius: '4px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#71717a' }}>{settings.theme.secondaryColor}</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Button Background Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="color" 
                value={settings.theme.buttonBgColor || '#000000'} 
                onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, buttonBgColor: e.target.value } })}
                style={{ width: '50px', height: '40px', padding: '0', border: '1px solid #e4e4e7', borderRadius: '4px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#71717a' }}>{settings.theme.buttonBgColor || '#000000'}</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Button Text Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="color" 
                value={settings.theme.buttonTextColor || '#ffffff'} 
                onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, buttonTextColor: e.target.value } })}
                style={{ width: '50px', height: '40px', padding: '0', border: '1px solid #e4e4e7', borderRadius: '4px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#71717a' }}>{settings.theme.buttonTextColor || '#ffffff'}</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Base Font Size</label>
            <select 
              value={settings.theme.fontSizeBase} 
              onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, fontSizeBase: e.target.value } })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px', backgroundColor: '#fff' }}
            >
              <option value="12px">12px (Small)</option>
              <option value="14px">14px (Medium - Default)</option>
              <option value="16px">16px (Large)</option>
              <option value="18px">18px (Extra Large)</option>
            </select>
            <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '5px' }}>This will scale all fonts on the public website accordingly.</p>
          </div>
        </div>

        {/* General Settings */}
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e4e4e7', padding: '25px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>General Settings</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Store Name</label>
            <input 
              type="text" 
              value={settings.general.storeName} 
              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, storeName: e.target.value } })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Shipping Policy Text</label>
            <textarea 
              rows="4"
              value={settings.general.shippingPolicy || ''} 
              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, shippingPolicy: e.target.value } })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
            ></textarea>
            <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '5px' }}>This text appears on product pages and in the checkout process.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Size Chart HTML</label>
            <textarea 
              rows="6"
              value={settings.general.sizeChart || ''} 
              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, sizeChart: e.target.value } })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px', fontFamily: 'monospace' }}
              placeholder="<table>...</table>"
            ></textarea>
            <p style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '5px' }}>You can paste HTML for a table or any other format here. This appears in the Size Chart & Fit Guide section on product pages.</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Footer Copyright Text</label>
            <input 
              type="text" 
              value={settings.general.footerCopyrightText !== undefined ? settings.general.footerCopyrightText : '© Shuz 2026 - All Rights Reserved'} 
              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footerCopyrightText: e.target.value } })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Footer Developed By Text</label>
            <input 
              type="text" 
              value={settings.general.footerDeveloperText !== undefined ? settings.general.footerDeveloperText : 'Developed By Ozbix'} 
              onChange={(e) => setSettings({ ...settings, general: { ...settings.general, footerDeveloperText: e.target.value } })}
              style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
            />
          </div>
        </div>

        {/* Contact Page Settings */}
        <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e4e4e7', padding: '25px', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', borderBottom: '1px solid #e4e4e7', paddingBottom: '10px' }}>Contact Us Page Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Address</label>
              <input 
                type="text" 
                value={settings.contact?.address || ''} 
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
                placeholder="DHA Phase 5 Branch, Karach, See Our Stores"
                style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Phone Number</label>
              <input 
                type="text" 
                value={settings.contact?.phone || ''} 
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                placeholder="+92 323 2186889"
                style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Facebook URL</label>
              <input 
                type="url" 
                value={settings.contact?.facebookUrl || ''} 
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, facebookUrl: e.target.value } })}
                placeholder="https://facebook.com/..."
                style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Instagram URL</label>
              <input 
                type="url" 
                value={settings.contact?.instagramUrl || ''} 
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, instagramUrl: e.target.value } })}
                placeholder="https://instagram.com/..."
                style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Karachi Timings</label>
              <input 
                type="text" 
                value={settings.contact?.karachiTimings || ''} 
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, karachiTimings: e.target.value } })}
                placeholder="01:00 PM – 12:30 AM"
                style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Lahore Timings</label>
              <input 
                type="text" 
                value={settings.contact?.lahoreTimings || ''} 
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, lahoreTimings: e.target.value } })}
                placeholder="01:30 PM – 10:30 PM"
                style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
