"use client"
import React from "react";
import Slider from "react-slick";
import Image from 'next/image';
import a from '../components/img/wash.jpg'
import b from '../components/img/sand.jpg'
import c from '../components/img/san.jpeg'
import d from '../components/img/new.jpg'
import e from '../components/img/la.jpg'
import f from '../components/img/alas.jpg'
import '../globals.css'
function Responsive() {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
        <Image src={a} alt='img' className='image-hover2 '  style={{
               objectFit: 'cover',
               width: '100%',
               height: '250px'
             }}  />
        </div>
        <div>
           <Image 
             src={b} 
             alt='img' 
             className='image-hover2' 
             style={{
               objectFit: 'cover',
               width: '100%',
               height: '250px'
             }}
           />
        </div>
        <div>
          <Image src={c} alt='img' className='image-hover2 '  style={{
               objectFit: 'cover',
               width: '100%',
               height: '250px'
             }}  />
        </div>
        <div>
          <Image src={d} alt='img' className='image-hover2 '  style={{
               objectFit: 'cover',
               width: '100%',
               height: '250px'
             }}  />
        </div>
        <div>
          <Image src={e} alt='img' className='image-hover2 '  style={{
               objectFit: 'cover',
               width: '100%',
               height: '250px'
             }}  />
        </div>
        <div>
           <Image src={f} alt='img' className='image-hover2 '  style={{
               objectFit: 'cover',
               width: '100%',
               height: '250px'
             }}  />
        </div>
       
      </Slider>
    </div>
  );
}

export default Responsive;










































