"use client";

import { deleteReview } from "@/services/AdminReview";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const HandleLikeUnLineDelete = ({ id }: { id: string }) => {
  const handleDelete = async () => {
    const res = await deleteReview(id);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-gray-100 text-gray-600"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default HandleLikeUnLineDelete;
