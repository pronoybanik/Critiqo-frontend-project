"use client";
import { useState } from "react";
import { format } from "date-fns";
import { deleteComment, replyComment } from "@/services/Review";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
      reviewId: comment.reviewId
    }
    try {

      const res = await replyComment(replyData)

      if (!res.ok) {

        throw new Error("Failed to send reply");
      } else {
        toast.success("Reply Added Succesfully")
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
        toast.success("Review deleted successfully");
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
    <div className="mb-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center" />
        <div>
          <p className="text-sm font-medium text-gray-200">{comment?.author}</p>
          <p className="text-sm text-gray-400">{format(new Date(comment.createdAt), "PPP")}</p>
          <p className="text-gray-300 mt-1">{comment.content}</p>
          <div className="flex gap-2">

            <button
              className="text-blue-400 text-sm mt-2 hover:underline"
              onClick={() => {
                if (comment.replies?.length) setShowReplies(!showReplies);
                else setShowReplyModal(true);
              }}
            >
              {comment.replies?.length && showReplies
                ? "Hide Replies"
                : comment.replies?.length
                  ? `View ${comment.replies.length} Replies`
                  : "Reply"}
            </button>
            {
              user?.id === comment?.authorId || user?.role === "ADMIN" && (

                <button>
                  <div className="relative group">
                    <button className="pt-2 rounded border border-transparent hover:border-red-500 transition-all duration-300 text-red-400 hover:text-red-800"
                      onClick={handleDelete}
                    >
                      <Trash2 size={15} />
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Delete
                    </div>
                  </div>
                </button>
              )
            }
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
        <div className="fixed inset-0 bg-gray-700 bg-opacity-10 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Write a Reply</h2>
            <textarea
              className="w-full h-24 border border-gray-300 p-2 rounded"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
