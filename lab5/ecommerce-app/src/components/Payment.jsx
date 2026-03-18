import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Payment() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // go back if cart empty
  useEffect(() => {
    if (cart.length === 0 && !isDone && !isProcessing) {
      navigate('/cart');
    }
  }, [cart, isDone, isProcessing]);

  // calculate total
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
  }

  function handlePayment(e) {
    e.preventDefault();
    setIsProcessing(true);
    setProgress(0);

    // fake 4 second loading
    let current = 0;
    let timer = setInterval(() => {
      current += 2;
      setProgress(current);

      if (current >= 100) {
        clearInterval(timer);
        setIsProcessing(false);
        setIsDone(true);
        clearCart();
      }
    }, 80);
  }

  // success screen
  if (isDone) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ color: 'green' }}>Payment Successful!</h1>
        <p>Thank you for your purchase, {name}!</p>
        <p>Total paid: <strong>${total.toFixed(2)}</strong></p>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '10px 25px', backgroundColor: '#4a90d9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px', fontSize: '16px' }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // processing screen with loading bar
  if (isProcessing) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Processing Payment...</h2>
        <p>Please wait, do not close this page.</p>
        <div style={{
          width: '300px',
          height: '25px',
          backgroundColor: '#ddd',
          borderRadius: '5px',
          margin: '20px auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: progress + '%',
            height: '100%',
            backgroundColor: '#4a90d9',
            transition: 'width 0.1s'
          }}></div>
        </div>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{progress}%</p>
      </div>
    );
  }

  // payment form
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Payment</h1>
      <p>Total: <strong>${total.toFixed(2)}</strong></p>

      <form onSubmit={handlePayment}>
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="john@email.com"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Card Number</label><br />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          Pay ${total.toFixed(2)}
        </button>
      </form>
    </div>
  );
}

export default Payment;
