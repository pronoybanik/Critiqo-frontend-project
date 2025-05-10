"use client";
import { useState } from "react";
import { format } from "date-fns";
import { deleteComment, replyComment } from "@/services/Review";
import { toast } from "sonner";
import {
  Trash2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { TComment } from "@/types/comment";

const CommentComponent: React.FC<{ comment: TComment }> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { user } = useUser();

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    const replyData = {
      content: replyText,
      parentId: comment.id,
      reviewId: comment.reviewId,
    };
    try {
      const res = await replyComment(replyData);

      if (res.success) {
        toast.success("Comment add sucessfuly");
        setReplyText("");
      } else {
        toast.error("Comment Not add");
      }

      setReplyText("");
      setShowReplyModal(false);
      // Optional: refresh data or use SWR/mutate to update UI
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteComment(comment?.id);
      if (res.success) {
        toast.success("Comment deleted successfully");
        // router.push('/reviews')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred", err);
      }
    }
  };

  return (
    <div className="mb-4 p-4 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-800 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
          <User size={18} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-100">{comment?.author}</h4>
              <p className="text-xs text-gray-400">
                {format(new Date(comment.createdAt), "PPP")}
              </p>
            </div>

            {(user?.id === comment?.authorId || user?.role === "ADMIN") && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300 group"
                aria-label="Delete comment"
              >
                <Trash2 size={16} />
                <span className="absolute -top-8 right-0 bg-gray-900 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Delete
                </span>
              </button>
            )}
          </div>

          <div className="mt-2 text-gray-200 text-sm">{comment.content}</div>

          <div className="mt-3 flex items-center gap-4">
            <button
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-all duration-200"
              onClick={() => {
                if (comment.replies?.length) setShowReplies(!showReplies);
                else setShowReplyModal(true);
              }}
            >
              {comment.replies?.length ? (
                <>
                  {showReplies ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  <span>
                    {showReplies ? "Hide" : `View ${comment.replies.length}`}
                    {comment.replies.length === 1 ? " Reply" : " Replies"}
                  </span>
                </>
              ) : (
                <>
                  <MessageCircle size={14} />
                  <span>Reply</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showReplies &&
        comment.replies?.map((reply) => (
          <div key={reply.id} className="mt-4 pl-8">
            <CommentComponent comment={reply} />
          </div>
        ))}

      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Reply to comment
            </h2>
            <textarea
              className="w-full h-32 bg-gray-700 border border-gray-600 p-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
            />
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200 disabled:opacity-50"
                disabled={!replyText.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentComponent;
