'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, GripVertical } from 'lucide-react';

export default function CategoryBoxesAdmin() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', link: '', image: '' });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setBoxes(data.categoryBoxes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load category boxes", err);
        setLoading(false);
      });
  }, []);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryBoxes: boxes })
      });
      if (res.ok) {
        alert('Category boxes saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBox = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.link || !formData.image) {
      alert("Please fill all fields");
      return;
    }

    if (editingIndex !== null) {
      const newBoxes = [...boxes];
      newBoxes[editingIndex] = { ...formData, id: newBoxes[editingIndex].id || Date.now() };
      setBoxes(newBoxes);
      setEditingIndex(null);
    } else {
      setBoxes([...boxes, { ...formData, id: Date.now() }]);
    }
    
    setFormData({ name: '', link: '', image: '' });
  };

  const handleEdit = (index) => {
    setFormData(boxes[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    if (confirm('Are you sure you want to delete this box?')) {
      const newBoxes = [...boxes];
      newBoxes.splice(index, 1);
      setBoxes(newBoxes);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newBoxes = [...boxes];
    const temp = newBoxes[index - 1];
    newBoxes[index - 1] = newBoxes[index];
    newBoxes[index] = temp;
    setBoxes(newBoxes);
  };

  const moveDown = (index) => {
    if (index === boxes.length - 1) return;
    const newBoxes = [...boxes];
    const temp = newBoxes[index + 1];
    newBoxes[index + 1] = newBoxes[index];
    newBoxes[index] = temp;
    setBoxes(newBoxes);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Manage Category Boxes</h1>
        <button 
          onClick={handleSaveAll}
          disabled={isSaving}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '10px 20px', backgroundColor: '#000', color: '#fff', 
            border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
          }}
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Form Section */}
        <div style={{ flex: '0 0 350px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            {editingIndex !== null ? 'Edit Box' : 'Add New Box'}
          </h2>
          <form onSubmit={handleAddBox} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Name (e.g. AJ - 1 Highs)</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Link (e.g. /collections/aj1-high)</label>
              <input 
                type="text" 
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Image URL</label>
              <input 
                type="text" 
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                required
              />
            </div>
            
            {formData.image && (
              <div style={{ marginTop: '10px', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                <img src={formData.image} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '10px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                {editingIndex !== null ? 'Update Box' : 'Add Box'}
              </button>
              {editingIndex !== null && (
                <button 
                  type="button" 
                  onClick={() => { setEditingIndex(null); setFormData({name:'', link:'', image:''}); }}
                  style={{ padding: '10px', backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Current Boxes ({boxes.length})</h2>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Note: The frontend groups these boxes in pairs (2 per slide).</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {boxes.map((box, index) => (
              <div key={box.id || index} style={{ 
                display: 'flex', alignItems: 'center', gap: '15px', 
                padding: '15px', border: '1px solid #eee', borderRadius: '8px',
                backgroundColor: editingIndex === index ? '#f8fafc' : '#fff'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <button onClick={() => moveUp(index)} disabled={index === 0} style={{ border: 'none', background: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: index === 0 ? '#ddd' : '#666' }}>▲</button>
                  <button onClick={() => moveDown(index)} disabled={index === boxes.length - 1} style={{ border: 'none', background: 'none', cursor: index === boxes.length - 1 ? 'not-allowed' : 'pointer', color: index === boxes.length - 1 ? '#ddd' : '#666' }}>▼</button>
                </div>
                
                <img src={box.image} alt={box.name} style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '4px' }} />
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{box.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{box.link}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(index)}
                    style={{ padding: '8px', backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(index)}
                    style={{ padding: '8px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            {boxes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                No category boxes added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
