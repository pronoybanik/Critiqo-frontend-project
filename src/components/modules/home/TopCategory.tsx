"use client";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

const categories = [
  {
    name: "Speaker",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/JBL_FLIP_6_Portable_Bluetooth_Speaker_Bl-JBL-ece68-301915.png",
    gradient: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    reviews: "2.3k",
  },
  {
    name: "Mouse",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/8a7d15009_136876.png",
    gradient: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    reviews: "1.8k",
  },
  {
    name: "Power Bank",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Joyroom_JR_QP193_30000mAh_225W_Fast_Char-JOYROOM-4edf7-361272.png",
    gradient: "from-green-400 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    reviews: "3.1k",
  },
  {
    name: "Router",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/TP_Link_Archer_C5400X_AC5400_Tri_Band_Ga-TP_Link-e6ac0-271325.jpg",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    reviews: "1.5k",
  },
  {
    name: "Headphone",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Hoco_W35_Max_ANC_Wireless_Headphone-hoco-c84b8-436657.png",
    gradient: "from-pink-400 to-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    reviews: "4.2k",
  },
  {
    name: "Cable & Converter",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Geeoo_Meke_M_11_60W_Multifunction_Fast_C-Geeoo-e2f1d-350952.png",
    gradient: "from-indigo-400 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    reviews: "987",
  },
  {
    name: "Microphone",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/BOYA_BY_MC2_USB_Conference_Microphone-BOYA-c0dcb-236737.jpg",
    gradient: "from-red-400 to-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    reviews: "756",
  },
  {
    name: "WiFi Repeater",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/TP_Link_Archer_C54_AC1200_Dual_Band_Wi_F-TP_Link-3373a-271447.jpg",
    gradient: "from-teal-400 to-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    reviews: "1.2k",
  },
];

const TopCategories = () => {
  const [slidesToShow, setSlidesToShow] = useState(6);

  // Update slides to show based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(3);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(4);
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(5);
      } else {
        setSlidesToShow(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 8000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipeToSlide: true,
    arrows: true,

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          speed: 7000,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          speed: 6000,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          speed: 5000,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          speed: 4000,
        },
      },
    ],
  };

  return (
    <div className="relative py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm mb-4">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            Most Popular Categories
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Top Categories
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most reviewed and trusted product categories based on
            real customer experiences
          </p>
        </div>

        {/* Categories Slider */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <Slider {...settings}>
            {categories.map((cat, index) => (
              <div key={index} className="px-3">
                <div className="group cursor-pointer">
                  {/* Category Card */}
                  <div
                    className={`relative ${cat.bgColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2`}
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                    ></div>

                    {/* Image container */}
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto mb-4 bg-white rounded-full shadow-md border-2 ${cat.borderColor} overflow-hidden p-2 group-hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={cat.img}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 5rem, (max-width: 768px) 6rem, (max-width: 1024px) 7rem, 8rem"
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Floating badge */}
                      <div
                        className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${cat.gradient} rounded-full flex items-center justify-center shadow-md`}
                      >
                        <span className="text-white text-xs font-bold">★</span>
                      </div>
                    </div>

                    {/* Category info */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 group-hover:text-blue-700 transition-colors duration-300">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {cat.reviews} reviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Custom CSS for slider arrows positioning */}
      <style jsx>{`
        .slick-prev,
        .slick-next {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default TopCategories;
