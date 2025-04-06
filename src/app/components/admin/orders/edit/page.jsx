"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid
} from "@mui/material";
import Header from '../../adminUI/Drawer';

export default function EditOrder() {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [shippingAddress, setShippingAddress] = useState({ city: "", street: "" });
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://rosegoldgallery-back.onrender.com/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("خطا در دریافت سفارش");

      const data = await response.json();
      setOrder(data);
      setStatus(data.status);
      setTrackingCode(data.trackingCode);
      setTotalAmount(data.totalAmount);
      setShippingAddress(data.shippingAddress || { city: "", street: "" });
      setItems(data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://rosegoldgallery-back.onrender.com/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          trackingCode,
          totalAmount,
          shippingAddress,
          items
        }),
      });

      if (!response.ok) throw new Error("خطا در بروزرسانی سفارش");

      router.push("/components/admin/orders");
    } catch (error) {
      console.error(error);
    }
  };

  if (!order) return <p>در حال بارگذاری...</p>;

  return (
    <Header>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Edit Order
          </Typography>

          <Grid container spacing={2}>
            {/* Tracking Code */}
            <Grid item xs={12}>
              <TextField
                label="Tracking code. "
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Total Amount */}
            <Grid item xs={12}>
              <TextField
                label="Total Price "
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Shipping Address */}
            <Grid item xs={6}>
              <TextField
                label="city"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="street"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, street: e.target.value })
                }
                fullWidth
              />
            </Grid>

            {/* Order Status */}
            <Grid item xs={12}>
              <TextField
                select
                label=" order Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value="pending">در انتظار</MenuItem>
                <MenuItem value="processing">در حال پردازش</MenuItem>
                <MenuItem value="completed">تکمیل شده</MenuItem>
                <MenuItem value="cancelled">لغو شده</MenuItem>
              </TextField>
            </Grid>

            {/* Product Items */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                محصولات سفارش
              </Typography>
              {items.map((item, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="نام محصول"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].name = e.target.value;
                        setItems(newItems);
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="تعداد"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].quantity = e.target.value;
                        setItems(newItems);
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="قیمت واحد"
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].price = e.target.value;
                        setItems(newItems);
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button sx={{color:'black'}} variant="contained" color="primary" fullWidth onClick={handleUpdate}>
                بروزرسانی سفارش
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Header>
  );
}
