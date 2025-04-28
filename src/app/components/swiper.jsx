"use client"
import React, { useState } from "react";
import Slider from "react-slick";
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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';

function SampleNextArrow({ onClick, isHovering }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "50%",
        width: 50,
        height: 50,
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        opacity: isHovering ? 1 : 0,
        transition: "opacity 0.3s ease",
        boxShadow: "2px 5px 6px rgba(0,0,0,0.2)",
        "&:hover": {
          backgroundColor: "#f0f0f0"
        }
      }}
    >
      <ArrowForwardIosIcon style={{fontSize: "15px"}} />
    </IconButton>
  );
}

function SamplePrevArrow({ onClick, isHovering }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "50%",
        width: 50,
        height: 50,
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 10,
        opacity: isHovering ? 1 : 0,
        transition: "opacity 0.3s ease",
        boxShadow: "2px 5px 6px rgba(0,0,0,0.2)",
        "&:hover": {
          backgroundColor: "#f0f0f0"
        }
      }}
    >
      <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
    </IconButton>
  );
}

function Responsive() {
  const [isHovering, setIsHovering] = useState(false);

  // Add event listeners to handle hover state
  React.useEffect(() => {
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => setIsHovering(true));
      sliderContainer.addEventListener('mouseleave', () => setIsHovering(false));
      
      return () => {
        sliderContainer.removeEventListener('mouseenter', () => setIsHovering(true));
        sliderContainer.removeEventListener('mouseleave', () => setIsHovering(false));
      };
    }
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    centerPadding: '60px',
    nextArrow: <SampleNextArrow isHovering={isHovering} />,
    prevArrow: <SamplePrevArrow isHovering={isHovering} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          centerPadding: '40px',
          nextArrow: <SampleNextArrow isHovering={isHovering} />,
          prevArrow: <SamplePrevArrow isHovering={isHovering} />
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          centerPadding: '40px',
          nextArrow: <SampleNextArrow isHovering={isHovering} />,
          prevArrow: <SamplePrevArrow isHovering={isHovering} />
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '40px',
          nextArrow: <SampleNextArrow isHovering={isHovering} />,
          prevArrow: <SamplePrevArrow isHovering={isHovering} />
        }
      }
    ]
  };

  // Define the slides with their specific links
  const slides = [
    { img: a, link: "./components/necklace" },
    { img: b, link: "./components/necklace" },
    { img: c, link: "./components/necklace" },
    { img: d, link: "./components/rings" },
    { img: e, link: "./components/necklace" },
    { img: f, link: "./components/necklace" },
    { img: g, link: "./components/necklace" },
    { img: h, link: "./components/rings" },
    { img: i, link: "./components/bracelet" },
    { img: j, link: "./components/rings" },
    { img: k, link: "./components/earings" },
    { img: l, link: "./components/necklace" },
    { img: m, link: "./components/bracelet" },
    { img: n, link: "./components/bracelet" }
  ];

  return (
    <div
      className="slider-container"
      style={{ position: "relative" }}
    >
      <div 
        style={{ 
          position: "relative",
          width: "100%",
          height: "100%"
        }}
      >
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className="bg-[#faf7f1] mix-blend-multiply"
            >
              <Link href={slide.link} passHref>
                <Image
                  src={slide.img}
                  alt={`slide-${index}`}
                  layout="responsive"
                  priority
                  className="image-hover"
                  style={{ height: '80%', backgroundColor: '#faf7f1', mixBlendMode: 'multiply' }}
                />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Responsive;

