import ReviewSection from "@/components/modules/admin/review/ReviewSection";
import { getAllReview } from "@/services/Review";
import React from "react";

const ReviewPage = async () => {
  const data = await getAllReview();
  const reviews = await data.data;

  return (
    <>
      {" "}
      <ReviewSection  reviewData={reviews} />
    </>
  );
};

export default ReviewPage;
