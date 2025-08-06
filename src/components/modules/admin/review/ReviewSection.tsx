/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Check, X, Clock } from "lucide-react";

import TotalCount from "./TotalCount";
import ReviewTable from "./ReviweTable";
import { TAdminReview } from "@/types/adminreview";
import { reviewUpdateByAdmin } from "@/services/AdminReview";
import { toast } from "sonner";

const ReviewSection = ({ reviewData }: { reviewData: TAdminReview[] }) => {
  const [reviews, setReviews] = useState<TAdminReview[]>(reviewData);


  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle review status change
  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const res = await reviewUpdateByAdmin(reviewId, {
        status: newStatus,
        moderationNote: `Status changed to ${newStatus} by admin`,
      });
      if (res?.success) {
        setReviews((prevReviews: any) =>
          prevReviews.map((review: any) =>
            review.id === reviewId
              ? {
                  ...review,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : review
          )
        );
        toast.success(`Review status changed successfully to "${newStatus}"`);
      } else {
        toast.error("Failed to update review status");
      }
    } catch (error: any) {
      console.error("Error updating status:", error.message);
      toast.error("Something went wrong while changing review status");
    }
  };

  // Badge component
  const Badge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-yellow-100 text-yellow-800",
      PUBLISHED: "bg-green-100 text-green-800",
      UNPUBLISHED: "bg-red-100 text-red-800",
      pending: "bg-orange-100 text-orange-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          colors[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Reviews Management Dashboard
        </h1>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <TotalCount reviewData={reviews} />

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {reviews
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 4)
                .map((review) => (
                  <div
                    key={review.id}
                    className="p-2 border border-gray-100 rounded-md"
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-800 truncate w-32">
                        {review.title}
                      </p>
                      <Badge status={review.status} />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      By {review.name} • {formatDate(review.createdAt)}
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleStatusChange(review.id, "PUBLISHED")
                        }
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        <Check size={12} className="inline mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(review.id, "UNPUBLISHED")
                        }
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      >
                        <X size={12} className="inline mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Review Table */}
        <div className="bg-white rounded-lg shadow">
          <ReviewTable reviewData={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
