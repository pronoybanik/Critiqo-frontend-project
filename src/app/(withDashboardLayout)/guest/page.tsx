"use client";

import { Star, User, MessageSquare, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const dashboardCards = [
    {
      id: "reviews",
      title: "My Reviews",
      description: "Your published reviews, all in one place",
      icon: <Star size={24} className="text-white" />,
      color: "bg-orange-400",
      link: "/guest/myreviews",
    },

    {
      id: "purchases",
      title: "My Purchases",
      description: "View your order history and status",
      icon: <ShoppingBag size={24} className="text-white" />,
      color: "bg-green-500",
      link: "/guest/mypurchases",
    },

    {
      id: "profile",
      title: "My Profile",
      description: "Add your industry",
      icon: <User size={24} className="text-white" />,
      color: "bg-gray-500",
      link: "/profile",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50  container mx-auto">
          {
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardCards?.map((card) => (
                  <Link href={card.link} key={card.id}>
                    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`p-2 rounded-full ${card.color}`}>
                            {card.icon}
                          </div>
                          <h3 className="ml-3 text-lg font-medium text-gray-900">
                            {card.title}
                          </h3>
                        </div>
                        <p className="text-gray-600">{card.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          }

          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h3>
                <button className="text-blue-600 hover:text-blue-800">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start p-3 border-l-4 border-green-500 bg-green-50 rounded">
                  <ShoppingBag className="text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">New purchase completed</p>
                    <p className="text-gray-600 text-sm">
                      Product XYZ - $99.99
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Today, 10:45 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 border-l-4 border-orange-500 bg-orange-50 rounded">
                  <Star className="text-orange-500 mr-3" />
                  <div>
                    <p className="font-medium">Review published</p>
                    <p className="text-gray-600 text-sm">
                      You gave Product ABC 4 stars
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Yesterday, 3:22 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <MessageSquare className="text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">New comment reply</p>
                    <p className="text-gray-600 text-sm">
                      Someone replied to your comment on Product DEF
                    </p>
                    <p className="text-gray-500 text-xs mt-1">May 2, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
