import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import BagForm from '../components/BagForm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [bags, setBags] = useState([]);
  const [loadingBags, setLoadingBags] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBag, setEditingBag] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (isLoggedIn) fetchBags();
  }, [isLoggedIn]);

  async function fetchBags() {
    setLoadingBags(true);
    try {
      const { data } = await api.get('/api/bags');
      setBags(data);
    } catch {
      toast.error('Failed to load bags');
    } finally {
      setLoadingBags(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      toast.success('Logged in');
    } catch {
      toast.error('Invalid password');
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken('');
    setBags([]);
  }

  function openAdd() {
    setEditingBag(null);
    setModalOpen(true);
  }

  function openEdit(bag) {
    setEditingBag(bag);
    setModalOpen(true);
  }

  async function handleSave(formData, isEdit) {
    try {
      if (isEdit) {
        const { data } = await api.put(`/api/bags/${editingBag._id}`, formData);
        setBags((prev) => prev.map((b) => (b._id === data._id ? data : b)));
        toast.success('Bag updated');
      } else {
        const { data } = await api.post('/api/bags', formData);
        setBags((prev) => [data, ...prev]);
        toast.success('Bag added');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/api/bags/${deleteTarget._id}`);
      setBags((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success('Bag deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Admin Login</h1>
          <p>Enter your admin password to continue.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loginLoading}>
              {loginLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>← Back to catalog</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-title">bag<span>haus</span> Admin</div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/" className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>View Store</Link>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-content-header">
          <h2>Bags ({bags.length})</h2>
          <button className="btn btn-primary" onClick={openAdd}>+ Add New Bag</button>
        </div>

        {loadingBags ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : bags.length === 0 ? (
          <div className="empty-state">
            <strong>No bags yet</strong>
            <p>Add your first bag to get started.</p>
          </div>
        ) : (
          <div className="bag-table-wrap">
            <table className="bag-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bags.map((bag) => (
                  <tr key={bag._id}>
                    <td>
                      <img src={(bag.imageUrls || [])[0] || bag.imageUrl} alt={bag.name} className="bag-thumb" />
                    </td>
                    <td style={{ fontWeight: 500 }}>{bag.name}</td>
                    <td><span className="category-badge">{bag.category}</span></td>
                    <td>৳{new Intl.NumberFormat('en-BD').format(bag.price)}</td>
                    <td>
                      <span className={`stock-badge ${bag.inStock ? 'in' : 'out'}`}>
                        {bag.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEdit(bag)}>Edit</button>
                        <button className="btn btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setDeleteTarget(bag)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <BagForm
          bag={editingBag}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Bag"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
