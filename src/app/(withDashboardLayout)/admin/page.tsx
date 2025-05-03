"use client";

import {
  Star,
  MessageCircle,
  Crown,
  DollarSign,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Trash2,
} from "lucide-react";

export default function Dashboard() {

  // Sample data for the dashboard
  const dashboardData = {
    totalReviews: 1248,
    publishedReviews: 876,
    pendingReviews: 128,
    unpublishedReviews: 244,
    totalEarnings: 1240,
    recentActivity: [
      {
        id: 1,
        title: "Amazing Restaurant Experience",
        author: "John Doe",
        type: "review",
        status: "pending",
        rating: 4.5,
        timestamp: "2 hours ago",
      },
      {
        id: 2,
        title: "This hotel was terrible",
        author: "Jane Smith",
        type: "comment",
        status: "pending",
        timestamp: "5 hours ago",
      },
      {
        id: 3,
        title: "Great service at this shop",
        author: "Alex Johnson",
        type: "premium",
        status: "pending",
        rating: 5,
        timestamp: "1 day ago",
      },
      {
        id: 4,
        title: "Average experience, nothing special",
        author: "Sam Wilson",
        type: "review",
        status: "pending",
        rating: 3,
        timestamp: "1 day ago",
      },
    ],
    topPremiumReviews: [
      {
        id: 1,
        title: "Ultimate Guide to Downtown Restaurants",
        author: "Food Critic Pro",
        rating: 4.8,
        earnings: 152,
        views: 1240,
      },
      {
        id: 2,
        title: "Luxury Hotel Comprehensive Review",
        author: "Travel Expert",
        rating: 4.9,
        earnings: 128,
        views: 987,
      },
      {
        id: 3,
        title: "Tourist Attractions Worth Your Money",
        author: "City Explorer",
        rating: 4.7,
        earnings: 98,
        views: 876,
      },
    ],
    monthlyEarnings: [
      { month: "Jan", amount: 850 },
      { month: "Feb", amount: 940 },
      { month: "Mar", amount: 1120 },
      { month: "Apr", amount: 980 },
      { month: "May", amount: 1240 },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Reviews
                </h3>
                <div className="bg-blue-100 rounded-full p-2">
                  <Star size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.totalReviews}
                </p>
              </div>
              <div className="flex mt-4 pt-4 border-t border-gray-100 justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Published</span>
                  <span className="text-sm font-medium text-green-600">
                    {dashboardData.publishedReviews}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {dashboardData.pendingReviews}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500">Unpublished</span>
                  <span className="text-sm font-medium text-red-600">
                    {dashboardData.unpublishedReviews}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Review Earnings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Premium Review Earnings
                </h3>
                <div className="bg-green-100 rounded-full p-2">
                  <DollarSign size={20} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">
                  ${dashboardData.totalEarnings}
                </p>
                <span className="ml-2 text-green-600 text-sm font-medium">
                  +12% ↑
                </span>
              </div>
              <div className="mt-4 h-16">
                <div className="flex justify-between h-full items-end">
                  {dashboardData.monthlyEarnings.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-green-500 w-8 rounded-t"
                        style={{
                          height: `${
                            (item.amount /
                              Math.max(
                                ...dashboardData.monthlyEarnings.map(
                                  (i) => i.amount
                                )
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                      <span className="text-xs mt-1">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Premium Reviews */}
            <div className="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Top Premium Reviews
                </h3>
                <div className="bg-purple-100 rounded-full p-2">
                  <Crown size={20} className="text-purple-600" />
                </div>
              </div>
              <div className="space-y-4">
                {dashboardData.topPremiumReviews.map((review, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-100 pb-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 truncate">
                        {review.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          <Star
                            size={14}
                            className="text-yellow-500 fill-current"
                          />
                          <span className="ml-1 text-xs text-gray-600">
                            {review.rating}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <div className="flex items-center">
                          <DollarSign size={14} className="text-green-500" />
                          <span className="ml-1 text-xs text-gray-600">
                            ${review.earnings}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <div className="flex items-center">
                          <Eye size={14} className="text-blue-500" />
                          <span className="ml-1 text-xs text-gray-600">
                            {review.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 mt-2">
                  View All Premium Reviews
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-700">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      {item.type === "review" && (
                        <Star size={16} className="text-blue-500 mr-2" />
                      )}
                      {item.type === "comment" && (
                        <MessageCircle
                          size={16}
                          className="text-gray-500 mr-2"
                        />
                      )}
                      {item.type === "premium" && (
                        <Crown size={16} className="text-purple-500 mr-2" />
                      )}
                      <p className="font-medium text-gray-800">{item.title}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500">By {item.author}</p>
                      {item.rating && (
                        <>
                          <span className="mx-2 text-gray-300">|</span>
                          <div className="flex items-center">
                            <Star
                              size={14}
                              className="text-yellow-500 fill-current"
                            />
                            <span className="ml-1 text-xs text-gray-600">
                              {item.rating}
                            </span>
                          </div>
                        </>
                      )}
                      <span className="mx-2 text-gray-300">|</span>
                      <p className="text-xs text-gray-500">{item.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 rounded hover:bg-green-100 text-green-600"
                      title="Approve"
                    >
                      <ThumbsUp size={18} />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                      title="Reject"
                    >
                      <ThumbsDown size={18} />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-gray-100 text-gray-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right">
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                View All Activity
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
