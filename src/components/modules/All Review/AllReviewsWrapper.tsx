// components/AllReviewsWrapper.tsx
"use client";
import { Suspense } from "react";
import AllReviews from "./AllReviews";

const AllReviewsWrapper = () => {
  return (
    <Suspense fallback={<div>Loading reviews...</div>}>
      <AllReviews />
    </Suspense>
  );
};

export default AllReviewsWrapper;
