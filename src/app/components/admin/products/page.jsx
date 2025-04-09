"use client"
import { useEffect, useState } from "react";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Drawerr from '../adminUI/Drawer'
import { Box, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import MultiActionAreaCard from '../../card';
const StyledButton = styled(Button)({
    backgroundColor: '#a9dfd8',
    color: 'black',
    '&:hover': {
        backgroundColor: '#8fcfc8',
    },
});
export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); 
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
           <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
  
        margin: '5% auto'
      }}>
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : data.length > 0 ? (
          data.map(item => (
            <div key={item.id} style={{
             
              marginBottom: '5%',
            }}>
              <MultiActionAreaCard data={item} />
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>
          
           </Drawerr>
        </div>
    );
}
