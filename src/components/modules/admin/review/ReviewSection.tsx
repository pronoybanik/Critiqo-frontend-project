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

// Mock data
const mockReviewData = [
  {
    _id: "1",
    title: "Great Phone",
    description:
      "This phone exceeded my expectations in every way possible. The battery life is amazing and the camera quality is fantastic.",
    rating: 5,
    category: "Gadgets",
    purchaseSource: "Amazon",
    author: { _id: "a1", name: "John D." },
    status: "pending",
    isPremium: true,
    price: 4.99,
    voteCount: 32,
    createdAt: "2025-05-01T10:30:00Z",
    updatedAt: "2025-05-01T10:30:00Z",
  },
  {
    _id: "2",
    title: "Disappointing Laptop",
    description:
      "I was really looking forward to this laptop but it failed to meet my expectations. The keyboard is uncomfortable.",
    rating: 2,
    category: "Computers",
    purchaseSource: "Best Buy",
    author: { _id: "a2", name: "Sarah M." },
    status: "published",
    isPremium: false,
    voteCount: 15,
    createdAt: "2025-04-29T14:15:00Z",
    updatedAt: "2025-04-30T09:20:00Z",
  },
  {
    _id: "3",
    title: "Amazing Camera",
    description:
      "This DSLR camera is a game-changer for amateur photographers. The picture quality is outstanding.",
    rating: 5,
    category: "Photography",
    purchaseSource: "B&H Photo",
    images: ["/api/placeholder/320/240"],
    author: { _id: "a3", name: "Mike T." },
    status: "published",
    isPremium: true,
    price: 6.99,
    voteCount: 48,
    createdAt: "2025-04-28T08:45:00Z",
    updatedAt: "2025-04-28T16:30:00Z",
  },
  {
    _id: "4",
    title: "Okay Headphones",
    description:
      "These headphones are decent for the price, but the sound quality could be better.",
    rating: 3,
    category: "Audio",
    purchaseSource: "Walmart",
    author: { _id: "a4", name: "Lisa R." },
    status: "unpublished",
    isPremium: false,
    voteCount: 7,
    createdAt: "2025-04-27T11:10:00Z",
    updatedAt: "2025-04-29T13:25:00Z",
  },
  {
    _id: "5",
    title: "Fantastic Gaming Monitor",
    description:
      "The refresh rate and color accuracy on this monitor make it perfect for gaming and content creation.",
    rating: 5,
    category: "Monitors",
    purchaseSource: "Newegg",
    author: { _id: "a5", name: "Alex K." },
    status: "pending",
    isPremium: true,
    price: 7.99,
    voteCount: 23,
    createdAt: "2025-05-01T09:15:00Z",
    updatedAt: "2025-05-01T09:15:00Z",
  },
  {
    _id: "6",
    title: "Poor Quality Smart Watch",
    description:
      "The battery drains too quickly and the fitness tracking is inaccurate.",
    rating: 1,
    category: "Wearables",
    purchaseSource: "Target",
    author: { _id: "a6", name: "Ryan B." },
    status: "published",
    isPremium: false,
    voteCount: 19,
    createdAt: "2025-04-25T15:40:00Z",
    updatedAt: "2025-04-26T10:05:00Z",
  },
  {
    _id: "7",
    title: "Excellent Bluetooth Speaker",
    description:
      "Great sound quality, durable build, and amazing battery life. Worth every penny!",
    rating: 5,
    category: "Audio",
    purchaseSource: "Best Buy",
    author: { _id: "a7", name: "Emma S." },
    status: "pending",
    isPremium: true,
    price: 3.99,
    voteCount: 12,
    createdAt: "2025-05-02T08:20:00Z",
    updatedAt: "2025-05-02T08:20:00Z",
  },
  {
    _id: "8",
    title: "Mediocre Coffee Maker",
    description:
      "It works, but the coffee isn't very hot and the brewing speed is slow.",
    rating: 3,
    category: "Kitchen",
    purchaseSource: "Amazon",
    author: { _id: "a8", name: "Chris P." },
    status: "published",
    isPremium: false,
    voteCount: 27,
    createdAt: "2025-04-20T12:30:00Z",
    updatedAt: "2025-04-21T09:45:00Z",
  },
];

// Revenue data for the chart
const revenueData = [
  { name: "Apr 26", revenue: 135 },
  { name: "Apr 27", revenue: 120 },
  { name: "Apr 28", revenue: 210 },
  { name: "Apr 29", revenue: 180 },
  { name: "Apr 30", revenue: 190 },
  { name: "May 1", revenue: 240 },
  { name: "May 2", revenue: 165 },
];

const ReviewSection = ({ reviewData }: { reviewData: IReview }) => {
  console.log("review", reviewData);

  const reviewCounts = reviewData.reduce(
    (acc, review) => {
      if (review.status === "PUBLISHED") acc.published += 1;
      else if (review.status === "PENDING") acc.pending += 1;
      else acc.unpublished += 1;
      return acc;
    },
    { published: 0, pending: 0, unpublished: 0 }
  );
  

  const [reviews, setReviews] = useState(mockReviewData);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedReview, setSelectedReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [moderationReason, setModerationReason] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // Filter reviews based on active tab
  const filteredReviews = reviews.filter(
    (review) => review.status === activeTab
  );

//   // Count reviews by status
//   const reviewCounts = {
//     total: reviews.length,
//     pending: reviews.filter((r) => r.status === "pending").length,
//     published: reviews.filter((r) => r.status === "published").length,
//     unpublished: reviews.filter((r) => r.status === "unpublished").length,
//   };

  // Calculate total premium earnings
  const totalEarnings = reviews
    .filter((r) => r.isPremium && r.status === "published")
    .reduce((sum, review) => sum + (review.price || 0), 0);

  // Get top premium reviews by earnings (assuming voteCount * price = earnings)
  const topPremiumReviews = [...reviews]
    .filter((r) => r.isPremium && r.status === "published")
    .sort((a, b) => b.voteCount * (b.price || 0) - a.voteCount * (a.price || 0))
    .slice(0, 3);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Reviews Card */}
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

          {/* Premium Review Earnings */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Premium Earnings</p>
                <h3 className="text-2xl font-bold">
                  ${totalEarnings.toFixed(2)}
                </h3>
              </div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis hide={true} />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Revenue"]}
                    contentStyle={{ fontSize: "12px" }}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Premium Reviews */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Top Premium Reviews</h3>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-800">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {topPremiumReviews.map((review) => (
                <div
                  key={review._id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate w-32">
                      {review.title}
                    </p>
                    <div className="flex items-center">
                      <StarRating rating={review.rating} />
                      <span className="ml-2 text-xs text-gray-500">
                        {review.voteCount} votes
                      </span>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">
                    ${(review.voteCount * review.price || 0).toFixed(2)}
                  </div>
                </div>
              ))}
              {topPremiumReviews.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No premium reviews yet
                </p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full mr-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((review) => (
                <div
                  key={review._id}
                  className="p-2 border border-gray-100 rounded-md"
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-800 truncate w-32">
                      {review.title}
                    </p>
                    <Badge status={review.status} />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    By {review.author.name} • {formatDate(review.createdAt)}
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
          <div className="border-b border-gray-200">
            <nav className="flex">
              {["pending", "published", "unpublished"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === activeTab && (
                    <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      {reviewCounts[tab]}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Reviews Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Votes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-1">
                            <div className="text-sm font-medium text-gray-900">
                              {review.title}
                            </div>
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {review.author.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {review.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge status={review.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-1">{review.voteCount}</span>
                          {review.voteCount > 25 ? (
                            <ArrowUp size={16} className="text-green-500" />
                          ) : review.voteCount < 10 ? (
                            <ArrowDown size={16} className="text-red-500" />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => togglePremiumStatus(review._id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              review.isPremium ? "bg-green-500" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                review.isPremium
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          {review.isPremium && (
                            <div className="flex items-center ml-2">
                              <span className="text-sm text-gray-700">
                                ${review.price?.toFixed(2)}
                              </span>
                              <button
                                onClick={() =>
                                  openModerationModal(review, "price")
                                }
                                className="ml-1 text-gray-400 hover:text-blue-500"
                              >
                                <Edit size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {review.status !== "published" && (
                            <button
                              onClick={() =>
                                handleStatusChange(review._id, "published")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                          )}
                          {review.status !== "unpublished" && (
                            <button
                              onClick={() =>
                                openModerationModal(review, "reject")
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No reviews found in this status
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Moderation Reason Modal */}
      {modalOpen && modalType === "reject" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Moderation Reason
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for unpublishing the review "
              {selectedReview?.title}"
            </p>
            <textarea
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-24"
              placeholder="Enter your reason here..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusChange(selectedReview._id, "unpublished")
                }
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Unpublish Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Edit Modal */}
      {modalOpen && modalType === "price" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Edit Premium Price
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Update the price for "{selectedReview?.title}"
            </p>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                min="0.99"
                step="0.01"
                className="w-full pl-8 border border-gray-300 rounded-md p-2"
                placeholder="4.99"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={updatePrice}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Review Modal */}
      {selectedReview && !modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedReview?.title}
              </h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <StarRating rating={selectedReview?.rating} />
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedReview?.voteCount} votes
                  </span>
                </div>
                <Badge status={selectedReview?.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Author</p>
                  <p className="font-medium">{selectedReview?.author?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{selectedReview?.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">
                    {selectedReview?.createdAt
                      ? formatDate(selectedReview.createdAt)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Purchase Source</p>
                  <p className="font-medium">
                    {selectedReview?.purchaseSource || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 mb-1">Description</p>
                <p className="text-sm">{selectedReview?.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
