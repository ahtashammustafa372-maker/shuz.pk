'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader } from 'lucide-react';
import SeoEditorBox from '../../../../components/admin/SeoEditorBox';

export default function GlobalSeoSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    ogImage: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.seo) {
            setSeoData(data.seo);
          }
        }
      } catch (error) {
        console.error("Failed to load global settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo: seoData })
      });
      if (res.ok) {
        alert("Global SEO settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading Global SEO Settings...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Global SEO Settings</h1>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0', fontSize: '14px' }}>
            These settings act as the default fallback for any page or product that doesn't have its own custom SEO data.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          Save Global SEO
        </button>
      </div>

      <SeoEditorBox seoData={seoData} onChange={setSeoData} />
    </div>
  );
}
