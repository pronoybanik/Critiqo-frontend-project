"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PenTool,
  Home,
} from "lucide-react";
import { getMyProfile, logout } from "@/services/AuthService";
import { useUser } from "@/context/UserContext";
import { IProfile } from "@/types/profile";
import PrimaryButton from "@/components/shared/PrimayButton";
import Link from "next/link";
import { protectedRoutes } from "@/app/contants";
import { usePathname, useRouter } from "next/navigation";

const AdminHeader = () => {
  const { user: userInfo, setIsLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [user, setUser] = useState<IProfile | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    logout();
    setIsLoading(true);
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getMyProfile();
      setUser(userData?.data);
    };
    fetchUser();
  }, []);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button className="md:hidden mr-4" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-2 font-bold ">
            <h2 className="text-xl font-semibold bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent">
              Dashboard Overview
            </h2>
            <>
              <span className="text-purple-700 font-bold">&gt;</span>
              <Link
                href="/"
                className="hover:underline mt-2 text-purple-700 font-bold"
              >
                <Home className="w-5 h-5 font-bold" />
              </Link>
            </>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">
                      New premium review submitted
                    </p>
                    <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
                  </div>
                  <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">
                      5 comments awaiting moderation
                    </p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">
                      Monthly earnings report ready
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-200 text-center">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {userInfo?.role === "GUEST" ? (
            <Link href={"/createReview"}>
              <PrimaryButton className="flex items-center space-x-1 w-38 text-white px-4 py-2 rounded-lg">
                <PenTool size={16} />
                <span>Create Review</span>
              </PrimaryButton>
            </Link>
          ) : null}

          {/* User Menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {user?.name?.[0] ?? "A"}
              </div>
              <ChevronDown size={16} />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium text-gray-800">
                    {user?.name ?? "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email ?? "admin@reviewportal.com"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.role ?? "NULL"}
                  </p>
                </div>
                <div>
                  <Link
                    href={"/profile"}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    <User size={16} className="mr-2 text-gray-600" />

                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2 text-gray-600" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
