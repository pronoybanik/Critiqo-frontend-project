"use client"
import Image from 'next/image';
import { useState } from 'react';

const CapterraSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Left side content */}
      <div className=' grid grid-cols-1 md:grid-cols-3'>
        <div className='col-span-2 flex justify-start items-baseline-last'>
          <div className=" mb-8 md:mb-0   ">
            <h1 className="text-4xl font-stretch-semi-expanded font-bold text-gray-700 mb-4">
              Find the right Product Review  <br /> and services
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Capterra helps you find the best solutions for your business. Evaluate <br />
              options based on price and features, your business size and <br /> industry, and
              ratings from verified users.
            </p>

            {/* Search bar */}
            <div className="flex w-full max-w-xl">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product, category, industry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-r-lg text-sm px-8 py-4"
                >
                  SEARCH
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side images grid */}
        <div className=" col-span-1 gap-4">
          {/* Top left image */}
          <div className=" rounded-lg overflow-hidden ">
            <Image
              src="https://www.capterra.com/assets-capterra-bx-landing-pages/_next/image/?url=%2Fcapterra%2Fassets%2Fhero-home.png&w=640&q=75"
              alt="Person using smartphone"
              width={600}
              height={820}
              layout="responsive"
              className="rounded-lg object-cover h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapterraSearch;