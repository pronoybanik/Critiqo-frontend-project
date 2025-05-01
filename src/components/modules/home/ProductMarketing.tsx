'use client';
import React from 'react';
import img1 from '../../../assets/hero/BOOMBOX.png';
import Image from 'next/image';


const ProductMarketing = () => {
  return (
    <div>
      <div className=" flex flex-col lg:flex-row justify-center items-center bg-black px-2 pb-4 mx-auto mt-10  lg:h-[420px]">
        <div className="text-start pl-4 lg:pl-16 items-start mt-32 w-full h-full ">
          <div className="flex justify-start items-center gap-4 text-white pb-6">
            {/* <ImAppleinc className="text-4xl" /> */}
            <p className="text-[#DB4444]">Music</p>
          </div>
          <h1 className="text-3xl font-semibold text-white lg:text-5xl">
            Enhance Your <br /> Music Experience
          </h1>

          <br />
          <button className="px-5 py-3 bg-[#DB4444] rounded-sm text-white mt-1">
            Share Review
          </button>
        </div>
        <div className="w-full flex justify-center items-center  relative ">
          <div className="size-[450px] bg-gradient-to-r from-[#D9D9D9] from-30% via-[#D9D9D9] via-40%  to-[#D9D9D9] rounded-full opacity-30 blur-3xl "></div>
          <div className="absolute">
            <Image src={img1} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMarketing;