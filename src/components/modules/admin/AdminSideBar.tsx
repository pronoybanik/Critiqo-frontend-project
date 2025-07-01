"use client";
import React, { useState } from "react";
import {
  Home,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  BarChart2,
  ChevronRight,
  LayoutDashboard,
  UsersRound,
  Settings,
  Bell,
  Shield,
  ChevronDown,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const AdminSideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedMenu, setExpandedMenu] = useState(null);

  const navItems = [
    {
      id: "Home",
      label: "Home",
      icon: <Home size={20} />,
      link: "/",
      color: "text-blue-400",
      hoverColor: "hover:bg-blue-500/20",
      description: "Back to main site"
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      link: "/admin",
      color: "text-purple-400",
      hoverColor: "hover:bg-purple-500/20",
      description: "Overview & analytics"
    },
    {
      id: "user",
      label: "All Users",
      icon: <UsersRound size={20} />,
      link: "/admin/user",
      color: "text-green-400",
      hoverColor: "hover:bg-green-500/20",
      description: "Manage users"
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star size={20} />,
      link: "/admin/reviews",
      color: "text-yellow-400",
      hoverColor: "hover:bg-yellow-500/20",
      description: "Review management",
      hasSubItems: true,
      subItems: [
        {
          id: "pending-reviews",
          label: "Pending Reviews",
          icon: <Clock size={18} />,
          link: "/admin/reviews",
          color: "text-orange-400",
          count: 5
        },
        {
          id: "published-reviews",
          label: "Published Reviews",
          icon: <CheckCircle size={18} />,
          link: "/admin/reviews",
          color: "text-green-400",
          count: 142
        },
        {
          id: "unpublished-reviews",
          label: "Unpublished Reviews",
          icon: <XCircle size={18} />,
          link: "/admin/reviews",
          color: "text-red-400",
          count: 8
        },
      ],
    },
    {
      id: "Category",
      label: "Categories",
      icon: <BarChart2 size={20} />,
      link: "/admin/createcategory",
      color: "text-indigo-400",
      hoverColor: "hover:bg-indigo-500/20",
      description: "Manage categories"
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubMenu = (itemId : any) => {
    setExpandedMenu(expandedMenu === itemId ? null : itemId);
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-72" : "w-20"
      } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-500 ease-in-out flex flex-col shadow-2xl border-r border-gray-700/50 relative overflow-hidden`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-2xl"></div>

      {/* Sidebar Header */}
      <div className="relative flex items-center justify-between p-6 border-b border-gray-700/50">
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Portal
              </h1>
              <p className="text-xs text-gray-400">Management Dashboard</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="relative w-8 h-8 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''} group-hover:text-blue-400`} 
          />
        </button>
      </div>

      {/* User Profile Section */}
      {sidebarOpen && (
        <div className="relative p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Admin User</p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-gray-400 text-xs">Online</p>
              </div>
            </div>
            <Settings className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <div>
                <Link href={item?.link || "#"}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.hasSubItems) {
                        toggleSubMenu(item.id);
                      }
                    }}
                    className={`group flex items-center justify-between w-full ${
                      sidebarOpen ? "px-4" : "px-3 justify-center"
                    } py-3 rounded-xl transition-all duration-300 hover:transform hover:scale-105 relative overflow-hidden
                      ${
                        activeTab === item.id 
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg border border-blue-500/30" 
                          : `${item.hoverColor || "hover:bg-gray-700/50"} hover:shadow-md`
                      }`}
                  >
                    {/* Active indicator */}
                    {activeTab === item.id && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-center flex-1">
                      <span className={`${item.color} group-hover:scale-110 transition-transform duration-300 ${sidebarOpen ? "mr-3" : ""}`}>
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <div className="flex-1">
                          <span className="font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                            {item.label}
                          </span>
                          {item.description && (
                            <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {sidebarOpen && item.hasSubItems && (
                      <ChevronDown 
                        size={16} 
                        className={`text-gray-400 transition-transform duration-300 ${
                          expandedMenu === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                </Link>

                {/* Sub Items */}
                {sidebarOpen && item.subItems && expandedMenu === item.id && (
                  <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.subItems.map((subItem) => (
                      <Link href={subItem?.link || "#"} key={subItem.id}>
                        <button
                          onClick={() => setActiveTab(subItem.id)}
                          className={`group flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-all duration-300 hover:transform hover:translate-x-1
                            ${
                              activeTab === subItem.id
                                ? "bg-gradient-to-r from-gray-700/80 to-gray-600/80 shadow-md border-l-2 border-blue-400"
                                : "hover:bg-gray-700/40"
                            }`}
                        >
                          <div className="flex items-center">
                            <span className={`${subItem.color} mr-3 group-hover:scale-110 transition-transform duration-300`}>
                              {subItem.icon}
                            </span>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                              {subItem.label}
                            </span>
                          </div>
                          
                          {subItem.count && (
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                              {subItem.count}
                            </div>
                          )}
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      {sidebarOpen && (
        <div className="relative p-4 border-t border-gray-700/50">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">System Status</p>
                <p className="text-green-400 text-xs">All systems operational</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Server Health</span>
                <span className="text-green-400">99.9%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full" style={{width: '99.9%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-4 space-x-2">
            <button className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
              <Bell className="w-4 h-4 text-gray-400 group-hover:text-yellow-400" />
            </button>
            <button className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group">
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSideBar;