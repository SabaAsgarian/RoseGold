"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import Header from '../header';
import Footer from '../footer';

export default function CheckOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const cartData = localStorage.getItem('cart');

    if (!userData || !cartData) {
      router.push('/components/basket');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      const parsedCart = JSON.parse(cartData);
      setCartItems(parsedCart.items);
      setTotalAmount(parsedCart.totalAmount);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing data:', error);
      router.push('/components/basket');
    }
  }, [router]);

  const handleConfirmOrder = async () => {
    try {
      console.log('Starting order confirmation...');
      
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      if (!token) {
        console.log('No token found, redirecting to login...');
        router.push('/components/account/userlogin');
        return;
      }

      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          img: item.img
        })),
        totalAmount,
        shippingAddress: {
          city: user.city,
          street: user.street
        }
      };

      console.log('Prepared order data:', orderData);

      const response = await fetch('https://rosegoldgallery-back.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('Server response data:', data);

      if (response.ok) {
        const orderToSave = {
          ...data.order,
          totalAmount: totalAmount
        };
        console.log('Saving order to localStorage:', orderToSave);
        localStorage.setItem('lastOrder', JSON.stringify(orderToSave));
        localStorage.removeItem('cart');
        
        console.log('Order saved successfully, redirecting to payment...');
        // Use router.push instead of window.location.href for better navigation
        router.push('/components/payment');
      } else {
        console.error('Server returned error:', data);
        throw new Error(data.error || 'خطا در ثبت سفارش');
      }
    } catch (error) {
      console.error('Detailed error in handleConfirmOrder:', error);
      alert(error.message || 'خطا در ثبت سفارش. لطفا دوباره تلاش کنید.');
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
    <div>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
           
            Confirm Order
          </Typography>
          
          {/* اطلاعات کاربر */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              
              Receiver's Information
            </Typography>
            <Typography>Name: {user.fname} {user.lname}</Typography>
            <Typography>Address: {user.city}، {user.street}</Typography>
            <Typography>Mobile No: {user.mobile}</Typography>
          </Box>

          {/* لیست محصولات */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Price </TableCell>
                  <TableCell align="right">Total Price </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img 
                          src={`https://rosegoldgallery-back.onrender.com/${item.img}`}
                          alt={item.name}
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                        {item.name}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${item.price}
                    </TableCell>
                    <TableCell align="right">
                      ${(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <strong>Total :</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>${totalAmount}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/components/basket')}
            >
              Return To Cart
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmOrder}
            >
              
              Pay & Final Registration of the order

            </Button>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
} 