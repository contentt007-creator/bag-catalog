import { useEffect, useState } from 'react';

export default function Lightbox({ images, startIndex = 0, onClose, bag }) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const price = bag?.price != null ? '৳' + new Intl.NumberFormat('en-BD').format(bag.price) : null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>×</button>

      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        {/* Photo side */}
        <div className="lightbox-photo-side">
          <img src={images[current]} alt={`Photo ${current + 1}`} className="lightbox-img" />

          {images.length > 1 && (
            <>
              <button className="lightbox-nav lightbox-prev" onClick={prev}>‹</button>
              <button className="lightbox-nav lightbox-next" onClick={next}>›</button>
              <div className="lightbox-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`lightbox-dot${i === current ? ' active' : ''}`}
                    onClick={() => setCurrent(i)}
                  />
                ))}
              </div>
            </>
          )}

          {images.length > 1 && (
            <div className="lightbox-thumbs">
              {images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`thumb ${i + 1}`}
                  className={`lightbox-thumb${i === current ? ' active' : ''}`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details side */}
        {bag && (
          <div className="lightbox-details">
            <div className="lightbox-details-top">
              <span className="category-badge">{bag.category}</span>
              <span className={`stock-badge ${bag.inStock ? 'in' : 'out'}`}>
                {bag.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <h2 className="lightbox-name">{bag.name}</h2>
            {price && <div className="lightbox-price">{price}</div>}
            {bag.description && (
              <p className="lightbox-desc">{bag.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
