import ReviewSection from "@/components/modules/admin/review/ReviewSection";
import { getAllReviewAdmin } from "@/services/AdminReview";
import React from "react";

const ReviewPage = async () => {
  const data = await getAllReviewAdmin();
  const reviews = await data.data;

  let content = null;

  if (reviews?.length > 0) {
    content = <ReviewSection reviewData={reviews} />;
  } else {
    content = <p>There are no Data</p>;
  }

  return <>{content}</>;
};

export default ReviewPage;
