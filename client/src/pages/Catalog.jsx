import { useState, useEffect } from 'react';
import api from '../api/axios';
import BagCard from '../components/BagCard';
import { Link } from 'react-router-dom';

export default function Catalog() {
  const [bags, setBags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/bags'),
      api.get('/api/categories'),
    ])
      .then(([bagsRes, catsRes]) => {
        setBags(Array.isArray(bagsRes.data) ? bagsRes.data : []);
        setCategories(Array.isArray(catsRes.data) ? catsRes.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? bags
    : bags.filter((b) => b.category === activeCategory);

  return (
    <div>
      <header className="catalog-header">
        <div className="catalog-header-inner">
          <Link to="/" className="catalog-logo">bag<span>haus</span></Link>
          <Link to="/admin" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            Admin
          </Link>
        </div>
      </header>

      <main className="catalog-main">
        <h1 className="catalog-title">Our Collection</h1>
        <p className="catalog-subtitle">Handcrafted bags for every occasion</p>

        <div className="filter-bar">
          <button
            className={`filter-btn${activeCategory === 'All' ? ' active' : ''}`}
            onClick={() => setActiveCategory('All')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`filter-btn${activeCategory === cat.name ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <strong>No bags found</strong>
            <p>Try a different category or check back soon.</p>
          </div>
        ) : (
          <div className="bag-grid">
            {filtered.map((bag) => <BagCard key={bag._id} bag={bag} />)}
          </div>
        )}
      </main>
    </div>
  );
}
