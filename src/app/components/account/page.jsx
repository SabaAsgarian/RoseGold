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
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Header from "../header";
import Footer from "../footer";
import { useFormik } from "formik";
import * as Yup from "yup";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const WhiteTextField = styled(TextField)({
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  '& .MuiInputBase-input': {
    color: 'black',
  },
  '& .MuiInputLabel-root': {
    color: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black',
    },
    '&:hover fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'grey',
    },
  },
});

// Add the validation schema
const validationSchema = Yup.object({
  fname: Yup.string()
    .required('First name is required'),
  lname: Yup.string()
    .required('Last name is required'),
  email: Yup.string()
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Email must be in format: email@domain.com'
    )
    .required('Email is required'),
  mobile: Yup.string()
    .matches(/^[0-9]{11}$/, 'Mobile number must be 11 digits')
    .required('Mobile number is required'),
  age: Yup.number()
    .positive('Age must be a positive number')
    .integer('Age must be a whole number')
    .required('Age is required'),
  city: Yup.string()
    .required('City is required'),
  street: Yup.string()
    .required('Street address is required'),
});

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      email: '',
      mobile: '',
      age: '',
      city: '',
      street: '',
      role: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/user/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setIsEditing(false);
          alert('Profile updated successfully!');
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (error) {
        alert('Error updating profile: ' + error.message);
      }
    },
  });

  const handleEdit = () => {
    formik.setValues({
      fname: user.fname || '',
      lname: user.lname || '',
      email: user.email || '',
      mobile: user.mobile || '',
      age: user.age || '',
      city: user.city || '',
      street: user.street || '',
      role: user.role || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

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

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const InfoRow = ({ label, value }) => (
    <Box sx={{
      display: 'flex',
      borderBottom: '1px solid #dee2e6',
      py: 2
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

  if (loading) return <CircularProgress />;
  if (!user) return <Typography>Please Sign In To Your Account.</Typography>;

  return (
    <div>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <StyledPaper>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              src={user.img}
              alt={`${user.fname} ${user.lname}`}
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 2,
                bgcolor: user.img ? 'transparent' : '#1976d2'
              }}
            >
              {!user.img && user.fname?.[0]?.toUpperCase()}
            </Avatar>
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
            {isEditing ? (
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="fname"
                  value={formik.values.fname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fname && Boolean(formik.errors.fname)}
                  helperText={formik.touched.fname && formik.errors.fname}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lname"
                  value={formik.values.lname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lname && Boolean(formik.errors.lname)}
                  helperText={formik.touched.lname && formik.errors.lname}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  helperText={formik.touched.mobile && formik.errors.mobile}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Street"
                  name="street"
                  value={formik.values.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.street && Boolean(formik.errors.street)}
                  helperText={formik.touched.street && formik.errors.street}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            ) : (
              <>
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Mobile" value={user.mobile} />
                <InfoRow label="Age" value={user.age} />
                <InfoRow label="City" value={user.city} />
                <InfoRow label="Address" value={user.street} />
                <InfoRow label="User Type" value={user.role} />
              </>
            )}
          </Box>

          {!isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
              >
                Log out
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEdit}
              >
                Edit Information
              </Button>
            </Box>
          )}
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
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </TableCell>
                      <TableCell>
                        {order.totalAmount.toLocaleString()} $
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor:
                              order.status === "pending"
                                ? "#fff3cd"
                                : order.status === "processing"
                                ? "#cfe2ff"
                                : order.status === "completed"
                                ? "#d1e7dd"
                                : "#f8d7da",
                            color:
                              order.status === "pending"
                                ? "#856404"
                                : order.status === "processing"
                                ? "#084298"
                                : order.status === "completed"
                                ? "#0f5132"
                                : "#842029",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {order.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <Typography color="text.secondary">
                You Have No Orders...
              </Typography>
            </Box>
          )}
        </StyledPaper>
      </Container>
      <Footer />
    </div>
  );
}
