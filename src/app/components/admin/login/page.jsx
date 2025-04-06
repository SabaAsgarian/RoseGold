"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { TextField, Button, Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Link from "next/link";

// Styled components
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
    color: "white",
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rosegoldgallery-back.onrender.com";

export default function AdminLogin() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      pass: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      pass: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Attempting admin login...");
        const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();
        console.log("Server Response:", data);

        if (res.ok && data.token) {
          // Store token with the correct key
          localStorage.setItem("token", data.token);
          
          // Store admin user data with role
          const adminUser = {
            ...data.admin,
            role: "admin"
          };
          localStorage.setItem("user", JSON.stringify(adminUser));
          
          console.log("Admin login successful, token and user data stored:", adminUser);
          router.push("/components/admin/orders");
        } else {
          alert(data.error || "Login failed! Check your credentials.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <Container
      maxWidth="2xl"
      sx={{
        backgroundColor: "#f2f4f8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#ffffff",
          minHeight: "60vh",
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
            <h1>Admin Login</h1>
            <label htmlFor="email">Email</label>
            <WhiteTextField
              id="email"
              name="email"
              type="email"
              placeholder="Enter Your Email"
              autoComplete="on"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">
                <ErrorOutlineIcon className="text-lg text-red-500" />{" "}
                {formik.errors.email}
              </p>
            )}

            <label htmlFor="pass">Password</label>
            <WhiteTextField
              id="pass"
              name="pass"
              type="password"
              placeholder="Enter Your Password"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.pass}
              error={formik.touched.pass && Boolean(formik.errors.pass)}
              helperText={formik.touched.pass && formik.errors.pass}
            />
            {formik.touched.pass && formik.errors.pass && (
              <p className="text-sm text-red-500">
                <ErrorOutlineIcon className="text-lg text-red-500" />{" "}
                {formik.errors.pass}
              </p>
            )}

            <StyledButton type="submit">Sign in</StyledButton>
            <Box sx={{display:'flex'}}>
            <Typography>
             Don't Have Admin Account?
            </Typography>
            <Link href="/components/admin/register">
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




// "use client";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { styled } from "@mui/material/styles";
// import { TextField, Button, Box, Container } from "@mui/material";
// import { useRouter } from "next/navigation";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// const StyledForm = styled("form")({
//   display: "flex",
//   flexDirection: "column",
//   gap: "1rem",
// });

// const WhiteTextField = styled(TextField)({
//   backgroundColor: "#ffffff",
//   borderRadius: "4px",
//   "& .MuiInputBase-input": {
//     color: "black",
//   },
//   "& .MuiInputLabel-root": {
//     color: "white",
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: "black",
//     },
//     "&:hover fieldset": {
//       borderColor: "black",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "grey",
//     },
//   },
// });

// const StyledButton = styled(Button)({
//   backgroundColor: "#a9dfd8",
//   color: "black",
//   "&:hover": {
//     backgroundColor: "#8fcfc8",
//   },
// });

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rosegoldgallery-back.onrender.com";

// export default function AdminLogin() {
//   const router = useRouter();

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       pass: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().email("Invalid email address").required("Required"),
//       pass: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(values),
//         });

//         const data = await res.json();
//         console.log("Server Response:", data);

//         if (res.ok && data.token) {
//           localStorage.setItem("adminToken", data.token);
//           localStorage.setItem("userRole", data.user.role);
//           router.push("/componets/admin/products");
//         } else {
//           alert("Login failed! Check your credentials.");
//         }
//       } catch (error) {
//         console.error("Error during login:", error);
//       }
//     },
//   });

//   return (
//     <Container maxWidth="2xl" sx={{ backgroundColor: "#f2f4f8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//       <Container maxWidth="sm" sx={{ backgroundColor: "#ffffff", minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px", boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)" }}>
//         <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
//           <StyledForm onSubmit={formik.handleSubmit}>
//             <h1>Admin Login</h1>
//             <label htmlFor="email">Email</label>
//             <WhiteTextField
//               id="email"
//               name="email"
//               type="email"
//               placeholder="Enter Your Email"
//               autoComplete="on"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//               error={formik.touched.email && Boolean(formik.errors.email)}
//               helperText={formik.touched.email && formik.errors.email}
//             />
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-sm text-red-500">
//                 <ErrorOutlineIcon className="text-lg text-red-500" /> {formik.errors.email}
//               </p>
//             )}

//             <label htmlFor="pass">Password</label>
//             <WhiteTextField
//               id="pass"
//               name="pass"
//               type="password"
//               placeholder="Enter Your Password"
//               autoComplete="off"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.pass}
//               error={formik.touched.pass && Boolean(formik.errors.pass)}
//               helperText={formik.touched.pass && formik.errors.pass}
//             />
//             {formik.touched.pass && formik.errors.pass && (
//               <p className="text-sm text-red-500">
//                 <ErrorOutlineIcon className="text-lg text-red-500" /> {formik.errors.pass}
//               </p>
//             )}

//             <StyledButton type="submit">Sign in</StyledButton>
//           </StyledForm>
//         </Box>
//       </Container>
//     </Container>
//   );
// }
