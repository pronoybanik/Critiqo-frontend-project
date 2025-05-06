import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
    role: string;
    status: string;
    needPasswordChange: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onOpenChange,
  user,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View profile information of the selected user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Name:</strong> {user.guest.name}</p>
          <p><strong>Name:</strong> {user.guest.contactNumber}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.contactNumber && <p><strong>Contact:</strong> {user.contactNumber}</p>}
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Needs Password Change:</strong> {user.needPasswordChange ? "Yes" : "No"}</p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
