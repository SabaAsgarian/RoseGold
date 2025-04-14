'use client'

import React from 'react'
import PrimarySearchAppBar from '../header'
import Footer from '../footer'
import { Box, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import Image from 'next/image'

import rin from '../img/fring.jpg'
import nec from '../img/fnec.jpg'
import brac from '../img/fbrac.jpg'
import eari from '../img/fear.jpg'
import All from '../img/all.jpeg'
import CustomizedBreadcrumbs from './../bradcrumbs'

const ImageContainer = ({ src, alt }) => (
  <div style={{ position: 'relative',minWidth:'80%', MaxWidth: '100%', height: '400px' }}>
    <Image src={src} alt={alt} fill style={{ objectFit:'cover' }} />
  </div>
)

export default function Page() {
  return (
    <>
      <PrimarySearchAppBar />

      <h1 style={{ textAlign: 'start', marginTop: '2rem' }}>All</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3%'}}>
        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
          <Image src={All} alt="All" fill style={{ objectFit: 'cover' }} priority />
        </div>
      </div>

      <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '60%', margin: '5% auto' }}>
        <CustomizedBreadcrumbs />
      </Box>

      <Grid container spacing={5} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width:{xs:'90%',sm:'60%'}, margin: '0 auto' }}>
        {/* Ring */}
        <Grid item xs={12} lg={6}>
          <Link href="./rings" passHref>
            <Box
              sx={{
                cursor: 'pointer',
                border: '1px solid black',
                position: 'relative',
                '&:hover': {
                  filter: 'brightness(0.8)',
                  '& .caption': {
                    backgroundColor: 'black',
                    color: 'white',
                    border: '1px solid white'
                  }
                }
              }}
            >
              <ImageContainer src={rin} alt="Rings" />
              <Box
                className="caption"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'transparent',
                  color: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Rings
              </Box>
            </Box>
          </Link>
        </Grid>

        {/* Necklace */}
        <Grid item xs={12} lg={6}>
          <Link href="./necklace" passHref>
            <Box
              sx={{
                cursor: 'pointer',
                border: '1px solid black',
                position: 'relative',
                '&:hover': {
                  filter: 'brightness(0.8)',
                  '& .caption': {
                    backgroundColor: 'black',
                    color: 'white',
                    border: '1px solid white'
                  }
                }
              }}
            >
              <ImageContainer src={nec} alt="Necklace" />
              <Box
                className="caption"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'transparent',
                  color: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Necklace
              </Box>
            </Box>
          </Link>
        </Grid>

        {/* Bracelet */}
        <Grid item xs={12} lg={6}>
          <Link href="./bracelet" passHref>
            <Box
              sx={{
                cursor: 'pointer',
                border: '1px solid black',
                position: 'relative',
                '&:hover': {
                  filter: 'brightness(0.8)',
                  '& .caption': {
                    backgroundColor: 'black',
                    color: 'white',
                    border: '1px solid white'
                  }
                }
              }}
            >
              <ImageContainer src={brac} alt="Bracelet" />
              <Box
                className="caption"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'transparent',
                  color: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Bracelet
              </Box>
            </Box>
          </Link>
        </Grid>

        {/* Earrings */}
        <Grid item xs={12} lg={6}>
          <Link href="./earings" passHref>
            <Box
              sx={{
                cursor: 'pointer',
                border: '1px solid black',
                position: 'relative',
                '&:hover': {
                  filter: 'brightness(0.8)',
                  '& .caption': {
                    backgroundColor: 'black',
                    color: 'white',
                    border: '1px solid white'
                  }
                }
              }}
            >
              <ImageContainer src={eari} alt="Earrings" />
              <Box
                className="caption"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '60px',
                  backgroundColor: 'transparent',
                  color: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Earrings
              </Box>
            </Box>
          </Link>
        </Grid>
      </Grid>

      <Footer />
    </>
  )
}
