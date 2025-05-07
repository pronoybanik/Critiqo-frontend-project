import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { getMyProfile } from "@/services/AuthService";
import Image from "next/image";
import SecondaryButton from "@/components/shared/SecondaryButton";

const ProfileSection = async () => {
  const userDataResponse = await getMyProfile();
  const userData = userDataResponse?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8 text-purple-700 font-bold">
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
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <div className="rounded-full overflow-hidden border-4 border-blue-100 w-24 h-24">
                <Image
                  width={200}
                  height={200}
                  src={
                    userData?.profilePhoto || "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-3xl font-semibold text-gray-700 ml-6">
                Hi {userData?.name}
              </h2>
            </div>
            <Link href={`/profile/edit`}>
              <SecondaryButton>Edit</SecondaryButton>
            </Link>
          </div>

          {/* Personal Information Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Personal Information
            </h3>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  value={userData?.name || ""}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Contact
                </label>
                <input
                  type="tel"
                  value={userData?.contactNumber || ""}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Role
                </label>
                <input
                  type="text"
                  value={userData?.role || ""}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
