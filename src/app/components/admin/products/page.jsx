"use client"
import { useEffect, useState } from "react";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Drawerr from '../adminUI/Drawer'
import { Box, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
const StyledButton = styled(Button)({
    backgroundColor: '#a9dfd8',
    color: 'black',
    '&:hover': {
        backgroundColor: '#8fcfc8',
    },
});
export default function ManageProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("https://rosegoldgallery-back.onrender.com/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error In Fetching Products:", err));
    }, []);

    return (
        <div>
            <Drawerr>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <h1><InventoryIcon/>Managing Products </h1>
           <StyledButton>
           <a href="/components/admin/add-product"><AddCircleOutlineIcon/>Add New Product  </a>
           </StyledButton>
           </Box>
            <ul style={{backgroundColor:'red',color:'black'}}>
                {products.map((product) => (
                    <li key={product._id} style={{backgroundColor:'red',color:'black'}}>
                        <img src={`https://rosegoldgallery-back.onrender.com/${product.img}`} width="50" height="50" alt={product.title} />
                        {product.title} - {product.price}$
                        <button><EditNoteIcon/> Edit</button>
                        <button><DeleteOutlineIcon/> Delete</button>
                    </li>
                ))}
            </ul>
          
           </Drawerr>
        </div>
    );
}
