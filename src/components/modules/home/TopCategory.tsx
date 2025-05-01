// components/TopCategories.js
'use client';
import Slider from 'react-slick';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { motion, useMotionValue, useTransform } from 'framer-motion';
const categories = [
  { name: 'Speaker', img: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/JBL_FLIP_6_Portable_Bluetooth_Speaker_Bl-JBL-ece68-301915.png' },
  { name: 'Mouse', img: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/8a7d15009_136876.png' },
  { name: 'Power Bank', img: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Joyroom_JR_QP193_30000mAh_225W_Fast_Char-JOYROOM-4edf7-361272.png' },
  { name: 'Router', img: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/TP_Link_Archer_C5400X_AC5400_Tri_Band_Ga-TP_Link-e6ac0-271325.jpg' },
  { name: 'Headphone', img: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Hoco_W35_Max_ANC_Wireless_Headphone-hoco-c84b8-436657.png' },
  { name: 'Cable & Converter', img: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Geeoo_Meke_M_11_60W_Multifunction_Fast_C-Geeoo-e2f1d-350952.png' },
  { name: 'Microphone', img: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/BOYA_BY_MC2_USB_Conference_Microphone-BOYA-c0dcb-236737.jpg' },
  { name: 'WiFi Repeater', img: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/TP_Link_Archer_C54_AC1200_Dual_Band_Wi_F-TP_Link-3373a-271447.jpg' }, // Optional extra
];

const TopCategories = () => {
  // const borderColor = useMotionValue(0);
  // const animatedBorderColor = useTransform(
  //   borderColor,
  //   [0, 1, 2, 3, 4, 5],
  //   [
  //     "rgba(30, 215, 96, 0.8)",   // Emerald
  //     "rgba(56, 189, 248, 0.8)",  // Sky
  //     "rgba(167, 139, 250, 0.8)", // Violet
  //     "rgba(244, 114, 182, 0.8)", // Rose
  //     "rgba(251, 146, 60, 0.8)",  // Orange
  //     "rgba(252, 211, 77, 0.8)",  // Yellow
  //   ]
  // );
  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    slidesToShow: 6,
    slidesToScroll: 1,
    rtl: true,
    arrows: false,
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-2xl shadow-gray-200">
      <h2 className="text-3xl font-bold mb-4">Top Categories</h2>
      <Slider {...settings}>
        {categories.map((cat, index) => (
          <div key={index} className="text-center px-3">
            <div className="w-36 h-36 mx-auto shadow-md bg-white overflow-hidden rounded-full border p-2 border-blue-500"
            // style={{
            //   borderColor: animatedBorderColor,
            // }}
            >
              <Image src={cat.img} alt={cat.name} width={110} height={110} className=' object-cove' />
            </div>
            <p className="mt-2 text-sm">{cat.name}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TopCategories;
