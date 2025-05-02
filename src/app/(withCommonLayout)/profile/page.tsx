"use client";
import { useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    firstName: "Pronoy",
    lastName: "Banik",
    email: "pronoybanik82@gmail.com",
    contact: "+1 (555) 123-4567",
    role: "Software Developer",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 text-blue-600">
          <Link href="/" className="hover:underline">
            <Home className="w-5 h-5" />
          </Link>
          <span>&gt;</span>
          <Link href="/account" className="hover:underline">
            My Account
          </Link>
        </div>

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex  items-center justify-between">
            <div className="flex items-center mb-12">
              <div className="rounded-full overflow-hidden border-4 border-blue-100 w-24 h-24">
                <img
                  src="/api/placeholder/150/150"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-semibold text-gray-700 ml-6">
                Hi {userData.firstName}
              </h2>
            </div>
            <div>
              <button>edit</button>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Personal Information
            </h3>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Contact - New Field */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Contact
                </label>
                <input
                  type="tel"
                  value={userData.contact}
                  onChange={(e) =>
                    setUserData({ ...userData, contact: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Role - New Field */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2 font-medium">
                  Role
                </label>
                <input
                  type="text"
                  value={userData.role}
                  onChange={(e) =>
                    setUserData({ ...userData, role: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
