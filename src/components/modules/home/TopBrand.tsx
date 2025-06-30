"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { Award, Star, TrendingUp, Users } from "lucide-react";
import img1 from "../../../assets/brandLogo/todo.png";
import img2 from "../../../assets/brandLogo/amazon.png";
import img3 from "../../../assets/brandLogo/android.png";
import img4 from "../../../assets/brandLogo/adidas.png";
import img5 from "../../../assets/brandLogo/apple.png";
import img6 from "../../../assets/brandLogo/fedex.png";
import img8 from "../../../assets/brandLogo/rolex.png";
import img9 from "../../../assets/brandLogo/algolia.png";
import img10 from "../../../assets/brandLogo/google.png";

const TopBrand = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Brand data with additional information
  const brands = [
    { img: img1, name: "Todo", category: "Productivity" },
    { img: img2, name: "Amazon", category: "E-commerce" },
    { img: img3, name: "Android", category: "Technology" },
    { img: img4, name: "Adidas", category: "Sports" },
    { img: img5, name: "Apple", category: "Technology" },
    { img: img6, name: "FedEx", category: "Logistics" },
    { img: img8, name: "Rolex", category: "Luxury" },
    { img: img9, name: "Algolia", category: "Search" },
    { img: img10, name: "Google", category: "Technology" },
  ];

  // Handle intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("top-brand-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const stats = [
    { icon: Users, label: "Trusted Partners", value: "500+" },
    { icon: Star, label: "Average Rating", value: "4.9" },
    { icon: TrendingUp, label: "Growth Rate", value: "250%" },
    { icon: Award, label: "Years Experience", value: "10+" },
  ];

  return (
    <div
      id="top-brand-section"
      className="relative py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm mb-4">
            <Award className="w-4 h-4 mr-2 text-blue-600" />
            Trusted by Industry Leaders
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Amazing{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Brand Partners
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join the worlds leading brands who trust us with their customer
            feedback and reviews
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Marquee Section */}
        <div className="relative">
          {/* Marquee Container */}
          <div
            className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top section with controls */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Brand Showcase
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isPaused ? "bg-yellow-400" : "bg-green-400"
                    } animate-pulse`}
                  ></div>
                  <span className="text-xs text-gray-500">
                    {isPaused ? "Paused" : "Live"}
                  </span>
                </div>
              </div>
            </div>

            {/* Marquee Content */}
            <div className="py-8">
              <Marquee
                pauseOnHover={true}
                speed={40}
                gradient={true}
                gradientColor="rgb(255, 255, 255)"
                gradientWidth={50}
              >
                {brands.map((brand, index) => (
                  <div key={index} className="mx-8 group cursor-pointer">
                    <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 min-w-[160px]">
                      {/* Brand logo container */}
                      <div className="relative h-16 w-24 mx-auto mb-4 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Image
                          src={brand.img}
                          alt={`${brand.name} Logo`}
                          className="object-contain h-12 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                        />
                      </div>

                      {/* Brand info */}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors duration-300">
                          {brand.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {brand.category}
                        </p>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </Marquee>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse opacity-60"></div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-2">
              Want to become our partner?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of brands who trust us to collect and showcase
              authentic customer reviews
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Become a Partner
              </button>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold border border-white/30 transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBrand;
