/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";
import {
  Star,
  MessageCircle,
  ThumbsUp,
  Trash2,
  Filter,
  ChevronDown,
  Edit,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import SecondaryButton from "@/components/shared/SecondaryButton";
import { deleteReview, getAllUserReviews } from "@/services/AdminReview";
import { TAdminReview } from "@/types/adminreview";
import { useRouter } from "next/navigation";

interface Review {
  createdAt: string; // or Date, depending on your data
  rating: number;
  upvotes: number;
}

const MyReviewsPage = () => {
  const { user } = useUser();
  const route = useRouter();
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  // const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        const data = await getAllUserReviews(user.userId);

        setReviews(data.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load your reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user?.userId]);

  // Filter reviews based on active tab
  const filteredReviews: Review[] = Array.isArray(reviews)
    ? reviews.filter((review: TAdminReview) => {
        if (activeTab === "all") return true;
        if (activeTab === "published") return review.status === "PUBLISHED";
        if (activeTab === "draft") return review.status === "DRAFT";
        if (activeTab === "premium") return review.isPremium;
        return true;
      })
    : [];

  console.log("test", filteredReviews);

  // Sort reviews
  const sortedReviews = [...filteredReviews]?.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "highest") {
      return b.rating - a.rating;
    }
    if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    if (sortBy === "most-upvotes") {
      return b.upvotes - a.upvotes;
    }
    return 0;
  });

  // Helper function to render the rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId: string) => {
    const deleteRes = await deleteReview(reviewId);
    if (deleteRes.success) {
      toast.success(deleteRes.message);
      route.push("/guest");
      route.refresh();
    }
    route.push("/guest");
  };

  // Handle edit review

  // const handleEditReview = (reviewId: string) => {
  //   // Implement edit logic here
  //   console.log(`Edit review with ID: ${reviewId}`);
  // };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-full" />
          </CardFooter>
        </Card>
      ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Reviews</h1>
        <p className="text-gray-600 mt-2">
          Manage all your product reviews in one place
        </p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Sort
              <ChevronDown size={16} className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("newest")}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("oldest")}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("highest")}>
              Highest Rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("lowest")}>
              Lowest Rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("most-upvotes")}>
              Most Upvotes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        renderSkeletons()
      ) : sortedReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No reviews found</h3>
          <p className="text-gray-500 mb-4">
            {activeTab === "all"
              ? "You haven't written any reviews yet."
              : `You don't have any ${activeTab} reviews.`}
          </p>
          <Link
            className="flex items-center justify-center mt-4"
            href="/createReview"
          >
            <SecondaryButton className="w-52 ">
              Create Your First Review
            </SecondaryButton>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review: any) => (
            <Card key={review.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {review.image && (
                  <div className="w-full md:w-1/4 h-40 md:h-auto">
                    <Image
                      width={200}
                      height={200}
                      src={review?.image}
                      alt={review.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`flex flex-col flex-1 ${
                    review.image ? "md:w-3/4" : "w-full"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {review.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {renderRating(review.rating)}
                          <span className="text-sm text-gray-500">
                            {format(new Date(review.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.isPremium && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Premium
                          </Badge>
                        )}
                        {/* <Badge
                          variant={
                            review.status === "PUBLISHED"
                              ? "success"
                              : "outline"
                          }
                          className={
                            review.status === "PUBLISHED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {review.status}
                        </Badge> */}

                        <Badge
                          variant="default"
                          className={
                            review.status === "PUBLISHED"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {review.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      {review.desciption.length > 200
                        ? `${review.desciption.substring(0, 200)}...`
                        : review.desciption}
                    </p>
                    <div className="flex items-center space-x-4 mt-4">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp size={14} />
                        {review.upvotes}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <MessageCircle size={14} />
                        {review.comments}
                      </Badge>
                      <Badge variant="outline">{review.category}</Badge>
                    </div>
                  </CardContent>
                  <div className="mt-4 ml-4 p-4 w-96 my-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md shadow-sm">
                    <strong className="block font-semibold mb-1">
                      Admin Note:
                    </strong>
                    <span className="font-bold ">
                      {review?.moderationNote || "No notes available."}
                    </span>
                  </div>

                  <CardFooter className="flex justify-end gap-2 pt-0">
                    {review?.status === "PUBLISHED" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          route.push(`/guest/myreviews/${review?.id}`)
                        }
                      >
                        <Edit size={16} className="mr-2" /> Edit
                      </Button>
                    ) : null}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;
