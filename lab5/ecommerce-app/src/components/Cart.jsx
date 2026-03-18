import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Your cart is empty</h2>
        <p>Go add some products!</p>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '10px 20px', backgroundColor: '#4a90d9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
        >
          Go Shopping
        </button>
      </div>
    );
  }

  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1>Shopping Cart</h1>

      {cart.map(item => (
        <div key={item.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          padding: '15px',
          borderBottom: '1px solid #ddd',
          backgroundColor: 'white',
          marginBottom: '10px',
          borderRadius: '5px'
        }}>
          <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '5px' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{item.name}</h3>
            <p style={{ margin: '5px 0', color: 'gray' }}>Qty: {item.quantity}</p>
            <p style={{ margin: 0, fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            style={{ padding: '5px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Remove
          </button>
        </div>
      ))}

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <h2>Total: ${total.toFixed(2)}</h2>
        <button
          onClick={() => navigate('/payment')}
          style={{ padding: '12px 30px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default Cart;
