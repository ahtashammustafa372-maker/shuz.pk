'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit2, X } from 'lucide-react';

export default function PerfectMatchAdmin() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      const res = await fetch('/api/settings/perfect-match');
      const data = await res.json();
      if (data.success && data.sizes) {
        setSizes(data.sizes);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSizes = async (updatedSizes) => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/perfect-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sizes: updatedSizes })
      });
      const data = await res.json();
      if (data.success) {
        setSizes(data.sizes);
      } else {
        alert('Failed to save sizes');
      }
    } catch (error) {
      console.error('Error saving sizes:', error);
      alert('Error saving sizes');
    } finally {
      setSaving(false);
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    const newSizesList = newSize.split(',').map(s => s.trim()).filter(s => s !== '');
    const updatedSizes = [...sizes, ...newSizesList];
    saveSizes(updatedSizes);
    setNewSize('');
  };

  const handleDeleteSize = (index) => {
    if (!confirm('Are you sure you want to delete this size?')) return;
    const updatedSizes = sizes.filter((_, i) => i !== index);
    saveSizes(updatedSizes);
  };

  const handleEditSave = (index) => {
    if (!editingValue.trim()) return;
    const updatedSizes = [...sizes];
    updatedSizes[index] = editingValue.trim();
    saveSizes(updatedSizes);
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading sizes...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#18181b', margin: '0 0 5px 0' }}>Perfect Match Sizes</h1>
          <p style={{ color: '#71717a', margin: 0 }}>Manage the shoe sizes that appear in the "Your Perfect Match" filter section on the homepage.</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Add new size (e.g., 36, 42, 8 UK)"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            style={{ flex: 1, padding: '12px', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '15px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSize();
            }}
          />
          <button 
            onClick={handleAddSize}
            disabled={saving || !newSize.trim()}
            style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: (saving || !newSize.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
          >
            <Plus size={18} /> Add Size
          </button>
        </div>

        {sizes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#71717a', backgroundColor: '#f4f4f5', borderRadius: '8px' }}>
            No sizes added yet. Add your first size above.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {sizes.map((size, index) => (
              <div key={index} style={{ border: '1px solid #e4e4e7', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
                {editingIndex === index ? (
                  <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
                    <input 
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      style={{ width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(index);
                        if (e.key === 'Escape') setEditingIndex(null);
                      }}
                    />
                    <button onClick={() => handleEditSave(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-success)' }}><Save size={18} /></button>
                    <button onClick={() => setEditingIndex(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}><X size={18} /></button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#18181b' }}>{size}</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => {
                          setEditingIndex(index);
                          setEditingValue(size);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}
                        title="Edit Size"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSize(index)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}
                        title="Delete Size"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
