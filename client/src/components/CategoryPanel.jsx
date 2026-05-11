import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function CategoryPanel({ onCategoriesChange }) {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    try {
      const { data } = await api.get('/api/categories');
      const cats = Array.isArray(data) ? data : [];
      setCategories(cats);
      onCategoriesChange?.(cats);
    } catch {}
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const { data } = await api.post('/api/categories', { name: newName.trim() });
      const updated = [...categories, data];
      setCategories(updated);
      onCategoriesChange?.(updated);
      setNewName('');
      toast.success(`Category "${data.name}" added`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(cat) {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await api.delete(`/api/categories/${cat._id}`);
      const updated = categories.filter((c) => c._id !== cat._id);
      setCategories(updated);
      onCategoriesChange?.(updated);
      toast.success(`"${cat.name}" deleted`);
    } catch {
      toast.error('Failed to delete category');
    }
  }

  return (
    <div className="category-panel">
      <div className="category-panel-header">
        <h3>Categories</h3>
      </div>

      <form className="category-add-form" onSubmit={handleAdd}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name…"
          className="category-input"
        />
        <button className="btn btn-primary" type="submit" disabled={adding || !newName.trim()}>
          {adding ? '…' : '+ Add'}
        </button>
      </form>

      <div className="category-tags">
        {categories.length === 0 ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <span key={cat._id} className="category-tag">
              {cat.name}
              <button className="category-tag-del" onClick={() => handleDelete(cat)}>×</button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
