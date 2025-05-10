"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import Image from 'next/image';
import a from '../components/img/wash.jpg';
import b from '../components/img/sand.jpg';
import c from '../components/img/san.jpeg';
import d from '../components/img/new.jpg';
import e from '../components/img/la.jpg';
import f from '../components/img/alas.jpg';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import '../globals.css';

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
      <ArrowForwardIosIcon style={{ fontSize: "15px" }} />
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
      <ArrowBackIosNewIcon style={{ fontSize: "15px" }} />
    </IconButton>
  );
}

function Responsive() {
  const [isHovering, setIsHovering] = useState(false);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    nextArrow: <SampleNextArrow isHovering={isHovering} />,
    prevArrow: <SamplePrevArrow isHovering={isHovering} />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
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
          dots: false,
          nextArrow: <SampleNextArrow isHovering={isHovering} />,
          prevArrow: <SamplePrevArrow isHovering={isHovering} />
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          nextArrow: <SampleNextArrow isHovering={isHovering} />,
          prevArrow: <SamplePrevArrow isHovering={isHovering} />
        }
      }
    ]
  };

  return (
    <div
      className="slider-hover-wrapper"
      style={{ position: "relative", width: "100%" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Slider {...settings}>
        {[a, b, c, d, e, f].map((imgSrc, index) => (
          <div key={index}>
            <Image
              src={imgSrc}
              alt={`img-${index}`}
              className="image-hover2"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "250px"
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Responsive;
