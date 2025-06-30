"use client";
import React, { useEffect, useState } from "react";
import img1 from "../../../assets/hero/BOOMBOX.png";
import Image from "next/image";
import { Play, Zap, Volume2, Bluetooth, Star, ArrowRight } from "lucide-react";

const ProductMarketing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Handle intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("product-marketing");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const features = [
    { icon: Volume2, label: "360° Sound", description: "Immersive audio" },
    { icon: Zap, label: "48hr Battery", description: "Long-lasting power" },
    { icon: Bluetooth, label: "Wireless", description: "Seamless connection" },
    { icon: Star, label: "Premium", description: "Audiophile grade" },
  ];

  return (
    <div
      id="product-marketing"
      className="relative overflow-hidden max-w-8xl mx-auto my-16"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced background with multiple layers */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-purple-900"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>

      {/* Dynamic gradient overlay based on mouse position */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${
            mousePosition.x * 100
          }% ${
            mousePosition.y * 100
          }%, rgba(255, 0, 100, 0.1), transparent 40%)`,
        }}
      ></div>

      {/* Enhanced animated background elements */}
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
        style={{
          transform: `translateY(${scrollY * 0.2}px) scale(${
            1 + Math.sin(Date.now() / 2000) * 0.1
          })`,
        }}
      ></div>
      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-red-500/15 to-orange-500/15 blur-3xl"
        style={{
          transform: `translateY(${-scrollY * 0.15}px) scale(${
            1 + Math.cos(Date.now() / 1500) * 0.1
          })`,
        }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl"
        style={{
          transform: `translate(-50%, -50%) translateY(${
            scrollY * 0.08
          }px) rotate(${scrollY * 0.02}deg)`,
        }}
      ></div>

      {/* Main content container */}
      <div className="relative z-10 bg-gradient-to-r from-black/90 via-gray-900/95 to-purple-900/90 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-center px-6 lg:px-16 py-16 min-h-[600px]">
          {/* Left content with enhanced animations */}
          <div
            className={`text-start w-full lg:w-1/2 lg:pr-12 mb-16 lg:mb-0 transform transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            {/* Enhanced badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-900/40 to-pink-900/40 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-red-500/30">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse block"></span>
                <span className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              </div>
              <p className="text-red-400 font-semibold">
                Premium Audio Experience
              </p>
            </div>

            {/* Enhanced heading */}
            <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Enhance Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 animate-gradient">
                Music Experience
              </span>
            </h1>

            {/* Enhanced description */}
            <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
              Immerse yourself in crystal-clear sound with our premium audio
              devices. Designed for audiophiles who demand the very best in
              sound quality and performance.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {feature.label}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Experience Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Right content with enhanced product showcase */}
          <div
            className={`w-full lg:w-1/2 relative h-[500px] flex justify-center items-center transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            {/* Enhanced glowing background effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"
              style={{
                transform: `scale(${1 + Math.sin(Date.now() / 1000) * 0.1})`,
              }}
            ></div>

            {/* Rotating rings */}
            <div
              className="absolute inset-0 border-2 border-gradient-to-r from-red-500/30 to-transparent rounded-full"
              style={{
                transform: `rotate(${scrollY * 0.1}deg)`,
                animation: "spin 20s linear infinite",
              }}
            ></div>
            <div
              className="absolute inset-4 border border-purple-500/20 rounded-full"
              style={{
                transform: `rotate(${-scrollY * 0.05}deg)`,
                animation: "spin 30s linear infinite reverse",
              }}
            ></div>

            {/* Product image with enhanced floating animation */}
            <div
              className="relative z-10 transform transition-all duration-500 hover:scale-110"
              style={{
                transform: `translateY(${
                  Math.sin(Date.now() / 1000) * 15
                }px) rotate(${scrollY * 0.02}deg)`,
                filter: "drop-shadow(0 0 40px rgba(255, 0, 100, 0.4))",
              }}
            >
              <Image
                src={img1}
                alt="Premium Boombox"
                className="object-contain max-w-xs lg:max-w-md"
                priority
              />
            </div>

            {/* Enhanced floating spec callouts */}
            <div
              className="absolute top-1/4 -left-8 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md px-4 py-3 rounded-xl text-white border border-white/20 shadow-lg"
              style={{
                transform: `translateY(${Math.sin(Date.now() / 1200) * 5}px)`,
              }}
            >
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-red-400" />
                <span className="font-medium">360° Sound</span>
              </div>
              <p className="text-xs text-gray-300">Surround audio</p>
            </div>

            <div
              className="absolute bottom-1/4 -right-8 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md px-4 py-3 rounded-xl text-white border border-white/20 shadow-lg"
              style={{
                transform: `translateY(${Math.cos(Date.now() / 1200) * 5}px)`,
              }}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">48hr Battery</span>
              </div>
              <p className="text-xs text-gray-300">Long lasting</p>
            </div>

            <div
              className="absolute top-1/2 right-4 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md px-4 py-3 rounded-xl text-white border border-white/20 shadow-lg"
              style={{
                transform: `translateY(${
                  Math.sin(Date.now() / 800 + 1) * 8
                }px)`,
              }}
            >
              <div className="flex items-center space-x-2">
                <Bluetooth className="w-4 h-4 text-blue-400" />
                <span className="font-medium">Wireless</span>
              </div>
              <p className="text-xs text-gray-300">Seamless</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductMarketing;
