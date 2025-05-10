"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import { TextField, Button, Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useState } from "react";
import Drawerr from '../adminUI/Drawer';

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
    backgroundColor: '#a9dfd8',
    color: 'black',
    '&:hover': {
        backgroundColor: '#8fcfc8',
    },
});

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

export default function AddProduct() {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: "",
            price: "",
            weight: "",
            category: "",
            description: "",
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .required("Title is required")
                .min(2, "Title must be at least 2 characters"),
            price: Yup.number()
                .required("Price is required")
                .min(0, "Price must be positive"),
            weight: Yup.number()
                .required("Weight is required")
                .min(0, "Weight must be positive"),
            category: Yup.string()
                .required("Category is required"),
            description: Yup.string()
                .required("Description is required"),
        }),
        onSubmit: async (values) => {
            try {
                if (!selectedFile) {
                    alert("Please select an image");
                    return;
                }

                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("price", values.price);
                formData.append("weight", values.weight);
                formData.append("category", values.category);
                formData.append("description", values.description);
                formData.append("img", selectedFile);

                console.log("Sending product data:", {
                    title: values.title,
                    price: values.price,
                    weight: values.weight,
                    category: values.category,
                    description: values.description,
                    hasImage: !!selectedFile
                });

                const res = await fetch("https://rosegoldgallery-back.onrender.com/api/products", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                console.log("Server Response:", data);

                if (res.ok) {
                    alert("Product added successfully!");
                    router.push("/components/admin/products");
                } else {
                    if (data.details) {
                        Object.keys(data.details).forEach(key => {
                            formik.setFieldError(key, data.details[key].message);
                        });
                    } else {
                        alert(data.message || "Failed to add product. Please try again.");
                    }
                }
            } catch (error) {
                console.error("Error adding product:", error);
                alert("Server error. Please try again later.");
            }
        },
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <Drawerr>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Box sx={{ width: '100%' }}>
                        <h1><AddCircleOutlineIcon /> Add New Product</h1>
                    </Box>
                    <Box sx={{ flexDirection: 'column', width: "100%" }}>
                        <StyledForm onSubmit={formik.handleSubmit}>
                            <label htmlFor="title">Product Title:</label>
                            <WhiteTextField
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Product Title"
                                {...formik.getFieldProps('title')}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />

                            <label htmlFor="price">Product Price:</label>
                            <WhiteTextField
                                id="price"
                                name="price"
                                type="number"
                                placeholder="Price"
                                {...formik.getFieldProps('price')}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                            />

                            <label htmlFor="weight">Product Weight:</label>
                            <WhiteTextField
                                id="weight"
                                name="weight"
                                type="number"
                                placeholder="Weight"
                                {...formik.getFieldProps('weight')}
                                error={formik.touched.weight && Boolean(formik.errors.weight)}
                                helperText={formik.touched.weight && formik.errors.weight}
                            />

                            <label htmlFor="category">Product Category:</label>
                            <WhiteTextField
                                id="category"
                                name="category"
                                type="text"
                                placeholder="Category"
                                {...formik.getFieldProps('category')}
                                error={formik.touched.category && Boolean(formik.errors.category)}
                                helperText={formik.touched.category && formik.errors.category}
                            />

                            <label htmlFor="description">Product Description:</label>
                            <WhiteTextField
                                id="description"
                                name="description"
                                type="text"
                                placeholder="Description"
                                {...formik.getFieldProps('description')}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />

                            <label htmlFor="img">Product Image:</label>
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                {selectedImage ? (
                                    <Box sx={{ position: 'relative', width: 'fit-content', margin: 'auto' }}>
                                        <img 
                                            src={selectedImage} 
                                            alt="Product preview" 
                                            style={{ 
                                                width: '100px', 
                                                height: '100px', 
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
                                        Upload Product Image
                                        <VisuallyHiddenInput 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </StyledButton>
                                )}
                            </Box>

                            <StyledButton 
                                type="submit"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Adding..." : "Add Product"}
                            </StyledButton>
                        </StyledForm>
                    </Box>
                </Box>
            </Drawerr>
        </div>
    );
}
