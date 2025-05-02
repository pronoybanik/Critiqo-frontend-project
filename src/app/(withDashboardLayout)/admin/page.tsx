"use client";

import { Heart, Star, Gift, User, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export default function AdminDashBoardPage() {
  const cards = [
    {
      title: "create category",
      description: "Access your favorites here",
      icon: <Heart className="text-orange-500 w-8 h-8" />,
      link: "/admin/createcategory"
    },
    {
      title: "My premium",
      description: "Your published reviews, all in one place",
      icon: <Star className="text-yellow-500 w-8 h-8" />,
      link: "/admin/premium"
    },
    {
      title: "My Rewards",
      description: "Claim your rewards and discover new review offers!",
      icon: <Gift className="text-orange-400 w-8 h-8" />,
      link: "/admin/reviews"
    },
    {
      title: "My Profile",
      description:
        "Add your industry, job function, company size to get personalized picks",
      icon: <User className="text-blue-500 w-8 h-8" />,
      link: "/profile"
    },
  ];

  return (
    <div className="px-6 md:px-16 py-8 bg-gray-50 min-h-screen ">
      {/* Breadcrumb */}
      <div className=" container mx-auto">
        <div className="flex items-center text-sm text-gray-600 space-x-2 mb-4">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">My Account</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">My Account</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 container mx-auto">
        {cards.map((card) => (
          <Link href={card?.link}
            key={card.title}
            className="border rounded-md p-5 bg-white hover:shadow transition"
          >
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-2 rounded-full bg-orange-50">{card.icon}</div>
              <h2 className="text-lg font-semibold">{card.title}</h2>
            </div>
            <p className="text-sm text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
