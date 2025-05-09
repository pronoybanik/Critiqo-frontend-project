import LatestReviewCard from "@/components/cards/LatestReviewCards";
import PrimaryButton from "@/components/shared/PrimayButton";
import { getAllReview } from "@/services/Review";
import { TReview } from "@/types/review";
import Link from "next/link";
import React from "react";

const LatestReview = async () => {
  const data = await getAllReview();
  const reviewsData = await data.data;

  let content = null;

  if (!reviewsData || reviewsData.length === 0) {
    content = <p>No reviews found!</p>;
  } else {
    content = (
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reviewsData
          .filter((item: TReview) => item.status === "PUBLISHED")
          .sort((a: TReview, b: TReview) => {
            const dateA = new Date(a.createdAt).getTime() || 0;
            const dateB = new Date(b.createdAt).getTime() || 0;
            return dateB - dateA;
          })
          .slice(0, 8)
          .map((review: TReview) => (
            <LatestReviewCard key={review.id} review={review} />
          ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4">
      <div className="text-center py-4">
        <h1 className="text-3xl py-5 font-bold">Latest Review</h1>
      </div>
      {content}
      <Link href="/reviews" className="flex items-center justify-center my-4">
        <PrimaryButton className="w-52 ">view all review</PrimaryButton>
      </Link>
    </div>
  );
};

export default LatestReview;
