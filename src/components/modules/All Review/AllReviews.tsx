"use client"
import LatestReviewCard from '@/components/cards/LatestReviewCards';
import { IReview } from '@/types/reviews';
import React, { useEffect, useState } from 'react';

const AllReviews = () => {
  const [search, setSearch] = useState('');
  const [itemperPage, setItemperPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [pages, setPages] = useState([0])
  const [availability, setAvailability] = useState('');
  const [searchText, setSearchText] = useState('');
  const [getDatas, setGetDatas] = useState<any>([]);
  console.log(searchText)
  useEffect(() => {
    const fetchData = async (page, limit, params) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/reviews?page=${page}&limit=${limit}&${params}`,
        {
          next: {
            tags: ["REVIEW"],
          },
        }
      );
      const data = await res.json();
      console.log(data)
      setGetDatas(data.data);
    };
    const page = pages[0];
    console.log(page)
    const limit = itemperPage;
    const params = `searchTerm=${searchText} `;
    fetchData(page, limit, params);

  }, [searchText, pages, itemperPage]);

  const handleSearch = (e: any) => {
    e.preventDefault();

    setSearch(searchText);
    console.log(searchText)
    // refetch();
    // mutateAsync(search);
  };
  const handleReset = () => {
    setSearch('');
    setSearchText('');
    setSort('');
    setFilter('');
    setAvailability('');
  };
  const handleItemsPerPage = (e: any) => {
    console.log(e.target.value);
    const val = parseInt(e.target.value);
    setItemperPage(val);
    setCurrentPage(0);
  };
  const handlePreviouspage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextpage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  console.log(getDatas)
  return (
    <div className='max-w-7xl mx-auto'>

      <div className='flex justify-center items-center gap-2'>
        {/* Search implementtaion */}
        <div className="flex justify-center items-center gap-4 my-6">
          <form onSubmit={handleSearch}>
            <div className=" p-1 overflow-hidden      focus-within:border-blue-400 ">
              <input
                className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent border rounded-lg"
                type="text"
                onChange={e => setSearchText(e.target.value)}
                value={searchText}
                name="search"
                placeholder="Enter asset name"
                aria-label="Enter asset name"
              />

              <button
                type="submit"
                className="px-1 md:px-4 py-2 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-[#06D6D1] rounded-md hover:bg-gray-600 focus:bg-[#3facb2] focus:outline-none"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filter=========================================== */}

        <div className="flex justify-center items-center">
          <select
            onChange={e => {
              setFilter(e.target.value);
            }}
            value={filter}
            name="productType"
            id="productType"
            className="px-1 md:px-4 py-2 border text-sm rounded-lg border-[#06D6D1]"
          >
            <option value="" className="font-semibold">
              Filter By Category
            </option>
            <option value="returnable">Returnable</option>
            <option value="non-returnable">Non-Returnable</option>
          </select>
        </div>
        {/* Filter=========================================== */}
        <div>
          <select
            onChange={e => {
              setAvailability(e.target.value);
              // setCurrentPage(1);
            }}
            value={availability}
            name="sort"
            id="sort"
            className="px-1 md:px-4 py-2 border text-sm rounded-lg border-[#06D6D1]"
          >
            <option value="">Filter By Availability</option>
            <option value="available">Available</option>
            <option value="Out Of Stock">Out Of Stock</option>
          </select>
        </div>
        {/* sort=========================================== */}

        <div>
          <select
            onChange={e => {
              setSort(e.target.value);
              // setCurrentPage(1);
            }}
            value={sort}
            name="sort"
            id="sort"
            className="px-1 md:px-4 py-2 border text-sm rounded-lg border-[#06D6D1]"
          >
            <option value="">Sort By Quantity</option>
            <option value="dsc">Descending Order</option>
            <option value="asc">Ascending Order</option>
          </select>
        </div>
        <button
          onClick={handleReset}
          className="px-1 md:px-4 py-2 text-sm bg-[#06D6D1] text-white rounded-lg"
        >
          Reset
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {getDatas?.map((review: IReview, index: number) => (
          <LatestReviewCard key={index} review={review} />
        ))}
      </div>

      {/* pagination */}
      <div className="pagination ">
        <button onClick={handlePreviouspage}>Prev</button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`hidden ${currentPage === p ? 'bg-[#06D6D1] text-white' : ''
              } px-4 py-2 mx-1 transition-colors duration-300 transform  rounded-md sm:inline hover:bg-[#06D6D1] hover:text-white`}
          >
            {p}
          </button>
        ))}

        <button onClick={handleNextpage}>Next</button>

        <select value={itemperPage} onChange={handleItemsPerPage} name="" id="">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>


    </div>








  );
};

export default AllReviews;