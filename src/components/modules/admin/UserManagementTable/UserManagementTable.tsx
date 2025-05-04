"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { getAllUser } from "@/services/User";

const UserManagementTable = () => {
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getAllUser();

      if (response.success) {
        const user = response?.data;
        setUsers(user);
      }
    };

    fetchProfile();
  }, []);

  const [users, setUsers] = useState([]);

  console.log("user", users);

  const [showStatusDropdown, setShowStatusDropdown] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

 
  const changeStatus = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setShowStatusDropdown("");
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Function to view user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Function to delete user
  const confirmDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirmation(true);
  };

  const deleteUser = () => {
    console.log("is delete");
    
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                Role
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                Created At
              </th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-sm">
                  {user.guest?.name || user.admin?.name || "N/A"}
                </td>
                <td className="py-3 px-4 text-sm">{user.email}</td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowStatusDropdown(
                          showStatusDropdown === user.id ? "" : user.id
                        )
                      }
                      className={`px-2 py-1 rounded-full text-xs flex items-center ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                      <RotateCcw className="ml-1 h-3 w-3" />
                    </button>

                    {showStatusDropdown === user.id && (
                      <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md py-1 w-32 border border-gray-200">
                        <button
                          onClick={() => changeStatus(user.id, "ACTIVE")}
                          className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 flex items-center"
                        >
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Active
                        </button>
                        <button
                          onClick={() => changeStatus(user.id, "INACTIVE")}
                          className="block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 flex items-center"
                        >
                          <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                          Inactive
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  {formatDate(user.createdAt)}
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewUserDetails(user)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-green-600 hover:text-green-800"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => confirmDeleteUser(user)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">User Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">ID</h4>
                <p className="text-sm">{selectedUser.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p className="text-sm">
                  {selectedUser.guest?.name ||
                    selectedUser.admin?.name ||
                    "N/A"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="text-sm">{selectedUser.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Role</h4>
                <p className="text-sm">{selectedUser.role}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <p className="text-sm">{selectedUser.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Need Password Change
                </h4>
                <p className="text-sm">
                  {selectedUser.needPasswordChange ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Created At
                </h4>
                <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Updated At
                </h4>
                <p className="text-sm">{formatDate(selectedUser.updatedAt)}</p>
              </div>
              {selectedUser.guest && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Contact Number
                  </h4>
                  <p className="text-sm">{selectedUser.guest.contactNumber}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Delete
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete user{" "}
              {selectedUser.guest?.name ||
                selectedUser.admin?.name ||
                selectedUser.email}
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;
