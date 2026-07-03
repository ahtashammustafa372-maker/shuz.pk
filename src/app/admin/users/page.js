'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    setEditingUser(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setRole(user.role);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, email, password, role };
    
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        loadData();
      }
    } catch (err) {
      console.error("Failed to save user", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#18181b' }}>User Management ({users.length})</h2>
        <button 
          onClick={handleOpenAdd}
          style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
        >
          <Plus size={16} /> Add New User
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f4f4f5' }}>
            <tr style={{ color: '#71717a', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '15px' }}>Name</th>
              <th style={{ padding: '15px' }}>Email</th>
              <th style={{ padding: '15px' }}>Role</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                <td style={{ padding: '15px', fontWeight: '600', color: '#18181b' }}>{u.name}</td>
                <td style={{ padding: '15px', color: '#3f3f46' }}>{u.email}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                    backgroundColor: u.role === 'admin' ? '#e0e7ff' : '#f4f4f5',
                    color: u.role === 'admin' ? '#4f46e5' : '#71717a'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleOpenEdit(u)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '5px' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#71717a' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e4e4e7', paddingBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Name</label>
                <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Email</label>
                <input type="email" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Password</label>
                <input type="text" required style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>Role</label>
                <select style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }} value={role} onChange={e => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                {editingUser ? 'Update User' : 'Save User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
