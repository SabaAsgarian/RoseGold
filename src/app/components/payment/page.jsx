"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress
} from '@mui/material';

export default function Payment() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orderData = localStorage.getItem('lastOrder');
  
    if (!orderData) {
      router.push('/components/basket');
      return;
    }
  
    try {
      const parsedOrder = JSON.parse(orderData);
      if (!parsedOrder || !parsedOrder.totalAmount) {
        throw new Error('Invalid order data');
      }
      setOrder(parsedOrder);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing order data:', error);
      localStorage.removeItem('lastOrder');
      router.push('/components/basket');
    }
  }, [router]);

  const handlePayment = async () => {
    try {
      // Simulate payment processing
      const paymentSuccessful = true;
  
      if (paymentSuccessful) {
        // Keep the order data for the thank you page
        window.location.href = '/components/thankyou';
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment error. Please try again.');
    }
  };
  
  

  if (loading) {
    return (
      <Container sx={{ display: 'flex',flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
        <CircularProgress color="inherit" />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
        Order payment
        </Typography>
        
        <Box sx={{ my: 3 }}>
  <Typography align="center">
  Payable amount:  : {order ? order.totalAmount.toLocaleString() : "۰"} $
  </Typography>
</Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
          >
            Pay
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 