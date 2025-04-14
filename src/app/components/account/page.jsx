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
import CustomizedBreadcrumbs from "../bradcrumbs";
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
        
        if (!token || isTokenExpired(token)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push("/components/account/userlogin");
          return;
        }

        const userId = user._id || user.id;
        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...values,
            _id: userId,
            id: userId
          })
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push("/components/account/userlogin");
          return;
        }

        const updatedUser = await response.json();
        
        // Ensure we preserve the ID fields
        const userToSave = {
          ...updatedUser,
          _id: userId,
          id: userId
        };

        setUser(userToSave);
        localStorage.setItem('user', JSON.stringify(userToSave));
        setIsEditing(false);
        formik.resetForm(); // Reset form after successful update
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Update error:', error);
        if (error.message.includes('unauthorized') || error.message.includes('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push("/components/account/userlogin");
          return;
        }
        alert('Error updating profile: ' + error.message);
      }
    },
  });

  const handleEdit = () => {
    // Ensure we have the latest user data when entering edit mode
    formik.setValues({
      fname: user.fname || '',
      lname: user.lname || '',
      email: user.email || '',
      mobile: user.mobile || '',
      age: user.age || '',
      city: user.city || '',
      street: user.street || '',
      role: user.role || '',
      _id: user._id || user.id, // Include ID fields
      id: user._id || user.id
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rosegoldgallery-back.onrender.com";
   
  // Add this function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Modify useEffect to check token expiration
  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData || isTokenExpired(token)) {
        // Clear localStorage if token is expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push("/components/account/userlogin");
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        const userWithIds = {
          ...parsedUser,
          _id: parsedUser._id || parsedUser.id,
          id: parsedUser._id || parsedUser.id
        };
        setUser(userWithIds);

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Check if response indicates token expiration
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push("/components/account/userlogin");
          return;
        }

        if (response.ok) {
          const ordersData = await response.json();
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error:", error);
        // If there's an authentication error, redirect to login
        if (error.message.includes('unauthorized') || error.message.includes('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push("/components/account/userlogin");
          return;
        }
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

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width:'100%',
          height:'80vh'
        }}
      >
        <p>Loading...</p>
        <CircularProgress color="inherit" />
      </Box>
    );
  }
  
  if (!user) return <Typography>Please Sign In To Your Account.</Typography>;

  return (
    <div>
      <Header />
      <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '60%', margin: '5% auto' }}>
       <CustomizedBreadcrumbs/>
      </Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <StyledPaper>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              src={user.img}
              alt={`${user.fname} ${user.lname}`}
              sx={{
                border:'1px solid black',
                borderRadius:'50%',
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
                              ? "#ffc107" // Light yellow for "pending"
                              : order.status === "processing"
                              ? "#ff9800" // Deep orange for "processing"
                              : order.status === "completed"
                              ? "#2196f3" // Vibrant blue for "completed"
                              : order.status === "shipped"
                              ? "#4caf50" // Fresh green for "shipped"
                              : order.status === "delivered"
                              ? "#8bc34a" // Lime green for "delivered"
                              : "#f44336", // Bold red for unknown or error
                          
                              color:
                              order.status === "pending"
                                ? "black" // Black for light yellow background
                                : order.status === "processing"
                                ? "white" // White for deep orange background
                                : order.status === "completed"
                                ? "white" // White for vibrant blue background
                                : order.status === "shipped"
                                ? "white" // White for fresh green background
                                : order.status === "delivered"
                                ? "white" // White for lime green background
                                : "white", // White for the bold red background
                            
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
