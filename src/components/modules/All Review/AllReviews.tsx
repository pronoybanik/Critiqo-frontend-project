/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LatestReviewCard from "@/components/cards/LatestReviewCards";
import { getAllCategories } from "@/services/Category";
import React, { useCallback, useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Star, 
  Grid3X3, 
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  TrendingUp
} from "lucide-react";
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
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
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
      try {
        const { data: category } = await getAllCategories();
        setCatData(category || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCatData([]);
      }
    };
    fetchCategory();
  }, []);

  // Handle sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setReviews(data?.data || []);
      const rPage = data?.meta?.total / data?.meta?.limit;
      setTotalPages(Math.ceil(rPage) || 1);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
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
    setMobileFiltersOpen(false);
    
    // Clear URL params as well
    router.push(pathname, { scroll: false });
  };

  const publishedReviews = reviews
    .filter((item: TReview) => item.status === "PUBLISHED")
    .sort(
      (a: TReview, b: TReview) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // Enhanced Filter Component with better mobile handling
  const FilterComponent = ({ isMobile = false }) => (
    <div className={`space-y-4 ${isMobile ? 'space-y-5' : 'space-y-4'}`}>
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
          >
            <option value="">All Categories</option>
            {catData?.map((cat: any) => (
              <option key={cat?.id} value={cat?.id}>
                {cat?.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Rating
        </label>
        <div className="space-y-2">
          {["", "5", "4", "3", "2"].map((rating) => (
            <label key={rating} className="flex items-center space-x-3 cursor-pointer group min-h-[44px] py-1">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={status === rating}
                onChange={(e) => setStatus(e.target.value)}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200 flex items-center">
                {rating === "" ? (
                  "Any Rating"
                ) : (
                  <>
                    {rating} <Star className="w-4 h-4 ml-1 fill-current text-yellow-400" />
                  </>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Premium Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Review Type
        </label>
        <div className="space-y-2">
          {[
            { value: "", label: "All Reviews" },
            { value: "true", label: "Premium Reviews" },
            { value: "false", label: "Free Reviews" }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer group min-h-[44px] py-1">
              <input
                type="radio"
                name="premium"
                value={option.value}
                checked={availabilityFilter === option.value}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Order */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sort By
        </label>
        <div className="relative">
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
          >
            <option value="">Default Sort</option>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Items Per Page */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Items Per Page
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[4, 8, 12, 20].map((size) => (
            <button
              key={size}
              onClick={() => {
                setItemsPerPage(size);
                setCurrentPage(1);
                if (isMobile) setMobileFiltersOpen(false);
              }}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                itemsPerPage === size
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-xs font-medium text-gray-700 shadow-sm mb-4">
              <TrendingUp className="w-3 h-3 mr-2 text-blue-600" />
              Explore Customer Reviews
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Product Reviews
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Find your perfect products with authentic customer reviews and detailed ratings
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
              <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center">
                  <div className="flex items-center pl-4 pr-3">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="flex-1 px-2 py-4 text-sm sm:text-base text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none min-w-0"
                    placeholder="Search products, brands..."
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      handleSearchQuery("title", e.target.value);
                    }}
                  />
                  <div className="p-2">
                    <PrimaryButton 
                      type="submit"
                      className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xs sm:text-sm whitespace-nowrap"
                      disabled={loading}
                    >
                      {loading ? "Searching..." : "Search"}
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-medium shadow-lg min-h-[48px]"
        >
          <Filter className="w-4 h-4" />
          <span>Filters & Sort</span>
        </button>
      </div>

      {/* Enhanced Mobile Filter Modal */}
      {mobileFiltersOpen && (
       <div className="lg:hidden fixed inset-0 z-50  bg-opacity-50 backdrop-blur-sm flex items-end">
          <div className="w-full bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-safe">
              <FilterComponent isMobile={true} />
            </div>
            
            {/* Modal Footer */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium min-h-[48px]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium min-h-[48px]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          
          {/* Desktop Sidebar - Filters */}
          <div className={`hidden lg:block transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-12'}`}>
            <div className="sticky top-6">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full mb-4 bg-white rounded-xl shadow-md border border-gray-100 p-3 hover:shadow-lg transition-all duration-300 min-h-[48px] flex items-center justify-center"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                ) : (
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {sidebarOpen && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Filter Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white flex items-center">
                        <Filter className="w-5 h-5 mr-2" />
                        Filter Reviews
                      </h2>
                      <button
                        onClick={handleReset}
                        disabled={loading}
                        className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 min-h-[36px]"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Options */}
                  <div className="p-6">
                    <FilterComponent />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Reviews */}
          <div className="flex-1 min-w-0">
            
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                    {loading ? "Loading..." : `${publishedReviews.length} Reviews Found`}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Showing page {currentPage} of {totalPages}
                  </p>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-md transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-md transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews Grid/List */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                <div className="inline-flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-gray-600 font-medium">Loading amazing reviews...</span>
                </div>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {publishedReviews.length > 0 ? (
                  publishedReviews.map((review, index) => (
                    <div
                      key={`review-${review.id || index}`}
                      className="transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                    >
                      <LatestReviewCard review={review} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No reviews found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your filters or search terms to find more reviews.
                      </p>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 min-h-[48px]"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Pagination */}
            {publishedReviews.length > 0 && totalPages > 1 && (
              <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-center">
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1 || loading}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm min-h-[44px] ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden xs:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const pageNumbers = [];
                        const maxVisiblePages = 3;
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 text-sm ${
                                currentPage === i
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }
                        return pageNumbers;
                      })()}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages || loading}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm min-h-[44px] ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105"
                      }`}
                    >
                      <span className="hidden xs:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="text-sm text-gray-600 text-center sm:text-right">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, publishedReviews.length)} of {publishedReviews.length} results
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviews;