/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LatestReviewCard from "@/components/cards/LatestReviewCards";
import { getAllCategories } from "@/services/Category";
import React, { useCallback, useEffect, useState } from "react";
import { Search, Filter, Gift, RefreshCw } from "lucide-react";
import PrimaryButton from "@/components/shared/PrimayButton";
import { TReview } from "@/types/review";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const AllReviews = () => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [status, setStatus] = useState("");
  const [catData, setCatData] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearchQuery = (query: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(query, value.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const { data: category } = await getAllCategories();
      setCatData(category);
    };
    fetchCategory();
  }, [categoryFilter]);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        title: searchText,
        rating: status,
        categoryId: categoryFilter,
        isPremium: availabilityFilter,
        sortBy: "createdAt",
        sortOrder: sortOrder,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/reviews?${params}`
      );
      const data = await res.json();
      setReviews(data?.data || []);
      const rPage = data?.meta?.total / data?.meta?.limit;
      setTotalPages(Math.ceil(rPage));
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false); // End loading
    }
  }, [
    currentPage,
    itemsPerPage,
    searchText,
    categoryFilter,
    availabilityFilter,
    sortOrder,
    status,
  ]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews();
  };

  const handleReset = () => {
    setSearchText("");
    setCategoryFilter("");
    setAvailabilityFilter("");
    setStatus("");
    setSortOrder("");
    setCurrentPage(1);
    fetchReviews();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-purple-50 to-white">
      {/* Festive Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
          <Gift className="h-6 w-6 text-red-500" />
          <span>Discover Amazing Reviews</span>
          <Gift className="h-6 w-6 text-red-500" />
        </h1>
        <p className="text-purple-600">
          Find your perfect products with our curated reviews
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-purple-100 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="text-lg font-semibold text-purple-800 flex items-center">
            <Filter className="h-5 w-5 mr-2" /> Filter Options
          </h2>
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors border border-gray-200 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Reset
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-start">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  handleSearchQuery("title", e.target.value);
                }}
                className="border border-purple-200 rounded-lg px-4 py-2 pl-9 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-400" />
            </div>
            <PrimaryButton
              type="submit"
              className="px-4 py-2 rounded-lg sm:w-28"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </PrimaryButton>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
            >
              <option value="">All Categories</option>
              {catData?.map((cat: any) => (
                <option key={cat?.id} value={cat?.id}>
                  {cat?.name}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
            >
              <option value="">Any Rating</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="border border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
            >
              <option value="">All Reviews</option>
              <option value="true">Premium</option>
              <option value="false">Free</option>
            </select>

            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
              className="border border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
            >
              <option value="">Default Sort</option>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="relative">
        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12 text-purple-600 font-medium text-lg">
            Loading reviews...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.length > 0 ? (
              reviews
                .filter((item: TReview) => item.status === "PUBLISHED")
                .sort(
                  (a: TReview, b: TReview) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((review, index) => (
                  <LatestReviewCard key={index} review={review} />
                ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-purple-700 font-medium text-lg">
                  No reviews found.
                </p>
                <p className="text-purple-500 mt-2">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-12 bg-white p-4 rounded-lg shadow-sm border border-purple-100">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || loading}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
            }`}
          >
            Prev
          </button>

          <div className="px-4 py-2 bg-purple-50 rounded-lg">
            <span className="font-medium text-purple-800">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            }`}
          >
            Next
          </button>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-purple-700 mr-2">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-purple-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {[4, 8, 12, 20].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Festive Footer */}
      <div className="mt-8 text-center text-sm text-purple-600">
        <p>
          ✨ Discover amazing products and make informed decisions with our
          reviews ✨
        </p>
      </div>
    </div>
  );
};

export default AllReviews;
