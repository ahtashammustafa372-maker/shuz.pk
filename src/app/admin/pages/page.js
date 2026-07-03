'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import SeoEditorBox from '../../../components/admin/SeoEditorBox';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'page',
    content: '',
    seo: { title: '', description: '', keywords: '', ogImage: '' }
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (page = null) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        title: page.title,
        slug: page.slug,
        type: page.type,
        content: page.content,
        seo: page.seo || { title: '', description: '', keywords: '', ogImage: '' }
      });
    } else {
      setEditingPage(null);
      setFormData({
        title: '',
        slug: '',
        type: 'page',
        content: '',
        seo: { title: '', description: '', keywords: '', ogImage: '' }
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title if it's a new page and slug isn't manually edited
    if (name === 'title' && !editingPage) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingPage ? `/api/pages/${editingPage.id}` : '/api/pages';
      const method = editingPage ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        fetchPages();
        handleCloseModal();
      } else {
        alert('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        fetchPages();
      } else {
        alert('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Error deleting page');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Pages & Policies</h1>
        <button 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
        >
          <Plus size={18} /> Add New Page
        </button>
      </div>

      {/* Pages Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '15px 20px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '15px 20px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Title</th>
              <th style={{ padding: '15px 20px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Type</th>
              <th style={{ padding: '15px 20px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase' }}>Slug</th>
              <th style={{ padding: '15px 20px', fontWeight: '600', color: '#475569', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>Loading pages...</td></tr>
            ) : pages.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center' }}>No pages found.</td></tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#64748b' }}>#{page.id}</td>
                  <td style={{ padding: '15px 20px', fontWeight: '500' }}>{page.title}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{ 
                      display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: page.type === 'policy' ? '#e0e7ff' : page.type === 'blog' ? '#dcfce7' : '#f1f5f9',
                      color: page.type === 'policy' ? '#3730a3' : page.type === 'blog' ? '#166534' : '#475569'
                    }}>
                      {page.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#64748b' }}>/{page.type === 'policy' ? 'policies' : page.type === 'blog' ? 'blogs' : 'pages'}/{page.slug}</td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleOpenModal(page)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '15px' }}
                      title="Edit Page"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(page.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Delete Page"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{editingPage ? 'Edit Page' : 'Add New Page'}</h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <form id="page-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Page Title *</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange} 
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Page Type *</label>
                    <select 
                      name="type" 
                      value={formData.type} 
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff' }}
                    >
                      <option value="page">Standard Page</option>
                      <option value="policy">Policy</option>
                      <option value="blog">Blog Post</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>URL Slug *</label>
                  <input 
                    type="text" 
                    name="slug" 
                    value={formData.slug} 
                    onChange={handleChange} 
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                  />
                  <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
                    This will be the URL: /{(formData.type === 'policy' ? 'policies' : formData.type === 'blog' ? 'blogs' : 'pages')}/{formData.slug || 'slug'}
                  </small>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Content (HTML) *</label>
                  <textarea 
                    name="content" 
                    value={formData.content} 
                    onChange={handleChange} 
                    required
                    rows={12}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontFamily: 'monospace' }}
                    placeholder="<h2>Heading</h2><p>Paragraph content...</p>"
                  ></textarea>
                </div>
                
                <SeoEditorBox seoData={formData.seo} onChange={(seo) => setFormData(prev => ({...prev, seo}))} />
              </form>
            </div>
            
            <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                onClick={handleCloseModal}
                style={{ padding: '10px 20px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="page-form"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
              >
                <Save size={18} /> Save Page
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
