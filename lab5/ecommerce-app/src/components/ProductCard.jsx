import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: 'white',
      textAlign: 'center'
    }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '5px' }}
      />
      <h3 style={{ margin: '10px 0 5px' }}>{product.name}</h3>
      <p style={{ color: 'gray', fontSize: '14px' }}>{product.description}</p>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a90d9' }}>
        ${product.price}
      </p>
      <button
        onClick={handleAdd}
        style={{
          padding: '8px 20px',
          backgroundColor: added ? 'green' : '#4a90d9',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        {added ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  );
}

export default ProductCard;
