import { useEffect, useState } from 'react';

export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>×</button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
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
      </div>

      {images.length > 1 && (
        <div className="lightbox-counter">{current + 1} / {images.length}</div>
      )}
    </div>
  );
}
