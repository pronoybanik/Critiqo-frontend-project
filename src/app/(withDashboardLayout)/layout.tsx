import React from "react";
import AdminSideBar from "@/components/modules/admin/AdminSideBar";
import AdminHeader from "@/components/modules/admin/AdminHeader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* <DashBoardNavBar /> */}

      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}

        <AdminSideBar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />

          {/* Main Dashboard Content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
            {/* Metric Cards */}
            <>{children}</>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
