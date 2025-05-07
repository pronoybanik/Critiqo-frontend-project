import ReviewSection from "@/components/modules/admin/review/ReviewSection";
import { getAllReviewAdmin } from "@/services/AdminReview";
import React from "react";

const ReviewPage = async () => {
  const data = await getAllReviewAdmin();
  const reviews = await data.data;

  return (
    <>
      <ReviewSection reviewData={reviews} />
    </>
  );
};

export default ReviewPage;
