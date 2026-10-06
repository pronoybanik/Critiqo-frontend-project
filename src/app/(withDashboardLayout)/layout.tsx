"use client"
import React from "react";
import AdminSideBar from "@/components/modules/admin/AdminSideBar";
import AdminHeader from "@/components/modules/admin/AdminHeader";
import { useUser } from "@/context/UserContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  return (
    <div>
      {/* <DashBoardNavBar /> */}
      <div className="flex min-h-screen min-w-0 bg-gray-100">
        {/* Sidebar */}
        {user?.role === "ADMIN" ? <AdminSideBar /> : null}
        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />
          {/* Main Dashboard Content */}
          <main className="min-w-0 flex-1 overflow-y-auto bg-gray-100 p-3 sm:p-6">
            {/* Metric Cards */}
            <>{children}</>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
