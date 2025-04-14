'use client'

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';

// Image imports
import a from './img/1.jpg';
import b from './img/2.jpg';
import c from './img/3.jpg';
import d from './img/4.jpg';
import e from './img/5.jpg';
import f from './img/6.jpg';
import g from './img/7.jpg';
import h from './img/8.jpg';
import i from './img/9.jpg';
import j from './img/10.jpg';
import k from './img/11.jpg';
import l from './img/12.jpg';
import m from './img/13.jpg';
import n from './img/14.jpg';

export default function CarouselSwiper() {
  const slides = [
    { img: a, alt: 'a', href: '/components/necklace' },
    { img: b, alt: 'b', href: '/components/necklace' },
    { img: c, alt: 'c', href: '/components/necklace' },
    { img: d, alt: 'd', href: '/components/rings' },
    { img: e, alt: 'e', href: '/components/necklace' },
    { img: f, alt: 'f', href: '/components/necklace' },
    { img: g, alt: 'g', href: '/components/necklace' },
    { img: h, alt: 'h', href: '/components/rings' },
    { img: i, alt: 'i', href: '/components/bracelet' },
    { img: j, alt: 'j', href: '/components/rings' },
    { img: k, alt: 'k', href: '/components/earings' },
    { img: l, alt: 'l', href: '/components/necklace' },
    { img: m, alt: 'm', href: '/components/bracelet' },
    { img: n, alt: 'n', href: '/components/bracelet' },
  ];

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 40 },
        1024: { slidesPerView: 5, spaceBetween: 50 },
      }}
      modules={[Pagination]}
      className="mySwiper"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <Link href={slide.href} passHref>
            <div className="image-container">
              <Image
                src={slide.img}
                alt={slide.alt}
               
                priority
                className="image-hover"
                style={{ objectFit: 'cover', border: '1px solid black',height:'250px',width:'100%' }}
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
