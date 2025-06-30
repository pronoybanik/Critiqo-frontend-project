"use client";
import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  User,
  Calendar,
  Star,
  ShoppingCart,
  Crown,
  Unlock,
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

  // Truncate description for preview
  const truncatedDescription =
    description.length > 120
      ? `${description.substring(0, 120)}...`
      : description;

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        );
      } else if (i - 0.5 === rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400/50" />
        ); // Half star
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />); // Empty star
      }
    }
    return stars;
  };

  return (
    <div className="group relative ">
      {/* Premium Glow Effect */}
      {isPremium && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-sm"></div>
      )}

      {/* Main Card */}
      <div className="relative lg:h-[550px] bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
        {/* Header Section */}
        <div className="relative">
          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold shadow-lg">
                <Crown className="w-3 h-3" />
                PREMIUM
              </div>
            </div>
          )}

          {/* Free Badge */}
          {!isPremium && (
            <div className="absolute top-4 left-4 z-20">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-lg">
                <Unlock className="w-3 h-3" />
                FREE
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium border border-gray-200/50 shadow-sm">
              {category}
            </span>
          </div>

          {/* Image Section */}
          <div className="relative w-full h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
            {images && images.length > 0 ? (
              <Image
                height={150}
                width={200}
                src={images[0] || "https://ibb.co.com/DPrkCYxq"}
                alt={title}
                style={{ objectFit: "contain" }}
                className="transition-all duration-700 group-hover:scale-105 max-h-40"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No Image Available
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Title & Rating */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
              {title}
            </h2>

            {/* Rating & Purchase Source */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(rating)}</div>
                <span className="text-sm font-medium text-gray-600">
                  {rating.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center text-gray-500 text-sm">
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                <span className="font-medium">{purchaseSource}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <p
              className={`text-gray-600 text-sm leading-relaxed line-clamp-3 ${
                isPremium && (!user || user?.subscription === false)
                  ? "blur-[2px] select-none"
                  : ""
              }`}
            >
              {truncatedDescription}
            </p>

            {/* Blur Overlay for Premium Content */}
            {isPremium && (!user || user?.subscription === false) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-white/90 flex items-center justify-center">
                <div className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border">
                  Premium Content
                </div>
              </div>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500 space-x-3">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1.5" />
                <span className="font-medium">{author}</span>
              </div>

              <span className="text-gray-300">•</span>

              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <MessageCircle className="w-4 h-4 mr-1.5 text-blue-500" />
              <span className="font-medium">{comments}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {!isPremium ? (
              // Free review: allow everyone
              <SecondaryButton
                handler={() => router.push(`/reviews/${id}`)}
                className="w-full py-3 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all duration-300 hover:shadow-lg"
              >
                Read Full Review
              </SecondaryButton>
            ) : user?.subscription === true ? (
              // Premium review: user has subscription
              <SecondaryButton
                handler={() => router.push(`/reviews/${id}`)}
                className="w-full py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 transition-all duration-300 hover:shadow-lg"
              >
                Read Premium Review
              </SecondaryButton>
            ) : !userInfo ? (
              // Premium review: no user logged in
              <SecondaryButton
                handler={() =>
                  toast.error("Please login to access premium reviews")
                }
                className="w-full py-3 text-sm font-semibold rounded-xl bg-gray-600 hover:bg-gray-700 text-white border-0 transition-all duration-300"
              >
                <Crown className="w-4 h-4 mr-2" />
                Login to Unlock
              </SecondaryButton>
            ) : (
              // Premium review: logged in but no subscription
              <Link href="/payment" className="block">
                <SecondaryButton className="w-full py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 transition-all duration-300 hover:shadow-lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </SecondaryButton>
              </Link>
            )}
          </div>

          {/* Premium Price Footer */}
          {isPremium && premiumPrice && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 -mx-6 -mb-6 px-6 py-4 border-t border-amber-100/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Premium Content
                  </span>
                </div>
                <span className="text-lg font-bold text-amber-700">
                  ${premiumPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestReviewCard;
