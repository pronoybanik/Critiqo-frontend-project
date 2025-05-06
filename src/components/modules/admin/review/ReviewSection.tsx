"use client";
import { useState } from "react";
import {
  Star,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  DollarSign,
  FileText,
  Clock,
  Award,
  Edit,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IReview } from "@/types/reviews";
import TotalCount from "./TotalCount";
import ReviewTable from "./ReviweTable";

const ReviewSection = ({ reviewData }: { reviewData: IReview }) => {
  console.log("review", reviewData);

  const [reviews, setReviews] = useState(reviewData);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReview, setSelectedReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [moderationReason, setModerationReason] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // Filter reviews based on active tab
  // const filteredReviews = reviewData.filter(
  //   (review) => review.status === "DRAFT"
  // );

  // console.log("filter", filteredReviews);

  // Calculate total premium earnings
  // const totalEarnings = reviews
  //   .filter((r) => r.isPremium && r.status === "published")
  //   .reduce((sum, review) => sum + (review.price || 0), 0);

  // Get top premium reviews by earnings (assuming voteCount * price = earnings)
  // const topPremiumReviews = [...reviews]
  //   .filter((r) => r.isPremium && r.status === "published")
  //   .sort((a, b) => b.voteCount * (b.price || 0) - a.voteCount * (a.price || 0))
  //   .slice(0, 3);

  // Recent activity - pending reviews or recently updated ones
  const recentActivity = [...reviews]
    .filter((r) => r.status === "pending")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4);

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()}`;
  };

  // Handle review status change
  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(
      reviews.map((review) =>
        review._id === reviewId
          ? {
              ...review,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : review
      )
    );
    setModalOpen(false);
  };

  // Open moderation reason modal
  const openModerationModal = (review, type) => {
    setSelectedReview(review);
    setModalType(type);
    setModalOpen(true);
    if (type === "price") {
      setEditPrice(review.price?.toString() || "0");
    }
  };

  // Handle premium status toggle
  const togglePremiumStatus = (reviewId) => {
    setReviews(
      reviews.map((review) => {
        if (review._id === reviewId) {
          const isPremium = !review.isPremium;
          return {
            ...review,
            isPremium,
            price: isPremium ? review.price || 4.99 : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return review;
      })
    );
  };

  // Handle price update
  const updatePrice = () => {
    if (!selectedReview) return;

    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice <= 0) return;

    setReviews(
      reviews.map((review) =>
        review._id === selectedReview._id
          ? { ...review, price: newPrice, updatedAt: new Date().toISOString() }
          : review
      )
    );

    setModalOpen(false);
  };

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  // Badge component
  const Badge = ({ status }) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      unpublished: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          {/* Total Reviews Card */}
          <TotalCount reviewData={reviewData} />

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {reviewData
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 4)
                .map((review: IReview) => (
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
                          handleStatusChange(review._id, "published")
                        }
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      >
                        <Check size={12} className="inline mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => openModerationModal(review, "reject")}
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      >
                        <X size={12} className="inline mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No pending reviews
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Management Tabs */}
        <div className="bg-white rounded-lg shadow">
          {/* Reviews Table */}
          <ReviewTable reviewData={reviewData} />
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
