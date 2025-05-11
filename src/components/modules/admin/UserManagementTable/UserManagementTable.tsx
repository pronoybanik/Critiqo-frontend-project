"use client";

import { useState } from "react";
import { Eye, RotateCcw, Trash2 } from "lucide-react";
import { deleteUser } from "@/services/User";
import UserDetailsModal from "./UserDetailsModal";
import { TUser } from "@/types/user";
import { toast } from "sonner";
import DeleteConfirmationModal from "@/components/ui/core/NMModal/DeleteConfirmationModal";

const UserManagementTable = ({ users: initialUsers }: { users: TUser[] }) => {
  const [users, setUsers] = useState<TUser[]>(initialUsers);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const viewUserDetails = (user: TUser) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

  const handleDeleteClick = (user: TUser) => {
    setSelectedItem({ id: user.id, name: user.guest?.name || user.email });
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    const result = await deleteUser(selectedItem.id);
    if (result.success) {
      setUsers((prev) => prev.filter((user) => user.id !== selectedItem.id));
      toast.success(result.message);
    } else {
      toast.error(result.message || "There was an error.");
    }

    setModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Role</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Created At</th>
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">{user.guest?.name || "N/A"}</td>
                <td className="py-3 px-4 text-sm">{user.email}</td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowStatusDropdown(showStatusDropdown === user.id ? "" : user.id)
                      }
                      className={`px-2 py-1 rounded-full text-xs flex items-center ${
                        user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                      <RotateCcw className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">{formatDate(user.createdAt)}</td>
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
                      disabled={user.role === "ADMIN"}
                      onClick={() => handleDeleteClick(user)}
                      className={`p-1 ${
                        user.role === "ADMIN"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800"
                      }`}
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

      {/* Details Modal */}
      <UserDetailsModal
        isOpen={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        user={selectedUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        name={selectedItem?.name || ""}
        isOpen={isModalOpen}
        onOpenChange={setModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default UserManagementTable;
