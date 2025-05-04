"use client";
import React from "react";
import { MessageCircle, User, Calendar, Star, ShoppingCart, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { IReview } from "@/types/reviews";
import SecondaryButton from "../shared/SecondaryButton";



const LatestReviewCard = ({ review }: { review: IReview }) => {
  const router = useRouter();
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
    status
  } = review;

  // Format date to relative time (e.g. "2 days ago")
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  // Truncate description for preview
  const truncatedDescription = description.length > 120 ?
    `${description.substring(0, 120)}...` : description;

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ); // Full star
      } else if (i - 0.5 === rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400/50" />
        ); // Half star
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />); // Empty star
      }
    }
    return stars;
  };

  return (
    <div className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl rounded-xl">
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
          <CheckCircle className="w-3 h-3" />
          Premium
        </div>
      )}

      {/* Status Badge */}
      <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg
        ${status === "PUBLISHED" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
        <Clock className="w-3 h-3" />
        {status}
      </div>

      {/* Card Content */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:translate-y-[-4px]">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
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

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {truncatedDescription}
          </p>

          {/* Author & Date */}
          <div className="flex items-center text-xs text-gray-500 mb-4 border-t border-gray-100 pt-3">
            <User className="w-3 h-3 mr-1" />
            <span className="font-medium mr-2">{author}</span>
            <span className="mx-1">•</span>
            <Calendar className="w-3 h-3 mx-1" />
            <span>{formattedDate}</span>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 text-xs">
              <MessageCircle className="w-3 h-3 mr-1 text-indigo-700" />
              <span>{comments} </span>
            </div>

            <SecondaryButton
              handler={() => router.push(`/reviews/${id}`)}
              className="px-4 py-2 w-52  text-xs font-medium rounded-lg "
            >
              Read Review
            </SecondaryButton>
          </div>

          {/* Premium Price Tag */}
          {isPremium && premiumPrice && (
            <div className="mt-3 bg-gray-50 -mx-5 -mb-5 px-5 py-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Premium Content</span>
                <span className="text-sm font-bold text-green-600">${premiumPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestReviewCard;