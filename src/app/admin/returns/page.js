'use client';

import React, { useState, useEffect } from 'react';
import { Search, Edit2, RotateCcw } from 'lucide-react';

export default function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReturn, setEditingReturn] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/returns');
      if (res.ok) {
        const data = await res.json();
        setReturns(data);
      }
    } catch (err) {
      console.error("Failed to fetch returns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleEditClick = (ret) => {
    setEditingReturn({ ...ret });
    setIsEditModalOpen(true);
  };

  const handleUpdateReturn = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/returns/${editingReturn._id || editingReturn.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editingReturn.status })
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchReturns();
      } else {
        alert("Failed to update return");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating return");
    } finally {
      setSaving(false);
    }
  };

  const filteredReturns = returns.filter(r => 
    r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.order_id.toString().includes(searchQuery)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#18181b', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCcw size={24} /> Returns Management
          </h2>
          <p style={{ color: '#71717a', fontSize: '14px', marginTop: '5px' }}>Manage customer returns and refunds</p>
        </div>
        
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
          <input 
            type="text" 
            placeholder="Search by name or order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px 10px 10px 38px', border: '1px solid #e4e4e7', borderRadius: '6px', fontSize: '14px', width: '250px' }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f8f9', borderBottom: '1px solid #e4e4e7', textAlign: 'left' }}>
              <th style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600', color: '#52525b' }}>ID</th>
              <th style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600', color: '#52525b' }}>Order ID</th>
              <th style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600', color: '#52525b' }}>Customer</th>
              <th style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600', color: '#52525b' }}>Product</th>
              <th style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600', color: '#52525b' }}>Date</th>
              <th style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600', color: '#52525b' }}>Status</th>
              <th style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '600', color: '#52525b', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading returns...</td></tr>
            ) : filteredReturns.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#71717a' }}>No returns found.</td></tr>
            ) : (
              filteredReturns.map(ret => (
                <tr key={ret._id || ret.id} style={{ borderBottom: '1px solid #e4e4e7' }}>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#3f3f46' }}>#{ret._id || ret.id}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#3f3f46', fontWeight: '500' }}>#{ret.order_id}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px' }}>
                    <div style={{ fontWeight: '500', color: '#18181b' }}>{ret.customer_name}</div>
                    <div style={{ fontSize: '12px', color: '#71717a' }}>{ret.customer_email}</div>
                  </td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#3f3f46' }}>
                    <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ret.product_name}
                    </div>
                  </td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#71717a' }}>{new Date(ret.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '15px 20px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      backgroundColor: ret.status === 'Approved' ? '#dcfce7' : ret.status === 'Rejected' ? '#fee2e2' : ret.status === 'Refunded' ? '#e0e7ff' : '#fef9c3',
                      color: ret.status === 'Approved' ? '#166534' : ret.status === 'Rejected' ? '#991b1b' : ret.status === 'Refunded' ? '#3730a3' : '#854d0e'
                    }}>
                      {ret.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleEditClick(ret)}
                      style={{ padding: '6px', backgroundColor: '#f4f4f5', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#52525b' }}
                      title="Update Status"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingReturn && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', width: '500px', maxWidth: '90%' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#18181b' }}>Update Return Status</h3>
            
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f8f9', borderRadius: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><span style={{ color: '#71717a' }}>Order ID:</span> <span style={{ fontWeight: '600' }}>#{editingReturn.order_id}</span></div>
                <div><span style={{ color: '#71717a' }}>Customer:</span> <span style={{ fontWeight: '600' }}>{editingReturn.customer_name}</span></div>
                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#71717a' }}>Product:</span> <span style={{ fontWeight: '600' }}>{editingReturn.product_name}</span></div>
                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#71717a' }}>Reason:</span> <span>{editingReturn.reason}</span></div>
              </div>
            </div>

            <form onSubmit={handleUpdateReturn}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#3f3f46' }}>Status</label>
                <select 
                  value={editingReturn.status} 
                  onChange={(e) => setEditingReturn({ ...editingReturn, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: '10px 15px', backgroundColor: '#f4f4f5', color: '#3f3f46', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{ padding: '10px 15px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
