"use client"
import React from "react";
import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import a from './img/1.jpg'
import b from './img/2.jpg'
import c from './img/3.jpg'
import d from './img/4.jpg'
import e from './img/5.jpg'
import f from './img/6.jpg'
import g from './img/7.jpg'
import h from './img/8.jpg'
import i from './img/9.jpg'
import j from './img/10.jpg'
import k from './img/11.jpg'
import l from './img/12.jpg'
import m from './img/13.jpg'
import n from './img/14.jpg'
import Link from 'next/link';
import Image from "next/image";
import '../globals.css';
function Responsive() {
  var settings = {
    
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    
    centerPadding: '60px',
    
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '40px',
        }
      }
    ]
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="bg-[#faf7f1] mix-blend-multiply   " >
        <Link href="./components/necklace" passHref>
             <Image 
               src={a} 
               alt="a" 
               layout="responsive" 
               priority 
           className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             
             />
          </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/rings" passHref>
             <Image 
               src={d} 
               alt="d" 
               layout="responsive" 
               priority 
             // {{ edit_4 }} Added hover class
       className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/necklace" passHref>
             <Image 
               src={b} 
               alt="b" 
               layout="responsive" 
               priority 
      
            className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/bracelet" passHref>
             <Image 
               src={i} 
               alt="i" 
               layout="responsive" 
               priority 
              // {{ edit_9 }} Added hover class
          className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/necklace" passHref>
             <Image 
               src={c} 
               alt="c" 
               layout="responsive" 
               priority 
        
            className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}} 
             />
           </Link>
        </div>
      
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/necklace" passHref>
             <Image 
               src={e} 
               alt="e" 
               layout="responsive" 
               priority 
            // {{ edit_5 }} Added hover class
         className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/necklace" passHref>
             <Image 
               src={f} 
               alt="f" 
               layout="responsive" 
               priority 
             className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}} 
        
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/necklace" passHref>
             <Image 
               src={g} 
               alt="g" 
               layout="responsive" 
               priority 
               // {{ edit_7 }} Added hover class
         className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/rings" passHref>
            <Image 
              src={h} 
              alt="h" 
              layout="responsive" 
              priority 
             // {{ edit_8 }} Added hover class
      className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
            />
          </Link>
        </div>
      
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/rings" passHref>
             <Image 
               src={j} 
               alt="j" 
               layout="responsive" 
               priority 
               // {{ edit_10 }} Added hover class
             className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/earings" passHref>
             <Image 
               src={k} 
               alt="k" 
               layout="responsive" 
               priority 
                // {{ edit_11 }} Added hover class
           className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/necklace" passHref>
             <Image 
               src={l} 
               alt="l" 
               layout="responsive" 
               priority 
                // {{ edit_12 }} Added hover class
           className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/bracelet" passHref>
             <Image 
               src={m} 
               alt="m" 
               layout="responsive" 
               priority 
               // {{ edit_13 }} Added hover class
            className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        <div className="bg-[#faf7f1] mix-blend-multiply  ">
        <Link href="./components/bracelet" passHref>
             <Image 
               src={n} 
               alt="n" 
          
               priority 
                className='image-hover'
              style={{height:'80%',backgroundColor:'#faf7f1',mixBlendMode:'multiply'}}
             />
           </Link>
        </div>
        
      </Slider>
    </div>
  );
}

export default Responsive;

























