export default function BagCard({ bag }) {
  const price = new Intl.NumberFormat('en-BD').format(bag.price);

  return (
    <div className="bag-card">
      <div className="bag-card-image-wrap">
        <img src={bag.imageUrl} alt={bag.name} loading="lazy" />
        {!bag.inStock && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-label">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="bag-card-body">
        <div className="bag-card-top">
          <h3 className="bag-card-name">{bag.name}</h3>
          <span className="category-badge">{bag.category}</span>
        </div>
        <p className="bag-card-desc">{bag.description}</p>
        <div className="bag-card-price">৳{price}</div>
      </div>
    </div>
  );
}
