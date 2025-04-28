"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { TextField, Button, Box, Container, Typography, CircularProgress, Backdrop } from "@mui/material";
import { useRouter } from "next/navigation";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Link from "next/link";
import { useUser } from "../../../context/mycontext";
import Header from '../headerAcc';
import Footer from '../footerAcc';
import CustomizedBreadcrumbs from '../bradcrumbsAcc'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRef, useState } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rosegoldgallery-back.onrender.com";

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
  },
});

export default function UserLogin({ }) {
  const [showpass, setShowpass] = useState(true)
  const showic = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const { loginUser } = useUser();

  const formik = useFormik({
    initialValues: {
      id: '',
      email: "",
      pass: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      pass: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        console.log("Sending login request:", values);

        const response = await fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            pass: values.pass,
          }),
        });

        const data = await response.json();
        console.log("Server response data:", data);
        console.log("User data:", data.user);

        if (response.ok) {
          const userId = data.user._id || data.user.id;
          console.log("Found user ID:", userId);

          if (!userId) {
            const token = data.token;
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log("Token payload:", tokenPayload);

            const userData = {
              ...data.user,
              _id: tokenPayload.id,
              id: tokenPayload.id
            };

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(userData));
            console.log("Saved user data with ID from token:", userData);
            router.push("/components/account");
          } else {
            const userData = {
              ...data.user,
              _id: userId,
              id: userId
            };

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(userData));
            console.log("Saved user data with ID from response:", userData);
            router.push("/components/account");
          }
        } else {
          formik.setErrors({ submit: data.error });
        }
      } catch (error) {
        console.error("Login error:", error);
        formik.setErrors({ submit: "Login error: " + error.message });
      } finally {
        setIsLoading(false);
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
  return (
    <>
      <Header />
      <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '60%', margin: '3% auto' }}>
        <CustomizedBreadcrumbs />
      </Box>
      <Container
        maxWidth="2xl"
        sx={{
          minHeight: "100dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Backdrop
          sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1,display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center', }}
          open={isLoading}
        >
           <p>Loading...</p>
          <CircularProgress color="black" />
        </Backdrop>
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "#ffffff",
            minHeight: "70dvh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StyledForm onSubmit={formik.handleSubmit}>
              <h1 style={{ textAlign: 'start', marginTop: '2rem', fontSize: '32px', fontWeight: 'bold' }}>Login</h1>

              <label htmlFor="email">Email:</label>
              <WhiteTextField
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <label htmlFor="pass">Password:</label>
              <div className='w-[100%] flex flex-wrap justify-between items-center'>
              <WhiteTextField
                id="pass"
                name="pass"
                placeholder="Password"
                type={showpass ? "password" : "text"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pass}
                error={formik.touched.pass && Boolean(formik.errors.pass)}
                helperText={formik.touched.pass && formik.errors.pass}
              />
              <div onClick={show} ref={showic} className='mt-[10%] mb-[10%] w-[10%] *:absolute relative flex justify-center cursor-pointer items-center'>
                <span style={{ display: 'none' }} className='justify-center items-center w-full'><VisibilityIcon /></span>
                <span style={{ display: 'flex' }} className='justify-center items-center w-full'><VisibilityOffIcon /></span>
              </div>
              {(formik.touched.email && formik.errors.email) ||
                (formik.touched.pass && formik.errors.pass) ? (
                <p className="text-sm text-red-500">
                  <ErrorOutlineIcon className="text-lg text-red-500" />
                  {formik.errors.email || formik.errors.pass}
                </p>
              ) : null}

              </div>
              <StyledButton type="submit">Sign in</StyledButton>

              <Box>
                <Typography>Don't Have Account?</Typography>
                <Link href="/components/account/userregister">
                  <StyledButton>Register</StyledButton>
                </Link>
              </Box>
            </StyledForm>

            <Box sx={{ width: "100%", marginTop: "10%", marginBottom: "10%" }}>
              <Link href="/">
                <StyledButton sx={{ width: "100%" }}>Main Site</StyledButton>
              </Link>
            </Box>
          </Box>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
