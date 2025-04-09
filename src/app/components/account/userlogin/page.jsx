"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { TextField, Button, Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Link from "next/link";
import { useUser } from "../../../context/mycontext"; // اضافه کردن کانتکست

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rosegoldgallery-back.onrender.com";

// استایل‌ها...
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
  backgroundColor: "#a9dfd8",
  color: "black",
  "&:hover": {
    backgroundColor: "#8fcfc8",
  },
});

export default function UserLogin() {
  const router = useRouter();
  const { loginUser } = useUser(); // دریافت تابع `loginUser` از context

  const formik = useFormik({
    initialValues: {
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
        console.log("Full server response:", data); // برای دیباگ

        if (response.ok) {
          // ذخیره کامل اطلاعات کاربر
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Saved complete user data:", data.user); // برای دیباگ
          router.push("/components/account");
        } else {
          formik.setErrors({ submit: data.error });
        }
      } catch (error) {
        console.error("Login error:", error);
        formik.setErrors({ submit: "خطا در ورود به سیستم" });
      }
    },
  });

  return (
    <Container
      maxWidth="2xl"
      sx={{
        backgroundColor: "#f2f4f8",
        minHeight: "100vh",
        maxHeight:'auto',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#ffffff",
          minHeight: "70vh",
          maxHeight:'auto',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)",
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
          <h1>Login</h1>
          
          <label htmlFor="email">Email</label>
          <WhiteTextField
            id="email"
            name="email"
            type="email"
            label="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <label htmlFor="pass">Password</label>
          <WhiteTextField
            id="pass"
            name="pass"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pass}
            error={formik.touched.pass && Boolean(formik.errors.pass)}
            helperText={formik.touched.pass && formik.errors.pass}
          />

          {(formik.touched.email && formik.errors.email) || 
           (formik.touched.pass && formik.errors.pass) ? (
            <p className="text-sm text-red-500">
              <ErrorOutlineIcon className="text-lg text-red-500" />
              {formik.errors.email || formik.errors.pass}
            </p>
          ) : null}

          <StyledButton type="submit">
            Sign in
          </StyledButton>

          <Box>
            <Typography>
              Don't Have Account?
            </Typography>
            <Link href="/components/account/userregister">
              <StyledButton>Register</StyledButton>
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
  );
}
