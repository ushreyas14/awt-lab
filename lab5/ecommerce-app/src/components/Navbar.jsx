import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { cart } = useCart();

  let totalItems = 0;
  for (let i = 0; i < cart.length; i++) {
    totalItems += cart[i].quantity;
  }

  return (
    <nav style={{
      backgroundColor: '#4a90d9',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
        ShopEasy
      </Link>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
          Home
        </Link>
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>
          Cart ({totalItems})
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
