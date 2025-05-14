"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Header from "../adminUI/Drawer";

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (e) {
    return true;
  }
};

export default function Orders() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token || isTokenExpired(token)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/components/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "admin") {
        router.push('/');
        return;
      }
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/components/admin/login');
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push('/components/admin/login');
        return;
      }

      const response = await fetch("https://rosegoldgallery-back.onrender.com/api/orders/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/components/admin/login');
          return;
        }
        throw new Error("Error Fetching Orders!!!");
      }

      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error Fetching Orders Please Try Again!!');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("  Are You Sure You Want to delete This Order???   ")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push('/components/admin/login');
        return;
      }

      const response = await fetch(`https://rosegoldgallery-back.onrender.com/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/components/admin/login');
          return;
        }
        throw new Error("Error In Deleting This Order!!   ");
      }

      setOrders(orders.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(' Error In Deleting This Order!! Please Try Again!!!');
    }
  };

  if (loading) {
    return (
      <Header>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </Header>
    );
  }

  return (
    <div>
      <Header>
        <Box sx={{ maxWidth: '92vw', overflowX: 'hidden' }}>
          <Grid container>
            <Grid item xs={12}>
              <Box sx={{ width: '100%', mx: 'auto', px: { xs: 1, sm: 2, md: 3 } }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      Managing Orders
                    </Typography>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tracking code </TableCell>
                            <TableCell>User's Name </TableCell>
                            <TableCell>Products</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Shipping address </TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Register Time </TableCell>
                            <TableCell>op</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>{order.trackingCode}</TableCell>
                              <TableCell>
                                {order.userId ? `${order.userId.fname} ${order.userId.lname}` : 'Unknown'}
                              </TableCell>
                              <TableCell>
                                {order.items.map((item) => (
                                  <div key={item.id}>
                                    {item.name || 'Unknown Product'} (x{item.quantity})
                                  </div>
                                ))}
                              </TableCell>
                              <TableCell>${order.totalAmount}</TableCell>
                              <TableCell>
                                {order.userId ? `${order.userId.city}, ${order.userId.street}` : "Address not available"}
                              </TableCell>
                              <TableCell>{order.status}</TableCell>
                              <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                              <TableCell>
                                <IconButton color="primary" onClick={() => router.push(`/components/admin/orders/edit/${order._id}`)}>
                                  <Edit sx={{ color: 'black' }} />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(order._id)}>
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Container>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Header>
    </div>
  );
}
