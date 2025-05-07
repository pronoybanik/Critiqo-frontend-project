"use client";
import React, { useEffect, useState } from "react";
import img1 from "../../../assets/hero/BOOMBOX.png";
import Image from "next/image";


const ProductMarketing = () => {
  const [scrollY, setScrollY] = useState(0);

  // Handle parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative overflow-hidden container mx-auto">
      {/* Background elements with parallax effect */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>

      {/* Animated circles */}
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      ></div>
      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-red-500/10 blur-3xl"
        style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center bg-gradient-to-r from-black via-black to-gray-900 px-6 py-16 mx-auto mt-10 min-h-[500px] rounded-xl overflow-hidden">
        {/* Left content */}
        <div className="text-start lg:pl-16 w-full lg:w-1/2 lg:pr-12 mb-16 lg:mb-0">
          <div className="inline-flex items-center gap-2 bg-red-900/30 px-4 py-2 rounded-full mb-6">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <p className="text-red-400 font-medium">Premium Audio</p>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Enhance Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600">
              Music Experience
            </span>
          </h1>

          <p className="text-gray-400 mb-8 max-w-md">
            Immerse yourself in crystal-clear sound with our premium audio
            devices. Designed for audiophiles who demand the very best.
          </p>
        </div>

        {/* Right content with floating animation */}
        <div className="w-full lg:w-1/2 relative h-[400px] flex justify-center items-center">
          {/* Glowing background effect */}
          <div className="absolute size-[450px] bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

          {/* Product image with floating animation */}
          <div
            className="absolute transform transition-all duration-500 hover:scale-105"
            style={{
              transform: `translateY(${
                Math.sin(Date.now() / 1000) * 10
              }px) rotate(${scrollY * 0.02}deg)`,
              filter: "drop-shadow(0 0 30px rgba(255, 0, 0, 0.3))",
            }}
          >
            <Image
              src={img1}
              alt="Premium Boombox"
              className="object-contain"
              priority
            />
          </div>

          {/* Specs callouts */}
          <div className="absolute top-1/4 -left-4 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg text-white text-sm">
            360° Sound
          </div>
          <div className="absolute bottom-1/4 -right-4 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg text-white text-sm">
            48hr Battery
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMarketing;
