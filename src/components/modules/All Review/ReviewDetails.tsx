"use client"
import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, CheckCircle, Loader2, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image';
import CommentComponent from './CommentComponent';
import { Comment, Review } from '@/types/review';
import { addComment, addVotes } from '@/services/Review';
import { useUser } from '@/context/UserContext';
import VoteCounter from './VottingComponent';
import { toast } from 'sonner';
import ReviewDescription from './ReviewDescription';
import { useRouter } from 'next/navigation';
import { deleteReview } from '@/services/AdminReview';

// Mock data types (replace with your actual types from your GraphQL schema or Prisma)


// Mock data - replace with your actual data fetching (e.g., GraphQL query)
const mockReview: Review = {
  id: "review-123",
  title: 'Amazing Product Review',
  description:
    'This product is absolutely amazing! I was blown away by the quality and features.  It exceeded all my expectations. I would highly recommend it to anyone looking for a great [product category].  The battery life is incredible, the screen is bright and clear, and the performance is top-notch.  I especially loved the [specific feature] and the [another feature].  It\'s definitely worth the price.',
  rating: 5,
  purchaseSource: 'Amazon',
  images: [
    'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Jisulife_FA45_NeckFan_Pro1_5000mAh_With_-JISULIFE-fbade-330914.png',

  ],
  isPremium: true,
  premiumPrice: 29.99,
  status: 'PUBLISHED',
  moderationNote: null,
  createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  categoryId: 'electronics',
  userId: 'user-456',
  authorName: 'Jane Doe',
  authorImage: 'https://placehold.co/100x100/EEE/31343C?text=JD',  // Example image URL
  authorProfession: 'Tech Enthusiast',
};


const getStatusBadgeVariant = (status: Review['status']) => {
  switch (status) {
    case 'DRAFT':
      return 'secondary';
    case 'PUBLISHED':
      return 'default';
    case 'REJECTED':
      return 'destructive';
  }
};

const getStatusBadgeText = (status: Review['status']) => {
  switch (status) {
    case 'DRAFT':
      return 'Draft';
    case 'PUBLISHED':
      return 'Published';
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

export const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />); // Full star
    } else if (i - 0.5 === rating) {
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400/50" />); // Half star
    } else {
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400" />); // Empty star
    }
  }
  return <div className="flex items-center">{stars}</div>;
};



const ReviewDetailsCard = (reviewDetails: any) => {
  const [review, setReview] = useState<Review | null>(null);
  // const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userComment, setUserComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  // const [myReviewVotes, setMyReviewVotes] = useState(10);
  const { user } = useUser();
  const router = useRouter();
  console.log(reviewDetails)
  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        // Replace this with your actual data fetching logic (e.g., GraphQL query)
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        setReview(mockReview);
        // setComments(mockComments);
        setLoading(false);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddComment = async () => {
    if (!userComment.trim()) return;

    setSubmittingComment(true);
    try {
      // Simulate sending comment to server
      await new Promise(resolve => setTimeout(resolve, 500));
      const newComment: Partial<Comment> = {
        content: userComment,
        reviewId: `${reviewDetails?.review?.id}`, // Replace with actual user ID

      }
      console.log(newComment)
      addComment(newComment)
      setUserComment("");
    } catch (error: any) {
      console.error("Failed to add comment", error);
      setError(error instanceof Error ? error.message : 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Review not found.
      </div>
    );
  }
  const handleVoteChange = async (newVotes: number, type: 'upvote' | 'downvote') => {
    // console.log(`New vote count: ${newVotes}, Vote type: ${type}`);

    const vote = {
      reviewId: `${reviewDetails?.review?.id}`,
      voteType: `${type}`
    }

    try {
      const res = await addVotes(vote);
      console.log(res)
      if (res.success) {
        toast.success("Request sent successfully");

      }
    } catch (err: any) {
      console.error(err)
    }
    console.log(vote)

  };

  const handleDelete = async () => {
    try {
      const res = await deleteReview(reviewDetails?.review?.id);
      console.log(res)
      if (res.success) {
        toast.success("Review delete successfully");
        router.push('/reviews')
      }
    } catch (err: any) {
      console.error(err)
    }
  }
  const reviewId = reviewDetails?.review?.id
  console.log(reviewId)

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gray-50 border-gray-800 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-950">{reviewDetails?.review?.title}</CardTitle>
                <div className='flex gap-2 items-center'>
                  <StarRating rating={reviewDetails?.review?.rating} />
                  <span className="text-gray-500 text-sm">({reviewDetails?.review?.rating} out of 5)</span>
                </div>
                <CardDescription className="text-gray-800">
                  Posted: {format(new Date(reviewDetails?.review?.createdAt), 'yyyy-MM-dd')}
                </CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(reviewDetails?.review?.status)}>{getStatusBadgeText(reviewDetails?.review?.status)}</Badge>
            </div>

            <div className='grid grid-cols-3 '>
              <div className='col-span-2'>

                {/* Author Info */}
                <div className="flex items-center gap-4 mt-4">
                  <img
                    src={review.authorImage}
                    alt={review.authorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-950 font-semibold">{review.authorName}</p>
                    <p className="text-gray-400 text-sm">{review.authorProfession}</p>
                  </div>
                </div>

              </div>
              <div className='shadow-xl bg-gray-100 col-span-1 rounded-xl'>
                <VoteCounter initialVotes={reviewDetails?.review?.votes.upvotes}
                  dVotes={reviewDetails?.review?.votes.downvotes}
                  onVoteChange={handleVoteChange}></VoteCounter>

              </div>

            </div>


          </CardHeader>
          <CardContent>

            {reviewDetails?.review?.images && reviewDetails?.review?.images.length > 0 && (
              <Carousel className="w-full">
                <CarouselContent>
                  {reviewDetails?.review?.images?.map((image: string, index: number) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/6">
                      <div className="p-1">
                        <Image
                          src={image}
                          height={50}
                          width={50}
                          alt={`Product Image ${index + 1}`}
                          className="w-full h-auto rounded-md "
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
            <ReviewDescription description={reviewDetails?.review?.description} />

            <div className="mt-6 flex justify-between gap-4 items-center">
              <div className='flex flex-wrap gap-4 items-center'>
                {reviewDetails?.review?.purchaseSource && (
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-600">Purchase Source: {review.purchaseSource}</span>
                  </div>
                )}
                {reviewDetails?.review?.isPremium && (
                  <Badge className="bg-yellow-800/80 text-yellow-300 border-yellow-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Premium Review
                    {reviewDetails?.review?.premiumPrice && (
                      <span className="ml-1.5"> (+${reviewDetails?.review?.premiumPrice.toFixed(2)})</span>
                    )}
                  </Badge>
                )}
                {/* Add Category Badge */}
                {reviewDetails?.review?.categoryId && (
                  <Badge className="bg-purple-800/80 text-purple-300 border-purple-700">
                    Category: {reviewDetails?.review?.category}
                  </Badge>
                )}
              </div>


              <div className="flex space-x-4">
                {/* Update Button with Tooltip and Animated Border */}
                {
                  user?.id === reviewDetails?.review?.authorId && (
                    <div className="relative group">
                      <button className="p-2 rounded border border-transparent hover:border-blue-500 transition-all duration-300 text-blue-600 hover:text-blue-800"

                      >
                        <Pencil size={20} />
                      </button>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Update
                      </div>
                    </div>)
                }

                {/* Delete Button with Tooltip and Animated Border */}
                {
                  user?.id === reviewDetails?.review?.authorId || user?.role === 'ADMIN' ? (
                    <div className="relative group">
                      <button className="p-2 rounded border border-transparent hover:border-red-500 transition-all duration-300 text-red-600 hover:text-red-800"
                        onClick={handleDelete}
                      >
                        <Trash2 size={20} />
                      </button>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Delete
                      </div>
                    </div>
                  ) : ""
                }
              </div>


            </div>

          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="mt-8 bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Comments
            </CardTitle>
            <CardDescription className="text-gray-400">
              Read what others have to say about this review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewDetails?.review?.comments?.map((comment: any) => (
                <CommentComponent
                  key={comment.id}
                  comment={comment}

                // reviewId={reviewId}
                />
              ))}
            </div>
            {/* Add Comment Input */}
            <div className="mt-6">
              <Textarea
                placeholder="Add your comment..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="bg-gray-800 text-white border-gray-700"
                disabled={submittingComment}
              />
              <Button
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleAddComment}
                disabled={submittingComment}
              >
                {submittingComment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}

              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewDetailsCard;

