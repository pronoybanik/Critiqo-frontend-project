import { TAdminReview } from "@/types/adminreview";
import { FileText } from "lucide-react";
import React from "react";

type ReviewCount = {
  published: number;
  pending: number;
  unpublished: number;
};
const TotalCount = ({ reviewData }: { reviewData: TAdminReview[] }) => {
 
  const reviewCounts = reviewData.reduce(
    (acc: ReviewCount, review: TAdminReview) => {
      if (review.status === "PUBLISHED") acc.published += 1;
      else if (review.status === "DRAFT") acc.pending += 1;
      else acc.unpublished += 1;
      return acc;
    },
    { published: 0, pending: 0, unpublished: 0 }
  );
  

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-3 rounded-full mr-3">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Reviews</p>
          <h3 className="text-2xl font-bold">{reviewData?.length}</h3>
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="bg-green-100 px-2 py-1 rounded text-xs text-green-700">
          {reviewCounts.published} Published
        </div>
        <div className="bg-yellow-100 px-2 py-1 rounded text-xs text-yellow-700">
          {reviewCounts.pending} Pending
        </div>
        <div className="bg-red-100 px-2 py-1 rounded text-xs text-red-700">
          {reviewCounts.unpublished} Unpublished
        </div>
      </div>
    </div>
  );
};

export default TotalCount;
