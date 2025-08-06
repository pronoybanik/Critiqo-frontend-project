"use client";
import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  User,
  Calendar,
  Star,
  ShoppingCart,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import SecondaryButton from "../shared/SecondaryButton";
import { TReview } from "@/types/review";
import { getMyProfile } from "@/services/AuthService";
import Link from "next/link";
import { TUser } from "@/types/user";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

const LatestReviewCard = ({ review }: { review: TReview }) => {
  const { user: userInfo } = useUser();
  const [user, setUser] = useState<TUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getMyProfile();
      setUser(userData?.data);
    };
    fetchUser();
  }, []);

  if (!review) return null;
  const {
    id,
    title,
    description,
    isPremium,
    premiumPrice,
    author,
    category,
    comments,
    createdAt,
    images,
    purchaseSource,
    rating,
  } = review;


  

  // Format date to relative time (e.g. "2 days ago")
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  // Truncate description to max 12 words
  const truncateDescription = (text: string, maxWords = 12) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  const truncatedDescription = truncateDescription(description);

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        );
      } else if (i - 0.5 === rating) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 text-yellow-400 fill-yellow-400/50"
          />
        ); // Half star
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />); // Empty star
      }
    }
    return stars;
  };

  return (
    <div className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col rounded-xl">
      {/* Status Badge */}
      <div
        className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg
        ${!isPremium ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}
      >
        <Clock className="w-3 h-3" />
        {isPremium ? "PREMIUM" : "FREE"}
      </div>

      {/* Card Content */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:translate-y-[-4px] h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex justify-center items-center rounded-t-xl">
          {images ? (
            <Image
              height={120}
              width={150}
              src={images || "https://ibb.co.com/DPrkCYxq"}
              alt={title}
              style={{ objectFit: "contain" }}
              className="transition-transform duration-500 group-hover:scale-110 object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category & Source */}
          <div className="flex justify-between items-center mb-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
              {category}
            </span>
            <div className="flex items-center text-gray-500 text-xs">
              <ShoppingCart className="w-3 h-3 mr-1" />
              {purchaseSource}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h2>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex mr-2">{renderStars(rating)}</div>
            <span className="text-sm text-gray-500">({rating.toFixed(1)})</span>
          </div>

          {/* Description - Fixed to 2 lines */}
          <div className="mb-3 min-h-[3.5rem]">
            <p
              className={`text-sm line-clamp-2 ${
                isPremium && (!user || user?.subscription === false)
                  ? "blur-xs"
                  : ""
              }`}
            >
              {truncatedDescription}
            </p>
          </div>

          {/* Author & Date */}
          <div className="flex items-center text-xs text-gray-500 mb-4 border-t border-gray-100 pt-3">
            <User className="w-3 h-3 mr-1" />
            <span className="font-medium mr-2">{author}</span>
            <span className="mx-1">•</span>
            <Calendar className="w-3 h-3 mx-1" />
            <span>{formattedDate}</span>
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500 text-xs">
                <MessageCircle className="w-3 h-3 mr-1 text-indigo-700" />
                <span>{comments} </span>
              </div>

              {!isPremium ? (
                <SecondaryButton
                  handler={() => router.push(`/reviews/${id}`)}
                  className="px-4 py-2 w-52 text-xs font-medium rounded-lg"
                >
                  Read Review
                </SecondaryButton>
              ) : user?.subscription === true ? (
                <SecondaryButton
                  handler={() => router.push(`/reviews/${id}`)}
                  className="px-4 py-2 w-52 text-xs font-medium rounded-lg"
                >
                  Read Review
                </SecondaryButton>
              ) : !userInfo ? (
                <SecondaryButton
                  handler={() =>
                    toast.error("Please login to access premium reviews")
                  }
                  className="px-4 py-2 w-52 text-xs font-medium rounded-lg"
                >
                  Unlock full review
                </SecondaryButton>
              ) : (
                <Link href="/payment">
                  <SecondaryButton className="px-4 py-2 w-52 text-xs font-medium rounded-lg">
                    Unlock full review
                  </SecondaryButton>
                </Link>
              )}
            </div>

            {/* Premium Price Tag */}
            {isPremium && premiumPrice && (
              <div className="mt-3 bg-gray-50 -mx-5 -mb-5 px-5 py-3 border-t border-gray-100 rounded-b-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Premium Content</span>
                  <span className="text-sm font-bold text-green-600">
                    ${premiumPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestReviewCard;
