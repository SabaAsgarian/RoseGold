"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { styled } from '@mui/material/styles';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from "next/link";
const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
});

const WhiteTextField = styled(TextField)({
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    '& .MuiInputBase-input': {
        color: 'black', // Text color
    },
    '& .MuiInputLabel-root': {
        color: 'white', // Label color
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'black', // Border color
        },
        '&:hover fieldset': {
            borderColor: 'black', // Hover border color
        },
        '&.Mui-focused fieldset': {
            borderColor: 'grey', // Focused border color
        },
    },
});

const StyledButton = styled(Button)({
    backgroundColor: '#a9dfd8',
    color: 'black',
    '&:hover': {
        backgroundColor: '#8fcfc8',
    },
});
export default function AdminRegister() {
    const router = useRouter();


    const formik = useFormik({
        initialValues: {
            fname: "",
            lname: "",
            email: "",
            pass: "",
            role: "admin", // Default role set to "admin"
        },
        validate: (values) => {
            const errors = {};
            if (!values.fname) errors.fname = "First Name is required";
            if (!values.lname) errors.lname = "Last Name is required";
            if (!values.email) {
                errors.email = "Email is required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = "Invalid email address";
            }
            if (!values.pass) errors.pass = "Password is required";
            return errors;
        },
        onSubmit: async (values) => {
            try {
                const res = await fetch("https://rosegoldgallery-back.onrender.com/api/admin/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });

                if (res.ok) {
                    alert("Registered successfully!");
                    router.push("/components/admin/login");
                } else {
                    alert("Registration failed!");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },
    });

    return (
        <div>
            <Container maxWidth='2xl' sx={{ backgroundColor: '#f2f4f8', minHeight: '120vh', maxHeight: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Container className='container' maxWidth="sm" sx={{ backgroundColor: '#ffffff', minHeight: '60vh', maxHeight: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.75)' }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h1>Admin Register</h1>
                        <form onSubmit={formik.handleSubmit}>
                            {/* First Name */}

                            <div>
                                <Box>
                                    <label className="font-loginform" htmlFor="fname">First Name</label>
                                </Box>
                                <WhiteTextField
                                    className="w-full bg-[#F8F9FA] font-text border-b outline-none h-[45px] placeholder:font-loginform3"
                                    id="fname"
                                    name="fname"
                                    type="text"
                                    placeholder="Enter Your First Name"
                                    autoComplete="on"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.fname}
                                    error={formik.touched.fname && Boolean(formik.errors.fname)}
                                    helperText={formik.touched.fname && formik.errors.fname}
                                />
                                {formik.touched.fname && formik.errors.fname && (
                                    <div className="w-full flex justify-start items-center">
                                        <p className="font-loginh2 text-sm text-red-500">
                                            <ErrorOutlineIcon className="text-lg text-red-500" /> {formik.errors.fname}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <Box>
                                    <label className="font-loginform" htmlFor="lname">Last Name</label>
                                </Box>
                                <WhiteTextField
                                    className="w-full bg-[#F8F9FA] font-text border-b outline-none h-[45px] placeholder:font-loginform3"
                                    id="lname"
                                    name="lname"
                                    type="text"
                                    placeholder="Enter Your Last Name"
                                    autoComplete="on"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.lname}
                                    error={formik.touched.lname && Boolean(formik.errors.lname)}
                                    helperText={formik.touched.lname && formik.errors.lname}
                                />
                                {formik.touched.lname && formik.errors.lname && (
                                    <div className="w-full flex justify-start items-center">
                                        <p className="font-loginh2 text-sm text-red-500">
                                            <ErrorOutlineIcon className="text-lg text-red-500" /> {formik.errors.lname}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <Box>
                                    <label className="font-loginform" htmlFor="email">Email</label>
                                </Box>
                                <WhiteTextField
                                    className="w-full bg-[#F8F9FA] font-text border-b outline-none h-[45px] placeholder:font-loginform3"
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
                                    <div className="w-full flex justify-start items-center">
                                        <p className="font-loginh2 text-sm text-red-500">
                                            <ErrorOutlineIcon className="text-lg text-red-500" /> {formik.errors.email}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <Box>
                                    <label className="font-loginform" htmlFor="pass">Password</label>
                                </Box>
                                <WhiteTextField
                                    className="w-full bg-[#F8F9FA] font-text border-b outline-none h-[45px] placeholder:font-loginform3"
                                    id="pass"
                                    name="pass"
                                    type="password"
                                    placeholder="Enter Your Password"
                                    autoComplete="on"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.pass}
                                    error={formik.touched.pass && Boolean(formik.errors.pass)}
                                    helperText={formik.touched.pass && formik.errors.pass}
                                />
                                {formik.touched.pass && formik.errors.pass && (
                                    <div className="w-full flex justify-start items-center">
                                        <p className="font-loginh2 text-sm text-red-500">
                                            <ErrorOutlineIcon className="text-lg text-red-500" /> {formik.errors.pass}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <Box>
                                    <label className="font-loginform" htmlFor="role">Role</label>
                                </Box>
                                <WhiteTextField
                                    className="w-full bg-[#F8F9FA] font-text border-b outline-none h-[45px] placeholder:font-loginform3"
                                    id="role"
                                    name="role"
                                    type="text"
                                    placeholder="Enter Your Role"
                                    autoComplete="on"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.role}
                                    error={formik.touched.role && Boolean(formik.errors.role)}
                                    helperText={formik.touched.role && formik.errors.role}
                                />
                            </div>

                            <Box sx={{ marginTop: '10%' }}>
                                <StyledButton type="submit">Submit</StyledButton>
                            </Box>
                            <Box sx={{ display: 'flex',marginTop:'10%',marginBottom:'10%' }}>
                                <Typography>
                                    Already Have Admin Account?
                                </Typography>
                                <Link href="/components/admin/login">
                                    <StyledButton>Login</StyledButton>
                                </Link>
                            </Box>
                        </form>
                        <Box sx={{width:'100%',marginTop:'10%',marginBottom:'10%'}}>
         <Link href="/">
              <StyledButton sx={{width:'100%'}}>Main Site</StyledButton>
            </Link>
         </Box>
                    </Box>
                </Container>
            </Container>
        </div>
    );
}
