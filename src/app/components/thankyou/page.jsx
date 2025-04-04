"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Header from '../header';
import Footer from '../footer'
export default function ThankYou() {
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orderData = localStorage.getItem('lastOrder');
    if (orderData) {
      setOrder(JSON.parse(orderData));
    }
  }, []);

  return (
   <div>
    <Header/>
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        
        <Typography variant="h5" gutterBottom>
          
          Your order has been successfully registered.
        </Typography>

        {order && (
          <Box sx={{ my: 3 }}>
            <Typography>
               Order Number: {order._id}
            </Typography>
            <Typography>
            Tracking code : {Math.random().toString(36).substring(2, 15).toUpperCase()}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push('/components/account')}
          >
            View orders

          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push('/')}
         >
            Return to Main Page
          </Button>
        </Box>
      </Paper>
    </Container>
    <Footer/>
    </div>
  );
} 