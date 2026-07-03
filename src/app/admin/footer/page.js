'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, Loader } from 'lucide-react';

export default function FooterSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Footer text settings
  const [description, setDescription] = useState('');
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterDesc, setNewsletterDesc] = useState('');
  const [copyrightText, setCopyrightText] = useState('');
  const [developerText, setDeveloperText] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');

  // Menus
  const [quickLinks, setQuickLinks] = useState([]);
  const [information, setInformation] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const footer = data.footer || {};
        const menus = footer.menus || (data.footerMenus || {}); // Fallback for old schema

        setDescription(footer.description || '');
        setNewsletterTitle(footer.newsletterTitle || '');
        setNewsletterDesc(footer.newsletterDesc || '');
        setCopyrightText(footer.copyrightText || '');
        setDeveloperText(footer.developerText || '');
        
        const social = data.socialLinks || {};
        setFacebook(social.facebook || '');
        setInstagram(social.instagram || '');

        setQuickLinks(menus.quickLinks || []);
        setInformation(menus.information || []);
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          socialLinks: { facebook, instagram },
          footer: {
            description,
            newsletterTitle,
            newsletterDesc,
            copyrightText,
            developerText,
            menus: {
              quickLinks,
              information
            }
          }
        })
      });
      if (res.ok) {
        alert('Footer settings saved successfully!');
      } else {
        alert('Failed to save footer settings.');
      }
    } catch (error) {
      console.error("Save error:", error);
      alert('Failed to save footer settings.');
    } finally {
      setSaving(false);
    }
  };

  const addLink = (menuType) => {
    const newLink = { label: '', url: '' };
    if (menuType === 'quick') {
      setQuickLinks([...quickLinks, newLink]);
    } else {
      setInformation([...information, newLink]);
    }
  };

  const removeLink = (menuType, index) => {
    if (menuType === 'quick') {
      const newLinks = [...quickLinks];
      newLinks.splice(index, 1);
      setQuickLinks(newLinks);
    } else {
      const newLinks = [...information];
      newLinks.splice(index, 1);
      setInformation(newLinks);
    }
  };

  const updateLink = (menuType, index, field, value) => {
    if (menuType === 'quick') {
      const newLinks = [...quickLinks];
      newLinks[index][field] = value;
      setQuickLinks(newLinks);
    } else {
      const newLinks = [...information];
      newLinks[index][field] = value;
      setInformation(newLinks);
    }
  };

  const moveLink = (menuType, index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (menuType === 'quick') {
      if (newIndex < 0 || newIndex >= quickLinks.length) return;
      const newLinks = [...quickLinks];
      const temp = newLinks[index];
      newLinks[index] = newLinks[newIndex];
      newLinks[newIndex] = temp;
      setQuickLinks(newLinks);
    } else {
      if (newIndex < 0 || newIndex >= information.length) return;
      const newLinks = [...information];
      const temp = newLinks[index];
      newLinks[index] = newLinks[newIndex];
      newLinks[newIndex] = temp;
      setInformation(newLinks);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading footer settings...</div>;

  const renderMenuEditor = (title, items, menuType) => (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{title}</h3>
        <button 
          onClick={() => addLink(menuType)}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          <Plus size={14} /> Add Link
        </button>
      </div>
      <div style={{ padding: '20px' }}>
        {items.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No links added yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((link, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fdfdfd' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#94a3b8' }}>
                  <button onClick={() => moveLink(menuType, idx, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: 0, opacity: idx === 0 ? 0.3 : 1 }}>▲</button>
                  <button onClick={() => moveLink(menuType, idx, 'down')} disabled={idx === items.length - 1} style={{ background: 'none', border: 'none', cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer', padding: 0, opacity: idx === items.length - 1 ? 0.3 : 1 }}>▼</button>
                </div>
                
                <div style={{ flex: 1 }}>
                  <input 
                    type="text" 
                    placeholder="Link Label (e.g. About Us)" 
                    value={link.label} 
                    onChange={(e) => updateLink(menuType, idx, 'label', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <input 
                    type="text" 
                    placeholder="URL (e.g. /pages/about-us)" 
                    value={link.url} 
                    onChange={(e) => updateLink(menuType, idx, 'url', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                
                <button 
                  onClick={() => removeLink(menuType, idx)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                  title="Remove Link"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '800px', paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Footer Settings</h1>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0', fontSize: '14px' }}>
            Manage everything in the storefront footer.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          Save Footer
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>General Texts</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Brand Description (Under Logo)</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Copyright Text</label>
            <input 
              type="text" 
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Developer Text (HTML allowed)</label>
            <input 
              type="text" 
              value={developerText}
              onChange={(e) => setDeveloperText(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Newsletter Section</h3>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Title</label>
            <input 
              type="text" 
              value={newsletterTitle}
              onChange={(e) => setNewsletterTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Description</label>
            <input 
              type="text" 
              value={newsletterDesc}
              onChange={(e) => setNewsletterDesc(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Social Links</h3>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Facebook URL</label>
            <input 
              type="text" 
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#334155' }}>Instagram URL</label>
            <input 
              type="text" 
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {renderMenuEditor('Quick Links Menu', quickLinks, 'quick')}
      {renderMenuEditor('Information Menu', information, 'info')}
    </div>
  );
}
