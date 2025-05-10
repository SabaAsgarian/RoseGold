"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { TextField, Button, Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Link from "next/link";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useRef, useState } from "react";
import Header from '../headerAcc';
import Footer from '../footerAcc';
import CustomizedBreadcrumbs from '../bradcrumbsAcc';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

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

const StyledButton = styled(Button)({
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "#3e3e3e",
    color: "white",
  },
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rosegoldgallery-back.onrender.com";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function UserRegister() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [showpass, setShowpass] = useState(true)
  const showic = useRef()
  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      mobile: "",
      pass: "",
      city: "",
      street: "",
      age: "",
      img: ""
    },
    validationSchema: Yup.object({
      fname: Yup.string()
        .required("First name is required")
        .min(2, "First name must be at least 2 characters"),
      lname: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be at least 2 characters"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{11}$/, "Mobile number must be 11 digits")
        .required("Mobile number is required"),
      pass: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      city: Yup.string()
        .required("City is required"),
      street: Yup.string()
        .required("Street address is required"),
      age: Yup.number()
        .min(18, "Must be at least 18 years old")
        .required("Age is required"),
      img: Yup.string() // Optional field
    }),
    onSubmit: async (values) => {
      try {
        console.log("Sending registration data:", values);

        const registrationData = {
          fname: values.fname,
          lname: values.lname,
          email: values.email,
          mobile: values.mobile,
          pass: values.pass,
          city: values.city,
          street: values.street,
          age: Number(values.age),
          img: values.img
        };

        console.log("Formatted registration data:", registrationData);

        const res = await fetch(`${API_BASE_URL}/api/register`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        });

        const data = await res.json();
        console.log("Server Response:", data);

        if (res.ok) {
          alert("Registration successful! Please login.");
          router.push("/components/account/userlogin");
        } else {
          // Handle different types of errors
          if (data.details) {
            // Handle validation errors
            Object.keys(data.details).forEach(key => {
              formik.setFieldError(key, data.details[key].message);
            });
          } else if (data.error.includes("Email")) {
            formik.setFieldError("email", data.error);
          } else if (data.error.includes("Mobile")) {
            formik.setFieldError("mobile", data.error);
          } else if (data.missing) {
            // Handle missing fields
            data.missing.forEach(field => {
              formik.setFieldError(field, `${field} is required`);
            });
          } else {
            // Generic error
            alert(data.error || "Registration failed. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Server error. Please try again later.");
      }
    },
  });
  const show = () => {
    if (!showic.current) return;
    
    if (showpass) {
        showic.current.children[0].style.display = 'flex';
        showic.current.children[1].style.display = 'none';
    } else {
        showic.current.children[0].style.display = 'none';
        showic.current.children[1].style.display = 'flex';
    }
    setShowpass(!showpass);
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        formik.setFieldValue('img', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    <Header/>
    <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '60%', margin: '2% auto' }}>
       <CustomizedBreadcrumbs/>
      </Box>
    <Container maxWidth="2xl" sx={{
     
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      py: 4
    }}>
      <Container maxWidth="sm" sx={{
        backgroundColor: "#ffffff",
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.75)",
        py: 4
      }}>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <StyledForm onSubmit={formik.handleSubmit}>
          <h1 style={{ textAlign: 'start', marginTop: '2rem' ,fontSize:'32px',fontWeight:'bold'}}>Register</h1>

            {/* Image upload section */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              {selectedImage ? (
                <Box sx={{ position: 'relative', width: 'fit-content', margin: 'auto' }}>
                  <img 
                    src={selectedImage} 
                    alt="Profile preview" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} 
                  />
                  <Button
                    onClick={() => {
                      setSelectedImage(null);
                      formik.setFieldValue('img', '');
                    }}
                    sx={{ 
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      minWidth: '30px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      p: 0
                    }}
                  >
                    ×
                  </Button>
                </Box>
              ) : (
                <StyledButton
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Upload Profile Picture
                  <VisuallyHiddenInput 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </StyledButton>
              )}
            </Box>

            <label htmlFor="fname">First Name</label>
            <WhiteTextField
              id="fname"
              name="fname"
              type="text"
              placeholder="Enter Your First Name"
              {...formik.getFieldProps('fname')}
              error={formik.touched.fname && Boolean(formik.errors.fname)}
              helperText={formik.touched.fname && formik.errors.fname}
            />

            <label htmlFor="lname">Last Name</label>
            <WhiteTextField
              id="lname"
              name="lname"
              type="text"
              placeholder="Enter Your Last Name"
              {...formik.getFieldProps('lname')}
              error={formik.touched.lname && Boolean(formik.errors.lname)}
              helperText={formik.touched.lname && formik.errors.lname}
            />

            <label htmlFor="email">Email</label>
            <WhiteTextField
              id="email"
              name="email"
              type="email"
              placeholder="Enter Your Email"
              {...formik.getFieldProps('email')}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <label htmlFor="mobile">Mobile</label>
            <WhiteTextField
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="Enter Your Mobile Number"
              {...formik.getFieldProps('mobile')}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
            />

            <label htmlFor="pass">Password</label>
            <WhiteTextField
              id="pass"
              name="pass"
              type={showpass ? "password" : "text"}
              placeholder="Enter Your Password"
              {...formik.getFieldProps('pass')}
              error={formik.touched.pass && Boolean(formik.errors.pass)}
              helperText={formik.touched.pass && formik.errors.pass}
            />
             <div onClick={show} ref={showic} className='mt-[10%] mb-[10%]  w-[10%] *:absolute relative flex justify-center cursor-pointer items-center'>
                <span style={{ display: 'none' }} className='justify-center items-center w-full'><VisibilityIcon /></span>
                <span style={{ display: 'flex' }} className='justify-center items-center w-full'><VisibilityOffIcon /></span>
              </div>
            <label htmlFor="city">City</label>
            <WhiteTextField
              id="city"
              name="city"
              type="text"
              placeholder="Enter Your City"
              {...formik.getFieldProps('city')}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />

            <label htmlFor="street">Street Address</label>
            <WhiteTextField
              id="street"
              name="street"
              type="text"
              placeholder="Enter Your Street Address"
              {...formik.getFieldProps('street')}
              error={formik.touched.street && Boolean(formik.errors.street)}
              helperText={formik.touched.street && formik.errors.street}
            />

            <label htmlFor="age">Age</label>
            <WhiteTextField
              id="age"
              name="age"
              type="number"
              placeholder="Enter Your Age"
              {...formik.getFieldProps('age')}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
            />

            <StyledButton 
              type="submit"
              disabled={formik.isSubmitting}

            >
              {formik.isSubmitting ? "Registering..." : "Register"}
            </StyledButton>

            <Box sx={{width:'100%', display:'flex', justifyContent:"center", alignItems:'center', gap: 2}}>
              <Typography>
                Already Have an Account?
              </Typography>
              <Link href="/components/account/userlogin">
                <StyledButton>
                  Login
                </StyledButton>
              </Link>
            </Box>
          </StyledForm>
          <Box sx={{width:'100%',marginTop:'10%',marginBottom:'10%'}}>
         <Link href="/">
              <StyledButton sx={{width:'100%'}}>Main Site</StyledButton>
            </Link>
         </Box>
      
        </Box>
      </Container>
    </Container>
    <Footer/>
    </>
  );
}
