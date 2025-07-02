"use client";
import { useTypewriter } from "react-simple-typewriter";
import LatestReviewCard from "@/components/cards/LatestReviewCards";
import SecondaryButton from "@/components/shared/SecondaryButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TReview } from "@/types/review";
import { ArrowUp } from "lucide-react";

const CapterraSearch = () => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [text] = useTypewriter({
    words: [
      "Search reviews by product name...",
      "Find your favorite item...",
      "Type to discover feedback...",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      if (!searchQuery.trim()) {
        setReviews([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

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
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchReviews, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const publishedReviews = reviews
    .filter((item: TReview) => item.status === "PUBLISHED")
    .sort((a: TReview, b: TReview) => {
      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;
      return dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 animate-pulse"></span>
                  Trusted by thousands of businesses  
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find the{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Perfect Product
                  </span>
                  <br />
                  Reviews & Services
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Critiqo helps you discover the best solutions for your
                  business. Make informed decisions based on real user feedback,
                  detailed comparisons, and comprehensive ratings from verified
                  customers.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="space-y-4">
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-y-2 p-2 sm:p-3">
                    <div className="flex items-center pl-3 pr-2 sm:pl-4 sm:pr-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="flex-1 min-w-[200px] w-full sm:w-auto px-2 py-2 text-base text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none"
                      placeholder={text}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="w-full sm:w-auto p-1 flex justify-end">
                      <SecondaryButton className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Searching...</span>
                          </div>
                        ) : (
                          "SEARCH"
                        )}
                      </SecondaryButton>
                    </div>
                  </div>
                </div>

                {/* Search stats */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>50K+ Reviews</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Verified Users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Real-time Updates</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-10"></div>
                <Image
                  src="/hero-home.webp" // Add leading slash here
                  alt="Person using smartphone"
                  width={600}
                  height={600}
                  layout="responsive"
                  className="rounded-lg object-cover h-full"
                />
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-yellow-400 rounded-full"
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    4.9/5
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-xs text-gray-600">Satisfied</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {(hasSearched || isLoading) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Search Results
                  {searchQuery && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      for {searchQuery}
                    </span>
                  )}
                </h2>
                {!isLoading && publishedReviews.length > 0 && (
                  <p className="text-gray-600 mt-2">
                    Found {publishedReviews.length} review
                    {publishedReviews.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {isLoading && (
                <div className="flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-full">
                  <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-blue-700 font-medium">
                    Searching...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 bg-gray-200 rounded-full"
                      ></div>
                    ))}
                  </div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && hasSearched && (
            <>
              {publishedReviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {publishedReviews.map((review, index) => (
                    <div
                      key={index}
                      className="transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
                    >
                      <LatestReviewCard review={review} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.58M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No reviews found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We could not find any reviews matching {searchQuery}. Try
                      searching with different keywords or check your spelling.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Features Section - shown when no search is active */}
      {!hasSearched && !isLoading && (
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16
        "
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm mb-4">
              <ArrowUp className="w-4 h-4 mr-2 text-blue-600" />
              Most Popular Categories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Choose Us
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Make confident business decisions with our comprehensive review
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔍",
                title: "Smart Search",
                description:
                  "Find exactly what you're looking for with our intelligent search algorithm",
              },
              {
                icon: "⭐",
                title: "Verified Reviews",
                description:
                  "All reviews are from verified users to ensure authenticity and reliability",
              },
              {
                icon: "📊",
                title: "Detailed Analytics",
                description:
                  "Get comprehensive insights with detailed ratings and comparison tools",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-200 hover:shadow-xl"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CapterraSearch;
