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
  IconButton
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Header from "../adminUI/Drawer";

export default function Orders() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/components/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "admin") {
        console.log('User is not admin:', user.role);
        router.push('/');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/components/admin/login');
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
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
        throw new Error("خطا در دریافت سفارشات");
      }

      const data = await response.json();
      console.log("Fetched orders:", data);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('خطا در دریافت سفارشات. لطفا دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف سفارش مطمئن هستید؟")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
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
        throw new Error("خطا در حذف سفارش");
      }

      setOrders(orders.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('خطا در حذف سفارش. لطفا دوباره تلاش کنید.');
    }
  };

  

  return (
    <div>
      <Header>
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
                        {order.userId ? `${order.userId.fname} ${order.userId.lname}` : 'نامشخص'}
                      </TableCell>
                      <TableCell>
                        {order.items.map((item) => (
                          <div key={item.id}>
                            {item.name} (x{item.quantity})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>${order.totalAmount}</TableCell>
                      <TableCell>
                        {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.street}` : "ندارد"}
                      </TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => router.push(`/components/admin/orders/edit/${order._id}`)}>
                          <Edit sx={{color:'black'}}/>
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
      </Header>
    </div>
  );
}
