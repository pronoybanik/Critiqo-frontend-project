"use client"
import { useState } from "react";

import { format } from 'date-fns';
import { Comment } from "@/types/review";

const CommentComponent: React.FC<{ comment: Comment }> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="mb-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
      <div className="flex items-start gap-3">
        {/* User Avatar (Replace with actual user image) */}
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          {/* <span className="text-white text-sm">
            {comment.reviewId.substring(0, 2).toUpperCase()}
          </span> */}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-200">{comment.reviewId}</p>
          <p className="text-sm text-gray-400">
            {format(new Date(comment.createdAt), 'PPP')}
          </p>
          <p className="text-gray-300 mt-1">{comment.content}</p>
          {comment.replies && comment.replies.length > 0 && (
            <button
              className="text-blue-400 text-sm mt-2 hover:underline"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? 'Hide Replies' : `View ${comment.replies.length} Replies`}
            </button>
          )}
        </div>
      </div>
      {showReplies &&
        comment.replies?.map((reply) => (
          <div key={reply.id} className="mt-4 pl-8">
            <CommentComponent comment={reply} />
          </div>
        ))}
    </div>
  );
};

export default CommentComponent