"use client";
import React from "react";
import AdminSideBar from "@/components/modules/admin/AdminSideBar";
import AdminHeader from "@/components/modules/admin/AdminHeader";
import { useUser } from "@/context/UserContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return (
    <div className="flex h-screen max-h-screen w-full overflow-hidden bg-gray-100">
      {/* Strict Fixed Sidebar */}
      {user?.role === "ADMIN" ? (
        <aside className="h-full shrink-0 flex">
          <AdminSideBar />
        </aside>
      ) : null}

      {/* Main Panel Area */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Strict Fixed Navbar/Header */}
        <header className="shrink-0 z-30">
          <AdminHeader />
        </header>

        {/* Scrollable Main Content */}
        <main
          id="dashboard-scroll"
          className="min-w-0 flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-gray-100 p-3 sm:p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

