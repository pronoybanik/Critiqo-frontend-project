// components/TopCategories.js
"use client";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
// import { motion, useMotionValue, useTransform } from 'framer-motion';
const categories = [
  {
    name: "Speaker",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/JBL_FLIP_6_Portable_Bluetooth_Speaker_Bl-JBL-ece68-301915.png",
  },
  {
    name: "Mouse",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/8a7d15009_136876.png",
  },
  {
    name: "Power Bank",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Joyroom_JR_QP193_30000mAh_225W_Fast_Char-JOYROOM-4edf7-361272.png",
  },
  {
    name: "Router",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/TP_Link_Archer_C5400X_AC5400_Tri_Band_Ga-TP_Link-e6ac0-271325.jpg",
  },
  {
    name: "Headphone",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Hoco_W35_Max_ANC_Wireless_Headphone-hoco-c84b8-436657.png",
  },
  {
    name: "Cable & Converter",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Geeoo_Meke_M_11_60W_Multifunction_Fast_C-Geeoo-e2f1d-350952.png",
  },
  {
    name: "Microphone",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/BOYA_BY_MC2_USB_Conference_Microphone-BOYA-c0dcb-236737.jpg",
  },
  {
    name: "WiFi Repeater",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/TP_Link_Archer_C54_AC1200_Dual_Band_Wi_F-TP_Link-3373a-271447.jpg",
  }, // Optional extra
];

const TopCategories = () => {
  const [slidesToShow, setSlidesToShow] = useState(6);

  // Update slides to show based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(2); // Mobile
      } else if (window.innerWidth < 768) {
        setSlidesToShow(3); // Small tablets
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(4); // Large tablets
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(5); // Small desktops
      } else {
        setSlidesToShow(6); // Large desktops
      }
    };
    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 9000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipeToSlide: true,
    ltr: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          speed: 8000,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          speed: 7000,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          speed: 6000,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          speed: 5000,
        },
      },
    ],
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:my-20 bg-gray-100 rounded-md shadow-md sm:shadow-lg md:shadow-2xl shadow-gray-200">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
        Top Categories
      </h2>
      <div className="relative overflow-hidden">
        <Slider {...settings}>
          {categories.map((cat, index) => (
            <div key={index} className="text-center px-1 sm:px-2 md:px-3">
              <div
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto 
                            shadow-md bg-white overflow-hidden rounded-full 
                            border p-1 sm:p-2 border-blue-500 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 4rem, (max-width: 768px) 6rem, (max-width: 1024px) 8rem, 9rem"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm truncate max-w-full">
                {cat.name}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TopCategories;
