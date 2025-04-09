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
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/components/account/userlogin');
        return;
      }
  
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          img: item.img
        })),
        totalAmount: totalAmount,
        shippingAddress: {
          city: user.city,
          street: user.street
        }
      };
  
      const response = await fetch('https://rosegoldgallery-back.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Generate tracking code
        const trackingCode = Math.random().toString(36).substring(2, 15).toUpperCase();
        
        // Store the order data with tracking code
        const orderToStore = {
          ...data.order,
          totalAmount: totalAmount,
          trackingCode: trackingCode
        };
        
        console.log('Storing order data:', orderToStore);
        localStorage.setItem('lastOrder', JSON.stringify(orderToStore));
        console.log('Stored in localStorage:', localStorage.getItem('lastOrder'));
        localStorage.removeItem('cart');
        
        // Use a small delay to ensure localStorage is updated
        setTimeout(() => {
          window.location.href = '/components/payment';
        }, 100);
      } else {
        throw new Error(data.error || 'Error placing order');
      }
    } catch (error) {
      console.error('Error during order confirmation:', error);
      alert(error.message || 'Error placing order. Please try again.');
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