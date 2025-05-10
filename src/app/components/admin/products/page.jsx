"use client"
import { useEffect, useState } from "react";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Drawerr from '../adminUI/Drawer'
import { Box, Button, CircularProgress } from "@mui/material";
import { styled } from '@mui/material/styles';
import Cardd from '../../Cardd';


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
      .then((data) => {
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // ← مرتب‌سازی از جدید به قدیم
        setProducts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Drawerr>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ textAlign: 'start', fontSize: '32px', fontWeight: 'bold' }}><InventoryIcon />Managing Products </h1>
          <StyledButton>
            <a href="/components/admin/add-product"><AddCircleOutlineIcon />Add New Product  </a>
          </StyledButton>
        </Box>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',

          margin: '5% auto',

        }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',

              }}
            >
              <p>Loading...</p>
              <CircularProgress color="inherit" />
            </Box>

          ) : products.length > 0 ? (
            products.map((item, i) => {
              return (
                <div key={i} style={{ padding: '10px' }}>
                  <Cardd
                    data={item}
                    onDelete={(deletedId) => {
                      setProducts(prev => prev.filter(p => p._id !== deletedId));
                    }}
                  />
                </div>
              );
            })
          ) : (
            <p>No products found.</p>
          )}
        </div>

      </Drawerr>
    </div>
  );
}
