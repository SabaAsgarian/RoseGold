"use client";
import React, { useEffect, useState } from "react";
import PrimarySearchAppBar from "../header";
import useStore from "./../../store";
import { useRouter } from "next/navigation";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import Image from "next/image";
import load from "../img/load.gif";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { Box, CircularProgress } from "@mui/material";
import CustomizedBreadcrumbs from "./../bradcrumbs";
import NestedModal from "./../modal"; // مدال ورود

const PayButton = styled(Button)({
  backgroundColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: "darkgray",
  },
});

export default function CartPage() {
  const [windowWidth, setWindowWidth] = useState(0);
  const { products, plusFromCart, minusFromCart, num, totalPrice, placeOrder } =
    useStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false); // مدیریت لودینگ سفارش
  const [orderSuccess, setOrderSuccess] = useState(false); // پیام موفقیت
  const [showLoginModal, setShowLoginModal] = useState(false); // مدیریت نمایش مدال ورود
  const router = useRouter(); // در بالای کامپوننت تعریف کنید


  useEffect(() => {
    
    setIsClient(true);
    totalPrice();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isClient) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width:'100%', 
          height:'80vh'
        }}
      >
        <Box sx={{fontSize:'50px',display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',}}>
        <p>Loading...</p>
        <CircularProgress color="inherit" />
        </Box>
      </Box>
    );
  }
  

  const handlePlaceOrder = () => {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      // اگر کاربر لاگین نکرده باشه
      const currentPath = '/components/basket';
      localStorage.setItem('redirectAfterLogin', currentPath);
      router.push('/components/account/userlogin');
      return;
    }

    // ذخیره اطلاعات سبد خرید در localStorage
    const cartData = {
      items: products.map(item => ({
        id: item._id,
        name: item.title,
        price: item.price,
        quantity: item.count,
        img: item.img
      })),
      totalAmount: num
    };
    
    localStorage.setItem('cart', JSON.stringify(cartData));
    router.push('/components/checkorder');
  };

  return (
    <>
      <PrimarySearchAppBar />
      <h1 style={{ textAlign: 'start', marginTop: '2rem' ,fontSize:'32px',fontWeight:'bold'}}>Cart</h1>
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "60%",
          margin: "1.5% auto",
        }}
      >
        <CustomizedBreadcrumbs />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={8}>
                Product Details
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Add</TableCell>
              <TableCell>Remove</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((val) => (
              <TableRow key={val.id}>
                <TableCell>
                  <img
                    src={`https://rosegoldgallery-back.onrender.com/${val.img}`}
                    alt={val.title}
                    style={{
                      width: "50px",
                      height: "50px",
                      border: "1px solid black",
                      borderRadius: "50%",
                      backgroundColor: "#d2c9a9",
                    }}
                  />
                </TableCell>
                <TableCell>{val.title}</TableCell>
                <TableCell align="left">{val.price}$</TableCell>
                <TableCell align="left">{val.count}</TableCell>
                <TableCell align="left">
                  <button
                    onClick={() => {
                      plusFromCart(val.id);
                      totalPrice();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      border: "0px",
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </button>
                </TableCell>
                <TableCell align="left">
                  <button
                    onClick={() => {
                      minusFromCart(val.id);
                      totalPrice();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      border: "0px",
                    }}
                  >
                    <RemoveCircleOutlineIcon />
                  </button>
                </TableCell>
                <TableCell align="left">{val.price * val.count}$</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <h3 style={{ textAlign: 'start', marginTop: '5%',marginBottom:'5%' ,fontSize:'20px',fontWeight:'bold'}}>- Total Price Of Your Shopping Is: {num}$</h3>

        {orderSuccess ? (
          <h3 style={{ color: "green", textAlign: "center" }}>
            ✅ Order placed successfully!
          </h3>
        ) : (
          <Stack spacing={2} direction="row">
            <PayButton
              onClick={handlePlaceOrder}
              disabled={loading}
              sx={{ height: "50px", width: "300px", marginBottom: "20%" }}
            >
              {loading ? "Processing..." : "Place Order"}
              <PaymentIcon sx={{ marginLeft: "10px" }} />
            </PayButton>
            <Link href="./shop">
              <Button
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  border: "2px solid black",
                  height: "50px",
                  width: "300px",
                  marginBottom: "20%",
                }}
              >
                Continue To Shop
              </Button>
            </Link>
          </Stack>
        )}
      </TableContainer>

      {/* مدال ورود در صورت نیاز */}
      {showLoginModal && <NestedModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
