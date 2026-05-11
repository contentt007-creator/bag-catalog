import { useState } from 'react';
import Lightbox from './Lightbox';

export default function BagCard({ bag }) {
  const images = Array.isArray(bag.imageUrls) && bag.imageUrls.length > 0
    ? bag.imageUrls
    : bag.imageUrl ? [bag.imageUrl] : [];
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const price = bag.price != null ? '৳' + new Intl.NumberFormat('en-BD').format(bag.price) : null;

  const prev = (e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % images.length); };

  const openLightbox = (i) => { setLightboxStart(i); setLightboxOpen(true); };

  return (
    <>
      <div className="bag-card">
        <div className="bag-card-image-wrap" onClick={() => openLightbox(current)}>
          {images[current] && (
            <img src={images[current]} alt={bag.name} loading="lazy" />
          )}
          {!bag.inStock && (
            <div className="out-of-stock-overlay">
              <span className="out-of-stock-label">Out of Stock</span>
            </div>
          )}
          {images.length > 1 && (
            <>
              <button className="card-nav card-prev" onClick={prev}>‹</button>
              <button className="card-nav card-next" onClick={next}>›</button>
              <div className="card-dots">
                {images.map((_, i) => (
                  <span key={i} className={`card-dot${i === current ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} />
                ))}
              </div>
            </>
          )}
          <div className="card-zoom-hint">🔍</div>
        </div>
        <div className="bag-card-body">
          <div className="bag-card-top">
            <h3 className="bag-card-name">{bag.name}</h3>
            <span className="category-badge">{bag.category}</span>
          </div>
          <p className="bag-card-desc">{bag.description}</p>
          {price && <div className="bag-card-price">{price}</div>}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox images={images} startIndex={lightboxStart} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
