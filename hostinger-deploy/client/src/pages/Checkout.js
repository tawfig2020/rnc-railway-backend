import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckoutFlow from '../components/marketplace/CheckoutFlow';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      // Redirect to marketplace if cart is empty
      navigate('/marketplace');
    }
    setLoading(false);
  }, [navigate]);

  // Calculate cart total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // Update cart in localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else if (!loading && cart.length === 0) {
      localStorage.removeItem('cart');
      navigate('/marketplace');
    }
  }, [cart, navigate, loading]);

  if (loading) {
    return (
      <Container>
        <Box py={4} textAlign="center">
          <Typography variant="h6">Loading checkout...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <CheckoutFlow 
        cart={cart} 
        setCart={setCart} 
        calculateTotal={calculateTotal}
      />
    </Box>
  );
};

export default Checkout;
