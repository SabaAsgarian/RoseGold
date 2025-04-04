"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, TextField } from "@mui/material";
import Drawerr from '../adminUI/Drawer';
import { styled } from '@mui/material/styles';
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
export default function AddProduct() {
    const router = useRouter();
    const [product, setProduct] = useState({
        title: "",
        price: "",
        weight:"",
        category: "",
        description:"",
        img: null,
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProduct({ ...product, img: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", product.title);
        formData.append("price", product.price);
        formData.append("weight", product.weight);
        formData.append("category", product.category);
        formData.append("description", product.description);
        formData.append("img", product.img);
    
        try {
            console.log("Sending Data:", Object.fromEntries(formData));
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                body: formData,
            });
    
            console.log("Response Status:", res.status);
            const responseData = await res.json();
            console.log("Response Data:", responseData);
    
            if (res.ok) {
                alert("Product added successfully!");
                router.push("/components/admin");
            } else {
                alert("Failed to add product: " + responseData.message);
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div>
            <Drawerr>
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',flexDirection:'column' }}>
             <Box sx={{width:'100%'}}>
             <h1><AddCircleOutlineIcon /> Add New Product</h1>
             </Box>
            <Box sx={{flexDirection:'column',width:"100%"}}>
            <StyledForm onSubmit={handleSubmit}>
            <label htmlFor="title">Product Title:</label>
                <WhiteTextField type="text" name="title" placeholder="Product Title" onChange={handleChange} required />
                <label htmlFor="price">Product price:</label>
                <WhiteTextField type="number" name="price" placeholder="Price" onChange={handleChange} required />
                <label htmlFor="weight">Product weight:</label>
                <WhiteTextField type="text" name="weight" placeholder="weight" onChange={handleChange} required />
                <label htmlFor="category">Product category:</label>
                <WhiteTextField type="text" name="category" placeholder="Category" onChange={handleChange} required />
                <label htmlFor="description">Product description:</label>
                <WhiteTextField type="text" name="description" placeholder="description" onChange={handleChange} required />
                <label htmlFor="img">Product Image:</label>
                <WhiteTextField type="file" name="img" accept="image/*" onChange={handleFileChange} required />
                <StyledButton type="submit">Add Product</StyledButton>
            </StyledForm>
            </Box>
             </Box>
             </Drawerr>
        </div>
    );
}
