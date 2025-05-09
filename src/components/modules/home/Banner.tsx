"use client";
import { useTypewriter } from "react-simple-typewriter";
import LatestReviewCard from "@/components/cards/LatestReviewCards";
import SecondaryButton from "@/components/shared/SecondaryButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TReview } from "@/types/review";

const CapterraSearch = () => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [text] = useTypewriter({
    words: [
      "Search reviews by product name...",
      "Find your favorite item...",
      "Type to discover feedback...",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  // const fetchReviews = async () => {
  //   try {
  //     const params = new URLSearchParams({
  //       page: '0',
  //       limit: '0',
  //       title: searchQuery,

  //     });

  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_API}/reviews?${params.toString()}`
  //     );
  //     const data = await res.json();
  //     setReviews(data?.data || []);

  //   } catch (err) {
  //     console.error("Error fetching reviews:", err);
  //   }
  // };
  // useEffect(() => {
  //   if (searchQuery.trim()) {
  //     fetchReviews();
  //   } else {
  //     // Optionally clear results when there's no search input
  //     setReviews([]);
  //   }
  // }, [searchQuery]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams({
          page: "0",
          limit: "0",
          title: searchQuery,
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API}/reviews?${params.toString()}`
        );
        const data = await res.json();
        setReviews(data?.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    if (searchQuery.trim()) {
      fetchReviews();
    } else {
      setReviews([]);
    }
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Left side content */}
      <div className=" grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-2 flex justify-start items-baseline-last">
          <div className=" mb-8 md:mb-0   ">
            <h1 className="text-4xl font-stretch-semi-expanded font-bold text-gray-700 mb-4">
              Find the right Product Review <br /> and services
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Critiqo helps you find the best solutions for your business.
              Evaluate <br />
              options based on price and features, your business size and <br />{" "}
              industry, and ratings from verified users.
            </p>

            {/* Search bar */}
            <div className="flex w-full max-w-xl">
              <div className="relative w-full group animated-border rounded-lg p-[2px]">
                <div className="relative w-full bg-white rounded-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 bg-white focus:outline-none rounded-md"
                    placeholder={text}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                  />
                  <div className="absolute right-0 top-0 h-full">
                    <SecondaryButton
                      type="submit"
                      className="h-full rounded-l-none rounded-r-md px-8 py-4"
                    >
                      SEARCH
                    </SecondaryButton>
                  </div>
                </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reviews
          .filter((item: TReview) => item.status === "PUBLISHED")
          .sort((a: TReview, b: TReview) => {
            const dateA = new Date(a.createdAt).getTime() || 0;
            const dateB = new Date(b.createdAt).getTime() || 0;
            return dateB - dateA;
          })
          .map((review, index) => (
            <LatestReviewCard key={index} review={review} />
          ))}
      </div>
    </div>
  );
};

export default CapterraSearch;
