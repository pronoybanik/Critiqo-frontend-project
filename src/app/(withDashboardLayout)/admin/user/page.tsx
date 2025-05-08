import UserTable from "@/components/modules/admin/UserManagementTable/UserManagementTable";
import { getAllUser } from "@/services/User";
import React from "react";

const UserPage = async () => {
  const response = await getAllUser();
  const userData = response?.data || [];

  return (
    <div className="p-4">
      {userData.length > 0 ? (
        <UserTable users={userData} />
      ) : (
        <div className="text-center text-gray-500 py-10">
          No users found.
        </div>
      )}
    </div>
  );
};

export default UserPage;
