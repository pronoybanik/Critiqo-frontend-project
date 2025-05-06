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
} from "lucide-react";
import Link from "next/link";

const AdminSideBar = () => {
  // Sidebar navigation items
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const navItems = [
    {
      id: "Home",
      label: "Home",
      icon: <Home size={20} />,
      link: "/",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      link: "/admin",
    },
    {
      id: "user",
      label: "All user",
      icon: <UsersRound size={20} />,
      link: "/admin/user",
    },

    {
      id: "reviews",
      label: "Reviews",
      icon: <Star size={20} />,
      link: "/admin/reviews",
      subItems: [
        {
          id: "pending-reviews",
          label: "Pending Reviews",
          icon: <Clock size={18} />,
          link: "/admin/reviews",
        },
        {
          id: "published-reviews",
          label: "Published Reviews",
          icon: <CheckCircle size={18} />,
        },
        {
          id: "unpublished-reviews",
          label: "Unpublished Reviews",
          icon: <XCircle size={18} />,
        },
      ],
    },
 
    {
      id: "Category",
      label: "Create Category",
      icon: <BarChart2 size={20} />,
      link: "/admin/createcategory",
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-indigo-800 text-white transition-all duration-300 ease-in-out flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-700">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold">Review Portal</h1>
        ) : (
          <h1 className="text-xl font-bold">RP</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-indigo-700 rounded-full p-1"
        >
          {sidebarOpen ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronRight size={20} className="transform rotate-180" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {navItems.map((item) => (
            <Link href={`${item?.link}`} key={item.id} className="mb-1">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center  w-full ${
                  sidebarOpen ? "px-6" : "px-4 justify-center"
                } py-3 hover:bg-indigo-700 
                    ${
                      activeTab === item.id ? "bg-indigo-700 py-2" : ""
                    } rounded-lg transition-colors duration-200 `}
              >
                <span className={sidebarOpen ? "mr-3" : ""}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>

              {sidebarOpen && item.subItems && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <button
                        onClick={() => setActiveTab(subItem.id)}
                        className={`flex items-center w-full px-4 py-2 hover:bg-indigo-700 
                            ${
                              activeTab === subItem.id ? "bg-indigo-700" : ""
                            } rounded-lg transition-colors duration-200`}
                      >
                        <span className="mr-3">{subItem.icon}</span>
                        <span className="text-sm">{subItem.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSideBar;
