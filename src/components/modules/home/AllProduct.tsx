"use client";
import React from "react";
// import cImg from '../../public/Rectangle.png';
import Image from "next/image";
import img1 from "../../../assets/allProduct/breeds.jpg";
import img2 from "../../../assets/allProduct/eoss.png";
import img3 from "../../../assets/allProduct/asuss.png";
import img4 from "../../../assets/allProduct/curology.png";
import img5 from "../../../assets/allProduct/car.png";
import img6 from "../../../assets/allProduct/boat.png";
import img7 from "../../../assets/allProduct/usb game pad.png";
import img8 from "../../../assets/allProduct/jacket.png";
import { HiOutlineHeart } from "react-icons/hi2";
import { IoEyeOutline } from "react-icons/io5";
import { Star } from "lucide-react";
import SecondaryButton from "@/components/shared/SecondaryButton";

const AllProduct = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ); // Full star
      } else if (i - 0.5 === rating) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 text-yellow-400 fill-yellow-400/50"
          />
        ); // Half star
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />); // Empty star
      }
    }
    return stars;
  };
  const products = [
    {
      id: 2,
      name: "CANON EOS DSLR Camera",
      price: 360,
      review: 95,
      pic: img2,
      rating: 4,
    },
    {
      id: 3,
      name: "ASUS FHD Gaming Laptop",
      price: 700,
      review: 325,
      pic: img3,
      rating: 5,
    },
    {
      id: 4,
      name: "Curology Product Set ",
      price: 500,
      review: 145,
      pic: img4,
      rating: 4,
    },
    {
      id: 5,
      name: "Kids Electric Car ",
      price: 960,
      review: 65,
      pic: img5,
      rating: 4,
    },
    {
      id: 1,
      name: "Breed Dry Dog Food",
      price: 100,
      review: 35,
      pic: img1,
      rating: 5,
    },
    {
      id: 6,
      name: "Jr. Zoom Soccer Cleats",
      price: 1160,
      review: 35,
      pic: img6,
      rating: 3,
    },
    {
      id: 7,
      name: "GP11 Shooter USB Gamepad",
      price: 660,
      review: 55,
      pic: img7,
      rating: 4,
    },
    {
      id: 8,
      name: "Quilted Satin Jacket",
      price: 760,
      review: 55,
      pic: img8,
      rating: 5,
    },
  ];
  return (
    <div className="mb-12 mt-8 max-w-7xl mx-auto py-10">
      <div>
        <div className="flex justify-between  items-center mb-14">
          <p className="text-3xl font-bold text-center">Explore Our Product</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
          {products.map((product) => (
            <div key={product?.id}>
              <div className="bg-gray-100 rounded-md flex justify-center items-center p-3 lg:p-8 relative h-[240px] hover:translate-x-2 hover:scale-110 duration-500">
                <Image
                  className="overflow-hidden h-[230px]"
                  src={product?.pic}
                  alt="product"
                ></Image>
                <div className="absolute top-3 right-3">
                  <button className="bg-white size-8 rounded-full flex justify-center items-center">
                    <HiOutlineHeart className="text-2xl" />
                  </button>
                  <button className="bg-white size-8 rounded-full flex justify-center items-center mt-2">
                    <IoEyeOutline className="text-2xl" />
                  </button>
                </div>
                <div className="group bg-transparent absolute  transition-all duration-300 ease-in-out bottom-0 w-full">
                  <button className="text-white bg-black text-center  w-full py-1 rounded-b-md opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out ">
                    Review This
                  </button>
                </div>
              </div>
              <p className="font-medium pt-4 py-2"> {product?.name}</p>
              <p className="text-[#DB4444]">
                $ {product?.price}{" "}
                {/* <span className="text-gray-600 line-through ">$360</span> */}
              </p>
              <div className="flex items-center mb-4">
                {renderStars(product?.rating)}
                <span className="text-sm text-gray-400 ml-2">
                  ({product?.rating} out of 5)
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-6">
          <SecondaryButton className="py-6 w-56">
            View All Product
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
