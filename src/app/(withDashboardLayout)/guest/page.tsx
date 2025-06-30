"use client";

import { 
  Star, 
  User, 
  MessageSquare, 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  Clock, 
  ArrowRight,
  Sparkles,
  Target,
  Gift,
  Calendar,
  Bell,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const dashboardCards = [
    {
      id: "reviews",
      title: "My Reviews",
      description: "Your published reviews, all in one place",
      icon: <Star size={28} className="text-white" />,
      color: "from-orange-400 to-red-500",
      hoverColor: "hover:from-orange-500 hover:to-red-600",
      link: "/guest/myreviews",
      stats: "12 Reviews",
      badge: "Active"
    },
    {
      id: "purchases",
      title: "My Purchases",
      description: "View your order history and status",
      icon: <ShoppingBag size={28} className="text-white" />,
      color: "from-green-400 to-emerald-500",
      hoverColor: "hover:from-green-500 hover:to-emerald-600",
      link: "/guest/mypurchases",
      stats: "8 Orders",
      badge: "Recent"
    },
    {
      id: "profile",
      title: "My Profile",
      description: "Manage your account and preferences",
      icon: <User size={28} className="text-white" />,
      color: "from-blue-400 to-indigo-500",
      hoverColor: "hover:from-blue-500 hover:to-indigo-600",
      link: "/profile",
      stats: "85% Complete",
      badge: null
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "purchase",
      title: "New purchase completed",
      description: "Premium Wireless Headphones - $299.99",
      time: "Today, 10:45 AM",
      icon: <ShoppingBag className="text-green-500" />,
      color: "border-green-500 bg-green-50",
      status: "completed"
    },
    {
      id: 2,
      type: "review",
      title: "Review published",
      description: "You gave Smart Watch Pro 5 stars",
      time: "Yesterday, 3:22 PM",
      icon: <Star className="text-orange-500" />,
      color: "border-orange-500 bg-orange-50",
      status: "published"
    },
    {
      id: 3,
      type: "comment",
      title: "New comment reply",
      description: "Someone replied to your review on Gaming Laptop X1",
      time: "May 2, 2025",
      icon: <MessageSquare className="text-blue-500" />,
      color: "border-blue-500 bg-blue-50",
      status: "new"
    },
    {
      id: 4,
      type: "achievement",
      title: "Achievement unlocked",
      description: "You've written 10 helpful reviews!",
      time: "May 1, 2025",
      icon: <Award className="text-purple-500" />,
      color: "border-purple-500 bg-purple-50",
      status: "achievement"
    }
  ];

  const quickStats = [
    { label: "Total Reviews", value: "12", icon: Star, color: "text-orange-500" },
    { label: "This Month", value: "3", icon: Calendar, color: "text-blue-500" },
    { label: "Avg Rating", value: "4.8", icon: Award, color: "text-yellow-500" },
    { label: "Helpful Votes", value: "47", icon: TrendingUp, color: "text-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm mb-2">
                <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                Welcome Back
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1">Track your reviews, purchases, and activity</p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                <div className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards?.map((card) => (
            <Link href={card.link} key={card.id}>
              <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${card.color} ${card.hoverColor} p-6 transition-all duration-300`}>
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {card.icon}
                    </div>
                    {card.badge && (
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-xs font-medium">{card.badge}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{card.description}</p>
                  
                  {card.stats && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-500">{card.stats}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activity
                </h3>
                <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-start p-4 border-l-4 ${activity.color} rounded-xl hover:shadow-md transition-all duration-300 group cursor-pointer`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {activity.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                          {activity.title}
                        </p>
                        {activity.status === "new" && (
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                        {activity.description}
                      </p>
                      <p className="text-gray-500 text-xs mt-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Achievements */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Write Review</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Browse Products</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Notifications</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-600" />
                Achievements
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Review Expert</p>
                    <p className="text-sm text-gray-600">10 helpful reviews</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Early Adopter</p>
                    <p className="text-sm text-gray-600">Joined in beta</p>
                  </div>
                </div>

                <div className="text-center pt-3">
                  <p className="text-sm text-gray-500">2 more achievements to unlock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}