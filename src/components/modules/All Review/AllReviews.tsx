
"use client";

import LatestReviewCard from "@/components/cards/LatestReviewCards";
import { getAllCategories } from "@/services/Category";
import { IReview } from "@/types/reviews";
import React, { useEffect, useState } from "react";

const AllReviews = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [status, setStatus] = useState("");
  const [catData, setCatData] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // 'asc' | 'desc'
  const [itemsPerPage, setItemsPerPage] = useState(8);


  useEffect(() => {
    const fetchCategory = async () => {

      const { data: category } = await getAllCategories();
      setCatData(category)
      console.log(catData)
    }
    fetchCategory()
  }, [categoryFilter])

  const fetchReviews = async () => {

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
        `${process.env.NEXT_PUBLIC_BASE_API}/reviews?${params.toString()}`,
        // { cache: "no-store" }
      );
      const data = await res.json();
      console.log(data)
      setReviews(data?.data || []);
      const rPage = (data?.meta?.total / data?.meta?.limit)

      setTotalPages(Math.ceil(rPage));
      console.log(totalPages)
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, itemsPerPage, searchText, categoryFilter, availabilityFilter, sortOrder, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews();
  };

  const handleReset = () => {
    setSearchText("");
    setCategoryFilter("");
    setAvailabilityFilter("");
    setStatus("")
    setSortOrder("");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </form>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Set Categories</option>
          {
            catData?.map((cat: any) =>
              <option key={cat?.id} value={cat?.id}>{cat?.name}</option>
            )
          }
          {/* <option value="">Set Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Appliance">Appliance</option> */}
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Rating</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
        </select>
        {/* Availability Filter */}
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">isPremium</option>
          <option value="true">Premium</option>
          <option value="false">Free</option>
        </select>

        {/* Sort */}
        <div>
          <select
            onChange={e => {
              setSortOrder(e.target.value);
              // setCurrentPage(1);
            }}
            value={sortOrder}
            name="sort"
            id="sort"
            className="px-1 md:px-4 py-2 border text-sm rounded-lg border-[#06D6D1]"
          >
            <option value="">Sorting</option>
            <option value="desc">Newest Review</option>
            <option value="asc">Oldest Review</option>
          </select>
        </div>

        <button onClick={handleReset} className="bg-gray-300 px-4 py-2 rounded">
          Reset
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <LatestReviewCard key={index} review={review} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No reviews found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <div>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded bg-gray-100"
          >
            Prev
          </button>
          <span className="px-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded bg-gray-100"
          >
            Next
          </button>
        </div>

        <div>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {[4, 8, 12, 20].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
