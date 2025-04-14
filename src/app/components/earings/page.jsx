"use client"
import React, { useEffect, useState } from 'react';
import PrimarySearchAppBar from '../header';
import MultiActionAreaCard from '../card';
import Image from 'next/image';
import earings from '../img/earing.jpg'
import useStore from './../../store';
import Footer from './../footer'
import { Box, CircularProgress } from '@mui/material';
import CustomizedBreadcrumbs from './../bradcrumbs'

// ✅ اینجا اضافه کن:
const fetchWithRetry = async (url, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Retrying (${i + 1}/${retries})...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('Failed to fetch after retries');
};

async function getData() {
  return await fetchWithRetry('https://rosegoldgallery-back.onrender.com/api/category/earings');
}

const EarringsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addProduct } = useStore();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
    }
  }, []);



  return (
    <div>
      <PrimarySearchAppBar />
      <h1>Earings</h1>
     
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3%'}}>
        <div style={{ position: 'relative', width: '100%', height: '250px' }}>
          <Image src={earings} alt="earings" fill style={{ objectFit: 'cover' }} priority />
        </div>
      </div>
      <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '60%', margin: '5% auto' }}>
        <CustomizedBreadcrumbs />
      </Box>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: windowWidth < 600 ? '75%' : windowWidth < 1024 ? '90%' : '75%',
        margin: '5% auto'
      }}>
        {loading ? (
          <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
          <p>Loading products...</p>
          <CircularProgress color="inherit" />
        </Box>
        ) : error ? (
          <p>Error: {error}</p>
        ) : data.length > 0 ? (
          data.map(item => (
            <div key={item.id} style={{
              flex: windowWidth < 600 ? '1 0 100%' : windowWidth < 1024 ? '1 0 50%' : '1 0 33.33%',
              marginBottom: '5%',
            }}>
              <MultiActionAreaCard data={item} />
            </div>
          ))
        ) : (
          <p>No data available</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EarringsPage;