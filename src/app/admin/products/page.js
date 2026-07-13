'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search, Copy } from 'lucide-react';
import SeoEditorBox from '../../../components/admin/SeoEditorBox';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return p.title?.toLowerCase().includes(lowerQ) || p.vendor?.toLowerCase().includes(lowerQ) || p.category_slug?.toLowerCase().includes(lowerQ);
  });
  
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const uniqueCategories = Array.from(new Set(products.map(p => p.category_slug))).filter(Boolean);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [showNewCategoryInputEdit, setShowNewCategoryInputEdit] = useState(false);

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newComparePrice, setNewComparePrice] = useState('');
  const [newVendor, setNewVendor] = useState('Generic');
  const [newCategory, setNewCategory] = useState('sneakers');
  const [newStock, setNewStock] = useState('10');
  const [newDescription, setNewDescription] = useState('');
  const [newImages, setNewImages] = useState('');
  const [newColors, setNewColors] = useState('Black, White');
  const [newSizes, setNewSizes] = useState('39, 40, 41, 42, 43, 44, 45');
  const [newSizeStock, setNewSizeStock] = useState({});
  const [newSeo, setNewSeo] = useState({ title: '', description: '', keywords: '', ogImage: '' });

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e, isEditMode) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.urls && data.urls.length > 0) {
          if (isEditMode) {
             const currentImages = Array.isArray(editingProduct.images) ? editingProduct.images : (editingProduct.images ? editingProduct.images.split(/[\n,]+/).map(u => u.trim()).filter(Boolean) : []);
             const updatedImages = [...currentImages, ...data.urls];
             setEditingProduct({ ...editingProduct, images: updatedImages });
          } else {
             const currentUrls = newImages ? newImages.split(/[\n,]+/).map(u => u.trim()).filter(Boolean) : [];
             const updatedUrls = [...currentUrls, ...data.urls];
             setNewImages(updatedUrls.join('\n'));
          }
        }
      } else {
        alert('Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const pRes = await fetch('/api/products');
      if (pRes.ok) {
        const pData = await pRes.json();
        setProducts(pData);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newTitle,
        price: parseFloat(newPrice),
        compare_at_price: newComparePrice ? parseFloat(newComparePrice) : null,
        vendor: newVendor,
        category_slug: newCategory,
        stock: parseInt(newStock),
        description: newDescription,
        images: newImages ? newImages.split(/[\n,]+/).map(url => url.trim()).filter(Boolean) : [],
        colors: newColors.split(',').map(c => c.trim()).filter(Boolean),
        sizes: newSizes.split(',').map(s => {
          const val = s.trim();
          if (val === '') return null;
          const num = Number(val);
          return isNaN(num) ? val : num;
        }).filter(s => s !== null),
        sizeStock: newSizeStock,
        featured: false,
        new_arrival: false,
        flash_sale: false,
        seo: newSeo,
        created_at: new Date().toISOString()
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowAddProductModal(false);
        setNewTitle(''); setNewPrice(''); setNewComparePrice(''); setNewVendor('Generic'); setNewStock('10'); setNewDescription(''); setNewSeo({ title: '', description: '', keywords: '', ogImage: '' }); setNewColors('Black, White'); setNewSizes('39, 40, 41, 42, 43, 44, 45'); setNewImages(''); setNewSizeStock({});
        loadData();
      }
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleDuplicateProduct = async (product) => {
    if (!confirm("Are you sure you want to duplicate this product?")) return;
    try {
      const payload = { ...product };
      delete payload.id;
      delete payload._id;
      payload.title = payload.title + ' (Copy)';
      
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        loadData();
      } else {
        alert("Failed to duplicate product");
      }
    } catch (err) {
      console.error("Failed to duplicate product", err);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editingProduct };
      if (typeof payload.images === 'string') {
        payload.images = payload.images.split(/[\n,]+/).map(url => url.trim()).filter(Boolean);
      }
      if (typeof payload.colors === 'string') {
        payload.colors = payload.colors.split(',').map(c => c.trim()).filter(Boolean);
      }
      if (typeof payload.sizes === 'string') {
        payload.sizes = payload.sizes.split(',').map(s => {
          const val = s.trim();
          if (val === '') return null;
          const num = Number(val);
          return isNaN(num) ? val : num;
        }).filter(s => s !== null);
      }

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingProduct(null);
        loadData();
      }
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#18181b' }}>Products Inventory ({products.length})</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px 10px 10px 35px', borderRadius: '6px', border: '1px solid #e4e4e7', width: '250px' }}
            />
            <Search size={16} color="#71717a" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button 
            onClick={() => setShowAddProductModal(true)}
            style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f4f4f5' }}>
            <tr style={{ color: '#71717a', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '15px' }}>Image</th>
              <th style={{ padding: '15px' }}>Details</th>
              <th style={{ padding: '15px' }}>Category</th>
              <th style={{ padding: '15px' }}>Price</th>
              <th style={{ padding: '15px' }}>Stock</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#71717a' }}>No products found matching your search.</td>
              </tr>
            ) : (
              filteredProducts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                  <td style={{ padding: '15px' }}><img src={p.images?.[0] || '/images/sneaker_black.jpg'} alt={p.title} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} /></td>
                <td style={{ padding: '15px' }}>
                  <strong style={{ display: 'block', color: '#18181b', fontSize: '14px' }}>{p.title}</strong>
                  <span style={{ fontSize: '12px', color: '#71717a' }}>Brand: {p.vendor}</span>
                </td>
                <td style={{ padding: '15px', fontSize: '14px', textTransform: 'capitalize' }}>{p.category_slug}</td>
                <td style={{ padding: '15px', fontSize: '14px', fontWeight: '500' }}>Rs. {p.price.toLocaleString()}</td>
                <td style={{ padding: '15px', fontSize: '14px' }}>
                  <span style={{ fontWeight: '600', color: p.stock < 5 ? '#ef4444' : '#10b981' }}>{p.stock}</span>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setEditingProduct(p)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '5px' }} title="Edit"><Edit2 size={16} /></button>
                    <button onClick={() => handleDuplicateProduct(p)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: '5px' }} title="Duplicate"><Copy size={16} /></button>
                    <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      {showAddProductModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e4e4e7', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Add New Product</h3>
              <button onClick={() => setShowAddProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Product Title *</label>
                <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Price (PKR) *</label>
                  <input type="number" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Compare-at Price</label>
                  <input type="number" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newComparePrice} onChange={e => setNewComparePrice(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Brand *</label>
                  <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newVendor} onChange={e => setNewVendor(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Category *</label>
                  <select style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={showNewCategoryInput ? '__NEW__' : newCategory} onChange={e => {
                    if (e.target.value === '__NEW__') {
                      setShowNewCategoryInput(true);
                      setNewCategory('');
                    } else {
                      setShowNewCategoryInput(false);
                      setNewCategory(e.target.value);
                    }
                  }}>
                    <option value="" disabled>Select a category</option>
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="__NEW__">+ Add New Category</option>
                  </select>
                  {showNewCategoryInput && (
                    <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px', marginTop: '10px' }} value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Enter new category name" />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Colors (comma separated)</label>
                  <input type="text" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newColors} onChange={e => setNewColors(e.target.value)} placeholder="e.g. Black, White" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Sizes (comma separated)</label>
                  <input type="text" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newSizes} onChange={e => setNewSizes(e.target.value)} placeholder="e.g. 39, 40, 41" />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Global Stock *</label>
                <input type="number" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newStock} onChange={e => setNewStock(e.target.value)} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Stock per Size</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {newSizes.split(',').map(s => s.trim()).filter(Boolean).map(size => (
                    <div key={size} style={{ display: 'flex', flexDirection: 'column', width: '80px' }}>
                      <span style={{ fontSize: '12px', color: '#666', marginBottom: '3px' }}>Size {size}</span>
                      <input type="number" style={{ padding: '6px', border: '1px solid #e4e4e7', borderRadius: '4px' }} value={newSizeStock[size] !== undefined ? newSizeStock[size] : ''} onChange={e => setNewSizeStock({...newSizeStock, [size]: e.target.value === '' ? '' : parseInt(e.target.value)})} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Product Images</label>
                <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                  <textarea rows="3" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newImages} onChange={e => setNewImages(e.target.value)} placeholder="Paste URLs here (comma or newline separated)"></textarea>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>OR upload:</span>
                    <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, false)} disabled={isUploading} style={{ fontSize: '13px' }} />
                    {isUploading && <span style={{ fontSize: '13px', color: '#3b82f6' }}>Uploading...</span>}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Description</label>
                <textarea rows="4" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={newDescription} onChange={e => setNewDescription(e.target.value)}></textarea>
              </div>
              <SeoEditorBox seoData={newSeo} onChange={setNewSeo} />
              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}>Save Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal (Similar structure) */}
      {editingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e4e4e7', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleEditProduct}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Product Title</label>
                <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Price</label>
                  <input type="number" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Compare-at Price</label>
                  <input type="number" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={editingProduct.compare_at_price || ''} onChange={e => setEditingProduct({...editingProduct, compare_at_price: e.target.value ? parseFloat(e.target.value) : null})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Brand</label>
                  <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={editingProduct.vendor} onChange={e => setEditingProduct({...editingProduct, vendor: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Category *</label>
                  <select style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={showNewCategoryInputEdit ? '__NEW__' : (editingProduct.category_slug || '')} onChange={e => {
                    if (e.target.value === '__NEW__') {
                      setShowNewCategoryInputEdit(true);
                      setEditingProduct({...editingProduct, category_slug: ''});
                    } else {
                      setShowNewCategoryInputEdit(false);
                      setEditingProduct({...editingProduct, category_slug: e.target.value});
                    }
                  }}>
                    <option value="" disabled>Select a category</option>
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="__NEW__">+ Add New Category</option>
                  </select>
                  {showNewCategoryInputEdit && (
                    <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px', marginTop: '10px' }} value={editingProduct.category_slug} onChange={e => setEditingProduct({...editingProduct, category_slug: e.target.value})} placeholder="Enter new category name" />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Colors (comma separated)</label>
                  <input type="text" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={Array.isArray(editingProduct.colors) ? editingProduct.colors.join(', ') : editingProduct.colors || ''} onChange={e => setEditingProduct({...editingProduct, colors: e.target.value})} placeholder="e.g. Black, White" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Sizes (comma separated)</label>
                  <input type="text" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={Array.isArray(editingProduct.sizes) ? editingProduct.sizes.join(', ') : editingProduct.sizes || ''} onChange={e => setEditingProduct({...editingProduct, sizes: e.target.value})} placeholder="e.g. 39, 40, 41" />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Global Stock</label>
                <input type="number" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Stock per Size</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {(Array.isArray(editingProduct.sizes) ? editingProduct.sizes : (editingProduct.sizes || '').toString().split(',').map(s => s.trim()).filter(Boolean)).map(size => (
                    <div key={size} style={{ display: 'flex', flexDirection: 'column', width: '80px' }}>
                      <span style={{ fontSize: '12px', color: '#666', marginBottom: '3px' }}>Size {size}</span>
                      <input type="number" style={{ padding: '6px', border: '1px solid #e4e4e7', borderRadius: '4px' }} value={editingProduct.sizeStock?.[size] !== undefined ? editingProduct.sizeStock[size] : ''} onChange={e => setEditingProduct({...editingProduct, sizeStock: {...(editingProduct.sizeStock || {}), [size]: e.target.value === '' ? '' : parseInt(e.target.value)}})} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Product Images</label>
                <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                  <textarea rows="3" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={Array.isArray(editingProduct.images) ? editingProduct.images.join('\n') : editingProduct.images || ''} onChange={e => setEditingProduct({...editingProduct, images: e.target.value})} placeholder="Paste URLs here (comma or newline separated)"></textarea>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>OR upload:</span>
                    <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, true)} disabled={isUploading} style={{ fontSize: '13px' }} />
                    {isUploading && <span style={{ fontSize: '13px', color: '#3b82f6' }}>Uploading...</span>}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Description</label>
                <textarea rows="4" style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}></textarea>
              </div>
              <SeoEditorBox seoData={editingProduct.seo || { title: '', description: '', keywords: '', ogImage: '' }} onChange={(seo) => setEditingProduct({...editingProduct, seo})} />
              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '20px' }}>Update Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
