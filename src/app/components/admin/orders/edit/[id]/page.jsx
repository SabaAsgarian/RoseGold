"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Grid,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Header from "../../../adminUI/Drawer";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const WhiteTextField = styled(TextField)({
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  "& .MuiInputBase-input": {
    color: "black",
  },
  "& .MuiInputLabel-root": {
    color: "black",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "grey",
    },
  },
});

export default function EditOrder({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
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
      console.error('Error parsing user data:', error);
      router.push('/components/admin/login');
      return;
    }

    fetchOrder();
  }, [params.id, router]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/components/admin/login');
        return;
      }

      console.log('Fetching order with ID:', params.id);
      const response = await fetch(`https://rosegoldgallery-back.onrender.com/api/orders/${params.id}`, {
        headers: {
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
        if (response.status === 404) {
          setError('سفارش یافت نشد');
          setLoading(false);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch order");
      }

      const data = await response.json();
      console.log('Received order data:', data);
      setOrder(data);
      setEditedOrder(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/components/admin/login');
        return;
      }

      const response = await fetch(`https://rosegoldgallery-back.onrender.com/api/orders/${params.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: editedOrder.status,
          shippingAddress: editedOrder.shippingAddress,
          items: editedOrder.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('سفارش یافت نشد');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order");
      }

      const data = await response.json();
      setOrder(data.order);
      setIsEditing(false);
      alert('Order Updated Successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert(error.message || ' Error updating order:  ');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", height: "100vh",color:'black' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography color="error" sx={{color:'black'}}>{error}</Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/components/admin/orders')}
            sx={{ mt: 2 }}
          >
            بازگشت به لیست سفارشات
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Typography>سفارش یافت نشد</Typography>
      </Container>
    );
  }

  return (
    <div>
      <Header>
        <Box sx={{
          maxWidth: '92vw',
          overflowX: 'hidden'
        }}>
          <Grid container>
            <Grid item xs={12}>
              <Box sx={{
                width: { xs: '100%', sm: '100%' },
                mx: 'auto',
                px: { xs: 1, sm: 2, md: 3 },
              }}>
                <Container maxWidth="md" sx={{ py: 4 }}>
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <IconButton onClick={() => router.push('/components/admin/orders')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                      </IconButton>
                      <Typography variant="h5">
                        Edit order#{order.trackingCode}
                      </Typography>
                    </Box>

                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell />
                            <TableCell>User's Name</TableCell>
                            <TableCell>Tracking code. </TableCell>
                            <TableCell>Total Price </TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Op</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => setExpanded(!expanded)}
                              >
                                {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              {order.userId ? `${order.userId.fname} ${order.userId.lname}` : 'نامشخص'}
                            </TableCell>
                            <TableCell>{order.trackingCode}</TableCell>
                            <TableCell>${order.totalAmount}</TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <WhiteTextField
                                    select
                                    size="small"
                                    value={editedOrder.status}
                                    onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value })}
                                    sx={{ minWidth: 150 }}
                                  >
                                    <MenuItem value="pending"> pending </MenuItem>
                                    <MenuItem value="processing"> processing </MenuItem>
                                    <MenuItem value="shipped">shipped </MenuItem>
                                    <MenuItem value="delivered">delivered  </MenuItem>
                                    <MenuItem value="completed">completed  </MenuItem>
                                    <MenuItem value="cancelled"> cancelled</MenuItem>
                                  </WhiteTextField>
                                  <IconButton onClick={handleSave} color="primary">
                                    <SaveIcon sx={{ color: 'black' }} />
                                  </IconButton>
                                  <IconButton onClick={() => {
                                    setIsEditing(false);
                                    setEditedOrder(order);
                                  }}>
                                    <ArrowBackIcon sx={{ color: 'black' }} />
                                  </IconButton>
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography>
                                    {order.status === 'pending' && 'pending  '}
                                    {order.status === 'processing' && 'processing  '}
                                    {order.status === 'shipped' && 'shipped '}
                                    {order.status === 'delivered' && 'delivered  '}
                                    {order.status === 'completed' && 'completed  '}
                                    {order.status === 'cancelled' && 'cancelled '}
                                  </Typography>
                                  <IconButton onClick={() => setIsEditing(true)}>
                                    <EditIcon sx={{ color: 'black' }} />
                                  </IconButton>
                                </Box>
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton onClick={() => router.push('/components/admin/orders')}>
                                <ArrowBackIcon sx={{ color: 'black' }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                              <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                  <Typography variant="h6" gutterBottom component="div">
                                    جزئیات سفارش
                                  </Typography>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2">تاریخ سفارش:</Typography>
                                      <Typography>
                                        {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2">آدرس ارسال:</Typography>
                                      {isEditing ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                          <WhiteTextField
                                            label="شهر"
                                            value={editedOrder.shippingAddress.city}
                                            onChange={(e) => setEditedOrder({
                                              ...editedOrder,
                                              shippingAddress: {
                                                ...editedOrder.shippingAddress,
                                                city: e.target.value
                                              }
                                            })}
                                          />
                                          <WhiteTextField
                                            label="آدرس"
                                            value={editedOrder.shippingAddress.street}
                                            onChange={(e) => setEditedOrder({
                                              ...editedOrder,
                                              shippingAddress: {
                                                ...editedOrder.shippingAddress,
                                                street: e.target.value
                                              }
                                            })}
                                          />
                                        </Box>
                                      ) : (
                                        <Typography>
                                          {order.shippingAddress.city} - {order.shippingAddress.street}
                                        </Typography>
                                      )}
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography variant="subtitle2">محصولات:</Typography>
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>نام محصول</TableCell>
                                            <TableCell>تعداد</TableCell>
                                            <TableCell>قیمت</TableCell>
                                            <TableCell>تصویر</TableCell>
                                            {isEditing && <TableCell>عملیات</TableCell>}
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {order.items.map((item, index) => (
                                            <TableRow key={index}>
                                              <TableCell>
                                                {isEditing ? (
                                                  <WhiteTextField
                                                    size="small"
                                                    value={editedOrder.items[index].name}
                                                    onChange={(e) => {
                                                      const newItems = [...editedOrder.items];
                                                      newItems[index] = { ...newItems[index], name: e.target.value };
                                                      setEditedOrder({ ...editedOrder, items: newItems });
                                                    }}
                                                  />
                                                ) : (
                                                  item.name
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                {isEditing ? (
                                                  <WhiteTextField
                                                    type="number"
                                                    size="small"
                                                    value={editedOrder.items[index].quantity}
                                                    onChange={(e) => {
                                                      const newItems = [...editedOrder.items];
                                                      newItems[index] = { ...newItems[index], quantity: parseInt(e.target.value) };
                                                      setEditedOrder({ ...editedOrder, items: newItems });
                                                    }}
                                                  />
                                                ) : (
                                                  item.quantity
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                {isEditing ? (
                                                  <WhiteTextField
                                                    type="number"
                                                    size="small"
                                                    value={editedOrder.items[index].price}
                                                    onChange={(e) => {
                                                      const newItems = [...editedOrder.items];
                                                      newItems[index] = { ...newItems[index], price: parseInt(e.target.value) };
                                                      setEditedOrder({ ...editedOrder, items: newItems });
                                                    }}
                                                  />
                                                ) : (
                                                  `$${item.price}`
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                <img
                                                  src={`https://rosegoldgallery-back.onrender.com/${item.img}`}
                                                  alt={item.name}
                                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                              </TableCell>
                                              {isEditing && (
                                                <TableCell>
                                                  <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                      const newItems = editedOrder.items.filter((_, i) => i !== index);
                                                      setEditedOrder({ ...editedOrder, items: newItems });
                                                    }}
                                                  >
                                                    <DeleteOutlineIcon />
                                                  </IconButton>
                                                </TableCell>
                                              )}
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
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