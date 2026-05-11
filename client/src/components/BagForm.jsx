import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const CATEGORIES = ['Tote', 'Clutch', 'Backpack', 'Sling', 'Shoulder', 'Other'];

const empty = {
  name: '',
  description: '',
  price: '',
  category: 'Tote',
  inStock: true,
  imageUrls: [],
};

export default function BagForm({ bag, onSave, onClose }) {
  const isEdit = Boolean(bag);
  const [form, setForm] = useState(
    bag
      ? { ...bag, price: bag.price.toString(), imageUrls: Array.isArray(bag.imageUrls) && bag.imageUrls.length > 0 ? bag.imageUrls : bag.imageUrl ? [bag.imageUrl] : [] }
      : { ...empty }
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData();
          fd.append('image', file);
          const { data } = await api.post('/api/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return data.imageUrl;
        })
      );
      set('imageUrls', [...form.imageUrls, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    set('imageUrls', form.imageUrls.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.imageUrls.length) { toast.error('Please upload at least one image'); return; }
    setSaving(true);
    try {
      await onSave({ ...form, price: Number(form.price) }, isEdit);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Bag' : 'Add New Bag'}</h3>
          <button className="btn btn-ghost" onClick={onClose} style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. Classic Leather Tote" />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} required placeholder="Describe the bag…" />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Price (৳) *</label>
                <input type="number" min="0" step="1" value={form.price} onChange={(e) => set('price', e.target.value)} required placeholder="0" />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <label className="form-check">
              <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} />
              In Stock
            </label>

            <div className="form-group">
              <label>Photos * {form.imageUrls.length > 0 && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({form.imageUrls.length} added)</span>}</label>
              <div className="upload-btn-wrap">
                <label className="upload-label">
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                  {uploading ? '⏳ Uploading…' : '📷 Add photos'}
                </label>
                {uploading && <span className="upload-status">Uploading…</span>}
              </div>

              {form.imageUrls.length > 0 && (
                <div className="img-grid">
                  {form.imageUrls.map((url, i) => (
                    <div key={url} className="img-thumb-wrap">
                      <img src={url} alt={`Photo ${i + 1}`} className="img-thumb" />
                      <button type="button" className="img-thumb-remove" onClick={() => removeImage(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Bag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
