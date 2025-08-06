/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  Star,
  ShoppingCart,
  CheckCircle,
  Loader2,
  MessageCircle,
  Pencil,
  Trash2,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  SendIcon,
  PaperclipIcon,
  MessageCircleWarning,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import CommentComponent from "./CommentComponent";
import { addComment, addVotes } from "@/services/Review";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import ReviewDescription from "./ReviewDescription";
import { useRouter } from "next/navigation";
import { deleteReview } from "@/services/AdminReview";

export const StarRating = ({
  rating,
  maxRating = 5,
}: {
  rating: number;
  maxRating?: number;
}) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    if (i <= rating) {
      stars.push(
        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
      ); // Full star
    } else if (i - 0.5 === rating) {
      stars.push(
        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400/50" />
      ); // Half star
    } else {
      stars.push(<Star key={i} className="w-5 h-5 text-amber-400" />); // Empty star
    }
  }
  return <div className="flex items-center">{stars}</div>;
};

const getStatusBadgeVariant = (status: any) => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-200 text-gray-800";
    case "PUBLISHED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "APPROVED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ReviewDetailsCard = (reviewDetails: any) => {
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userComment, setUserComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  // Mock data - replace with your actual data fetching
  const mockReview: any = {
    id: "review-123",
    title: "Amazing Product Review",
    description:
      "This product is absolutely amazing! I was blown away by the quality and features. It exceeded all my expectations. I would highly recommend it to anyone looking for a great [product category]. The battery life is incredible, the screen is bright and clear, and the performance is top-notch. I especially loved the [specific feature] and the [another feature]. It's definitely worth the price.",
    rating: 5,
    purchaseSource: "Amazon",
    images: [
      "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Jisulife_FA45_NeckFan_Pro1_5000mAh_With_-JISULIFE-fbade-330914.png",
    ],
    isPremium: true,
    premiumPrice: 29.99,
    status: "PUBLISHED",
    moderationNote: "note",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    categoryId: "electronics",
    userId: "user-456",
    authorName: "Jane Doe",
    authorImage: "https://placehold.co/100x100/EEE/31343C?text=JD", // Example image URL
    authorProfession: "Tech Enthusiast",
  };

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        setReview(mockReview);
        setLoading(false);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddComment = async () => {
    if (!userComment.trim()) return;

    setSubmittingComment(true);
    try {
      // Simulate sending comment to server
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newComment: any = {
        content: userComment,
        reviewId: `${reviewDetails?.review?.id}`,
      };
      addComment(newComment);
      setUserComment("");
      toast.success("Comment added successfully");
    } catch (error: any) {
      console.error("Failed to add comment", error);
      setError(
        error instanceof Error ? error.message : "Failed to post comment"
      );
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVoteChange = async (
    newVotes: number,
    type: "upvote" | "downvote"
  ) => {
    const vote = {
      reviewId: `${reviewDetails?.review?.id}`,
      voteType: `${type}`,
    };

    try {
      const res = await addVotes(vote);
      if (res.success) {
        toast.success("Vote recorded successfully");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to record vote");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteReview(reviewDetails?.review?.id);
      if (res.success) {
        toast.success("Review deleted successfully");
        router.push("/reviews");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin w-10 h-10 text-indigo-600 mb-2" />
          <p className="text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Not Found</h3>
          <p className="text-gray-600">
            The requested review could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Main Review Card */}
        <Card className="overflow-hidden border-0 shadow-xl rounded-xl mb-8">
          {/* Header with cover background */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {reviewDetails?.review?.title}
                </h1>
                <div className="flex gap-3 items-center">
                  <StarRating rating={reviewDetails?.review?.rating} />
                  <span className="text-white/90 font-medium">
                    {reviewDetails?.review?.rating} out of 5
                  </span>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeVariant(
                  reviewDetails?.review?.status
                )}`}
              >
                {reviewDetails?.review?.status}
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            {/* Author and date section */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-full overflow-hidden border-2 border-indigo-100">
                  <Image
                    width={48}
                    height={48}
                    src={review.authorImage}
                    alt={review.author}
                    className="w-12 h-12 object-cover"
                  />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    {reviewDetails.review.author}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {review.authorProfession}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {format(
                  new Date(reviewDetails?.review?.createdAt),
                  "MMM d, yyyy"
                )}
              </div>
            </div>

            {/* Image carousel */}
            {reviewDetails?.review?.images && (
              <div className="p-6 bg-gray-50 flex justify-center">
                <div className="overflow-hidden rounded-lg shadow-md bg-white p-4">
                  <Image
                    src={
                      typeof reviewDetails.review.images === "string"
                        ? reviewDetails.review.images
                        : reviewDetails.review.images[0]
                    }
                    height={300}
                    width={300}
                    alt="Product Image"
                    className="w-full h-72 object-contain rounded"
                  />
                </div>
              </div>
            )}

            {/* Review content */}
            <div className="p-6">
              <div className="prose max-w-none text-gray-700">
                <ReviewDescription
                  description={reviewDetails?.review?.description}
                />
              </div>

              {/* Tags and badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                {reviewDetails?.review?.purchaseSource && (
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Purchased on {review.purchaseSource}</span>
                  </div>
                )}

                {reviewDetails?.review?.isPremium && (
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      Premium Review{" "}
                      {reviewDetails?.review?.premiumPrice?.toFixed(2)}
                    </span>
                  </div>
                )}

                {reviewDetails?.review?.categoryId && (
                  <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm">
                    <span>
                      Category:{" "}
                      {reviewDetails?.review?.category || "Electronics"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Voting section */}
            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVoteChange(0, "upvote")}
                      className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <span className="font-medium">
                      {reviewDetails?.review?.votes?.upvotes || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVoteChange(0, "downvote")}
                      className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                    <span className="font-medium">
                      {reviewDetails?.review?.votes?.downvotes || 0}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {user?.id === reviewDetails?.review?.authorId && (
                    <Button
                      onClick={() =>
                        router.push(
                          `/guest/myreviews/${reviewDetails?.review?.id}`
                        )
                      }
                      variant="outline"
                      className="flex items-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </Button>
                  )}

                  {(user?.id === reviewDetails?.review?.authorId ||
                    user?.role === "ADMIN") && (
                    <Button
                      onClick={handleDelete}
                      variant="outline"
                      className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section 1 */}
        {/* <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              <CardTitle className="text-xl font-bold">Comments</CardTitle>
            </div>
            <CardDescription className="text-gray-300">
              Join the conversation about this review
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6 bg-white text-black p-4 rounded-3xl">
              {reviewDetails?.review?.comments?.length > 0 ? (
                reviewDetails?.review?.comments?.map((comment: any) => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="w-full">
              <Textarea
                placeholder="Write your comment..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="w-full bg-white border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-3"
                disabled={submittingComment}
                rows={3}
              />
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
                onClick={handleAddComment}
                disabled={submittingComment}
              >
                {submittingComment ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Posting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Post Comment</span>
                  </div>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card> */}

        {/* // Comments Section 2  */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="p-2 bg-white/20 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">Comments</h3>
                  <p className="text-indigo-100 text-sm">
                    Join the conversation
                  </p>
                </div>
              </div>
              <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                {reviewDetails?.review?.comments?.length || 0}
              </span>
            </div>
          </div>

          {/* Comments Content */}
          <div className="p-5">
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {reviewDetails?.review?.comments?.length > 0 ? (
                reviewDetails?.review?.comments?.map((comment: any) => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))
              ) : (
                <div className="text-center py-10 px-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl inline-block mb-4">
                    <MessageCircleWarning className="w-10 h-10 mx-auto text-gray-400" />
                  </div>
                  <h4 className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                    No comments yet
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comment Form */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-900">
            <div className="mb-4 relative">
              <textarea
                placeholder="Add your comment..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent resize-none p-4 pr-12 min-h-24"
                disabled={submittingComment}
              />
              <div className="absolute right-3 bottom-3">
                <button
                  className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  type="button"
                >
                  <PaperclipIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Markdown supported
              </div>
              <button
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  submittingComment || !userComment.trim()
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                }`}
                onClick={handleAddComment}
                disabled={submittingComment || !userComment.trim()}
              >
                {submittingComment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <SendIcon className="w-4 h-4" />
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsCard;
