'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function SliderAdmin() {
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSlider(data.slider || []);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now(),
      image: '',
      link: ''
    };
    setSlider([...slider, newSlide]);
  };

  const handleRemoveSlide = (id) => {
    setSlider(slider.filter(s => s.id !== id));
  };

  const handleChange = (id, field, value) => {
    setSlider(slider.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slider }),
      });
      if (res.ok) {
        setMessage('Slider settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Main Slider Management</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#000', color: '#fff',
            border: 'none', padding: '10px 20px', borderRadius: '4px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1
          }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '10px', backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2', color: message.includes('success') ? '#166534' : '#991b1b', marginBottom: '20px', borderRadius: '4px' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {slider.map((slide, index) => (
          <div key={slide.id || index} style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', position: 'relative' }}>
            <button 
              onClick={() => handleRemoveSlide(slide.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
              title="Remove Slide"
            >
              <Trash2 size={20} />
            </button>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Slide {index + 1}</h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>Image URL</label>
                <input 
                  type="text" 
                  value={slide.image || ''} 
                  onChange={(e) => handleChange(slide.id, 'image', e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>Destination Link</label>
                <input 
                  type="text" 
                  value={slide.link || ''} 
                  onChange={(e) => handleChange(slide.id, 'link', e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  placeholder="/collections/sneakers"
                />
              </div>

              {slide.image && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 5px 0' }}>Preview:</p>
                  <img src={slide.image} alt="Preview" style={{ maxHeight: '150px', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                </div>
              )}
            </div>
          </div>
        ))}

        <button 
          onClick={handleAddSlide}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            backgroundColor: '#f3f4f6', color: '#111827',
            border: '2px dashed #d1d5db', padding: '15px', borderRadius: '8px',
            cursor: 'pointer', marginTop: '10px'
          }}
        >
          <Plus size={20} />
          Add New Slide
        </button>
      </div>
    </div>
  );
}
