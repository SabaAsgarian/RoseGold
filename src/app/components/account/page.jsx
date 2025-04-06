"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Container, 
  Paper, 
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Header from '../header'
import Footer from '../footer'
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rosegoldgallery-back.onrender.com";

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push("/components/account/userlogin");
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // دریافت سفارش‌ها
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const ordersData = await response.json();
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [router]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Typography align="center">
            Please Sign In To Your Account.
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <Header/>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {user.img ? (
            <Avatar
              src={user.img}
              alt={`${user.fname} ${user.lname}`}
              sx={{ 
                width: 120, 
                height: 120, 
                margin: '0 auto', 
                mb: 2,
                border: '3px solid #1976d2'
              }}
            />
          ) : (
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                margin: '0 auto', 
                mb: 2,
                bgcolor: '#1976d2',
                fontSize: '2rem'
              }}
            >
              {user.fname?.[0]?.toUpperCase()}
            </Avatar>
          )}
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
            {user.fname} {user.lname}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gap: 2,
          bgcolor: '#f8f9fa',
          p: 3,
          borderRadius: '8px'
        }}>
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Mobile Number" value={user.mobile} />
          <InfoRow label="Age" value={user.age} />
          <InfoRow label="City" value={user.city} />
          <InfoRow label="Address" value={user.street} />
          <InfoRow label="User Type" value={user.role} />
        </Box>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
           
          Your Orders
        </Typography>
        
        {orders.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </TableCell>
                    <TableCell>{order.totalAmount.toLocaleString()} $</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: 
                            order.status === 'pending' ? '#fff3cd' :
                            order.status === 'processing' ? '#cfe2ff' :
                            order.status === 'completed' ? '#d1e7dd' : '#f8d7da',
                          color: 
                            order.status === 'pending' ? '#856404' :
                            order.status === 'processing' ? '#084298' :
                            order.status === 'completed' ? '#0f5132' : '#842029',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}
                      >
                        {order.status === 'pending' ? 'pending  ' :
                         order.status === 'processing' ? 'processing ' :
                         order.status === 'completed' ? 'completed ' : 'Cancelled '}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <Typography color="text.secondary">
                           You Have No Orders...
            </Typography>
          </Box>
        )}
      </StyledPaper>
    </Container>
    <Footer/>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <Box sx={{ 
    display: 'flex', 
    borderBottom: '1px solid #dee2e6',
    py: 2,
    '&:last-child': { borderBottom: 'none' }
  }}>
    <Typography sx={{ 
      fontWeight: 'bold', 
      width: '150px',
      color: '#495057'
    }}>
      {label}:
    </Typography>
    <Typography sx={{ color: '#212529' }}>
      {value || '---'}
    </Typography>
  </Box>
);
