"use client";

import { deleteReview } from "@/services/Review";
import { Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const HandleLikeUnLineDelete = ({
  id,
}: //   status,
{
  id: string;
  //   status: string;
}) => {
  //   const handleLike = async () => {
  // if (status !== "PUBLISHED") {
  //   toast.error("Voting is only allowed on published reviews.");
  //   return;
  // }

  // const data = {
  //   reviewId: id,
  //   voteType: "upvote",
  // };

  // const res = await VoteSubmit(data);
  // console.log(res);
  // if (res.success) {
  //   toast.success(res.message);
  // } else {
  //   toast.error(res.message);
  // }
  //   };

  //   const handleUnLike = async () => {
  // if (status !== "PUBLISHED") {
  //   toast.error("Voting is only allowed on published reviews.");
  //   return;
  // }

  // const data = {
  //   reviewId: id,
  //   voteType: "downvote",
  // };

  // // const res = await VoteSubmit(data);
  // // console.log(res);
  // // if (res.success) {
  // //   toast.success(res.message);
  // // } else {
  // //   toast.error(res.message);
  // // }
  //   };

  const handleDelete = async () => {
    const res = await deleteReview(id);
    console.log(res);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* <button
        onClick={() => handleUnLike()}
        className="p-1 rounded hover:bg-green-100 text-green-600"
        title="Approve"
      >
        <ThumbsUp size={18} />
      </button>
      <button
        onClick={() => handleUnLike()}
        className="p-1 rounded hover:bg-red-100 text-red-600"
        title="Reject"
      >
        <ThumbsDown size={18} />
      </button> */}
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
