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
  Search,
  Settings,
  Shield,
  Clock,
  MessageSquare,
  DollarSign,
  CheckCircle
} from "lucide-react";
import { getMyProfile, logout } from "@/services/AuthService";
import { useUser } from "@/context/UserContext";
import { IProfile } from "@/types/profile";
import Link from "next/link";
import { protectedRoutes } from "@/app/contants";
import { usePathname, useRouter } from "next/navigation";

const AdminHeader = () => {
  const { user: userInfo, setIsLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
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

  const notifications = [
    {
      id: 1,
      title: "New premium review submitted",
      time: "10 minutes ago",
      type: "review",
      icon: <PenTool className="w-4 h-4 text-blue-500" />,
      unread: true
    },
    {
      id: 2,
      title: "5 comments awaiting moderation",
      time: "1 hour ago",
      type: "comment",
      icon: <MessageSquare className="w-4 h-4 text-orange-500" />,
      unread: true
    },
    {
      id: 3,
      title: "Monthly earnings report ready",
      time: "2 hours ago",
      type: "report",
      icon: <DollarSign className="w-4 h-4 text-green-500" />,
      unread: true
    },
    {
      id: 4,
      title: "System backup completed",
      time: "3 hours ago",
      type: "system",
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 z-50 sticky top-0">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-110" 
            onClick={toggleSidebar}
          >
            {sidebarOpen ? 
              <X className="w-5 h-5 text-gray-600" /> : 
              <Menu className="w-5 h-5 text-gray-600" />
            }
          </button>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 Dashboard
              </h2>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 text-gray-500">
              <span className="text-gray-300">|</span>
              <Link
                href="/"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium">Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 transition-colors duration-300 ${searchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Search users, reviews, or analytics..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          
          {/* System Status */}
          <div className="hidden lg:flex items-center space-x-3 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">System Healthy</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-110 group"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Bell className="w-4 h-4 mr-2 text-blue-600" />
                      Notifications
                    </h3>
                    <div className="bg-blue-100 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-blue-700">{unreadCount} new</span>
                    </div>
                  </div>
                </div>
                
                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group ${
                        notification.unread ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                            {notification.title}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{notification.time}</p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Create Review Button */}
          {userInfo?.role === "GUEST" && (
            <Link href="/createReview">
              <button className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <PenTool className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span>Create Review</span>
              </button>
            </Link>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 group"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                {user?.name?.[0] ?? "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name ?? "Admin"}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role ?? "Administrator"}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
                {/* User Info Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                      {user?.name?.[0] ?? "A"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name ?? "Admin User"}</p>
                      <p className="text-sm text-gray-600">{user?.email ?? "admin@reviewportal.com"}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <p className="text-xs text-gray-500 capitalize">{user?.role ?? "Administrator"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/profile"
                    className="flex items-center w-full px-6 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">Profile Settings</span>
                      <p className="text-xs text-gray-500">Manage your account</p>
                    </div>
                  </Link>

                  <button className="flex items-center w-full px-6 py-3 text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-red-50 transition-all duration-300 group">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors duration-300">
                      <Settings className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-red-700">System Settings</span>
                      <p className="text-xs text-gray-500">Admin preferences</p>
                    </div>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-3 text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-300">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-red-700">Sign Out</span>
                      <p className="text-xs text-gray-500">Logout from admin panel</p>
                    </div>
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