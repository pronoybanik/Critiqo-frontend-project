import {
  Star,
  Crown,
  DollarSign,
  Eye,
  Vote,
  DollarSignIcon,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import HandleLikeUnLineDelete from "../review/HandleLikeUnlineDelete";
import { getAllReviewAdmin } from "@/services/AdminReview";
import { TAdminReview } from "@/types/adminreview";
import { TReview } from "@/types/review";
import { getTotalEarning } from "@/services/Payment";

const AdminDashBoardPage = async () => {
  const data = await getAllReviewAdmin();
  const earningRes = await getTotalEarning();
  const totalEarning = earningRes?.data ?? 0;
  const reviewData = data?.data;

  const reviewCounts = reviewData?.reduce(
    (
      acc: { published: number; pending: number; unpublished: number },
      review: TAdminReview
    ) => {
      if (review.status === "PUBLISHED") acc.published += 1;
      else if (review.status === "DRAFT") acc.pending += 1;
      else acc.unpublished += 1;
      return acc;
    },
    { published: 0, pending: 0, unpublished: 0 }
  );

  // Calculate additional metrics
  const premiumReviews = reviewData?.filter((review: TAdminReview) => review.isPremium) || [];
  const avgRating = reviewData?.length 
    ? (reviewData.reduce((sum: number, review: TAdminReview) => sum + (review.rating || 0), 0) / reviewData.length).toFixed(1)
    : "0.0";

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1">Monitor and manage your platform performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Reviews Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Reviews</h3>
                  <p className="text-3xl font-bold text-gray-900">{reviewData?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Published</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{reviewCounts?.published || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600">{reviewCounts?.pending || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Unpublished</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{reviewCounts?.unpublished || 0}</span>
                </div>
              </div>
            </div>

            {/* Premium Earnings Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Premium Earnings</h3>
                  <p className="text-3xl font-bold text-gray-900">${Number(totalEarning).toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSignIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">+12.5%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            {/* Average Rating Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Average Rating</h3>
                  <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(parseFloat(avgRating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">({reviewData?.length} reviews)</span>
              </div>
            </div>

            {/* Premium Reviews Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Premium Reviews</h3>
                  <p className="text-3xl font-bold text-gray-900">{premiumReviews.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span className="text-purple-600 font-medium">
                  {reviewData?.length ? Math.round((premiumReviews.length / reviewData.length) * 100) : 0}%
                </span>
                <span className="text-gray-500">of total reviews</span>
              </div>
            </div>
          </div>

          {/* Top Premium Reviews Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Crown className="w-5 h-5 mr-2" />
                    Top Premium Reviews
                  </h3>
                  <div className="bg-white/20 px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">{premiumReviews.length} Premium</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {premiumReviews.slice(0, 5).map((review: TAdminReview, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          <p className="font-semibold text-gray-800 truncate">{review.title}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-gray-600 font-medium">{review.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600 font-medium">${review.premiumPrice}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600 font-medium">{review.votes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {premiumReviews.length === 0 && (
                  <div className="text-center py-12">
                    <Crown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No premium reviews yet</p>
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    View All Premium Reviews
                    <BarChart3 className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Quick Actions
              </h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Manage Reviews</span>
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200">→</div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">View Earnings</span>
                  </div>
                  <div className="text-green-600 group-hover:translate-x-1 transition-transform duration-200">→</div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">User Management</span>
                  </div>
                  <div className="text-purple-600 group-hover:translate-x-1 transition-transform duration-200">→</div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Analytics</span>
                  </div>
                  <div className="text-orange-600 group-hover:translate-x-1 transition-transform duration-200">→</div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activity
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Updates</span>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {reviewData?.slice(0, 10).map((item: TReview, index: number) => (
                <div
                  key={index}
                  className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.isPremium 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}>
                          {item.isPremium ? (
                            <Crown className="w-4 h-4 text-white" />
                          ) : (
                            <Star className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                            {item.title}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>By {item.author}</span>
                            {item.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span>{item.rating}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Vote className="w-3 h-3 text-blue-500" />
                              <span>{item.votes} votes</span>
                            </div>
                            <span>
                              {(() => {
                                const createdDate = new Date(item.createdAt);
                                const now = new Date();
                                const diffTime = Math.abs(now.getTime() - createdDate.getTime());
                                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                
                                if (diffDays === 0) return "Today";
                                if (diffDays === 1) return "1 day ago";
                                return `${diffDays} days ago`;
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <HandleLikeUnLineDelete id={item.id} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 text-center border-t border-gray-100">
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                View All Activity
                <Activity className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashBoardPage;