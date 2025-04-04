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
      setOrder(JSON.parse(orderData));
    } catch (error) {
      console.error('Error parsing JSON:', error);
      localStorage.removeItem('lastOrder');
      router.push('/components/basket');
    }
  
    setLoading(false);
  }, [router])

  const handlePayment = async () => {
    try {
      console.log("در حال پردازش پرداخت...");
  
      // شبیه‌سازی پرداخت موفق
      const paymentSuccessful = true;
  
      if (paymentSuccessful) {
        console.log("پرداخت موفق بود، انتقال به صفحه تشکر...");
        localStorage.removeItem('lastOrder'); // Clear the order data after successful payment
        router.push('/components/thankyou');
      } else {
        console.log("پرداخت ناموفق بود");
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment error. Please try again.');
    }
  };
  
  

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
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