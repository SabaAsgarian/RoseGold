"use client"
import React, { useEffect, useState } from 'react'; 
import PrimarySearchAppBar from '../header'; 
import MultiActionAreaCard from '../card'; 
import brace from '../img/brace.jpg';
import Image from 'next/image';
import  useStore  from './../../store' ;
import Footer from './../footer'
import CustomizedBreadcrumbs from './../bradcrumbs'
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
async function getData() {

  const res = await fetch('https://rosegoldgallery-back.onrender.com/api/category/bracelet');

  if (!res.ok) {
      throw new Error('Failed to fetch data: ' + res.statusText);
  }
  return res.json();
}


const BraceletPage = () =>  { 
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  // Initialize to 0 or a default value
  const {addProduct} = useStore()
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

    // Update window width on client
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial width

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup listener
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth); // Set window width only on the client
    }
  }, []);


  return (
    <div>
      <PrimarySearchAppBar />
      <h1 style={{ textAlign: 'start', marginTop: '2rem' ,fontSize:'32px',fontWeight:'bold'}}>Bracelet</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3%'}}>
        <div style={{ position: 'relative', width: '100%', height: '230px' }}>
          <Image src={brace} alt="bracelet" fill style={{ objectFit: 'cover' }} priority />
        </div>
      </div>
      <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '60%', margin: '5% auto' }}>
       <CustomizedBreadcrumbs/>
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
      <Footer/>
    </div>
  );
};
export default BraceletPage;
