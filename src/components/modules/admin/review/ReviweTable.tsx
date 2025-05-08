/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Star, Check, X, ArrowUp, ArrowDown } from "lucide-react";
import { reviewUpdateByAdmin } from "@/services/AdminReview";
import { toast } from "sonner";
import { TAdminReview } from "@/types/adminreview";

const ReviewTable = ({ reviewData }: { reviewData: any }) => {
  const [reviews, setReviews] = useState<any>(reviewData);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  type ReviewStatus = "PUBLISHED" | "UNPUBLISHED" | "DRAFT" | "pending";

  const handleStatusChange = async (
    reviewId: string,
    newStatus: ReviewStatus
  ) => {
    try {
      const res = await reviewUpdateByAdmin(reviewId, {
        status: newStatus,
        moderationNote: `Status changed to ${newStatus} by admin`,
      });

      if (res?.success) {
        setReviews((prevReviews: any) =>
          prevReviews.map((review: TAdminReview) =>
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

  const togglePremiumStatus = async (reviewId: string) => {
    const review = reviews.find((r: any) => r.id === reviewId);
    if (!review) return;

    const newIsPremium = !review.isPremium;

    try {
      const data = {
        isPremium: newIsPremium,
        moderationNote: newIsPremium
          ? "Excellent in-depth review that provides premium value"
          : "Reverted to free review",
      };

      const res = await reviewUpdateByAdmin(reviewId, data);

      if (res?.success) {
        toast.success("Is REviews premium");
        // Update local state after successful API call

        setReviews((prevReviews: any) =>
          prevReviews.map((r: any) =>
            r.id === reviewId
              ? {
                  ...r,
                  isPremium: newIsPremium,
                  premiumPrice: newIsPremium ? r.premiumPrice || 4.99 : null,
                }
              : r
          )
        );
      }
    } catch (error: any) {
      console.error("Toggle premium error:", error.message);
    }
  };

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
        {status}
      </span>
    );
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  const renderTable = (status: string) => {
    const filtered = reviews.filter((r: any) => r.status === status);

    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3 capitalize">
          {status} Reviews
        </h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Author Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Author Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Votes
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Premium
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((review: TAdminReview) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="font-medium text-gray-900">
                      {review.title}
                    </div>
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {review.userName}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {review.userEmail}
                  </td>
                  <td className="px-4 py-2">
                    <Badge status={review.status} />
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {review.votes}
                    {review.votes > 25 ? (
                      <ArrowUp
                        size={14}
                        className="inline ml-1 text-green-500"
                      />
                    ) : review.votes < 10 ? (
                      <ArrowDown
                        size={14}
                        className="inline ml-1 text-red-500"
                      />
                    ) : null}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => togglePremiumStatus(review.id)}
                      className={`inline-flex h-5 w-10 rounded-full transition duration-200 ease-in-out ${
                        review.isPremium ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                          review.isPremium ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2 text-right text-sm space-x-2">
                    <button
                      title="Approve"
                      onClick={() => handleStatusChange(review.id, "PUBLISHED")}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Check size={25} className="inline" />
                    </button>
                    <button
                      title="reject"
                      onClick={() =>
                        handleStatusChange(review.id, "UNPUBLISHED")
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      <X size={25} className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-sm py-4 text-gray-500"
                  >
                    No reviews found for {status}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Reviews by Status</h1>
      {[...new Set(reviews.map((r: any) => r.status))].map((status) =>
        renderTable(status as "PUBLISHED" | "UNPUBLISHED" | "DRAFT" | "pending")
      )}
    </div>
  );
};

export default ReviewTable;
