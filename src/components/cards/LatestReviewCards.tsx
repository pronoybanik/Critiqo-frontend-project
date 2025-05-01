import React from 'react';
import { MessageCircle, User, Calendar, Star } from 'lucide-react';
import { cn } from "@/lib/utils" // Utility for combining class names
import Image from 'next/image';

interface ProductReviewCardProps {
  imageUrl: string;
  title: string;
  category: string;
  author: string;
  postedDate: string;
  commentCount: number;
  rating: number;
}

const LatestReviewCard: React.FC<ProductReviewCardProps> = ({
  imageUrl,
  title,
  category,
  author,
  postedDate,
  commentCount,
  rating,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />); // Full star
      } else if (i - 0.5 === rating) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400/50" />); // Half star
      }
      else {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />); // Empty star
      }
    }
    return stars;
  };
  return (
    <div>

      <div className={cn(
        "bg-gray-800", // Light background, adjust opacity as needed
        "rounded-lg shadow-md",
        "p-4 md:p-6",
        "transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.01]", // Subtle hover effect
        "border border-gray-800/50", // Add a border that matches the background
      )}>
        {/* Image */}
        <div className="relative w-full h-60 aspect-video mb-4 rounded-lg overflow-hidden bg-blue-50">
          <Image
            src={imageUrl}
            alt={title}
            height={150}
            width={250}
            // layout="fill"
            // objectFit="cover"
            className="transition-transform duration-300 hover:scale-105 p-2" // Image zoom on hover
          />
        </div>

        {/* Title and Category */}
        <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {title}
        </h2>
        <p className="text-sm text-white mb-4 ">
          Category: <span className="font-medium bg-[#e8d5d5] p-1 rounded-full text-[#C24340]">{category}</span>
        </p>

        {/* Star Rating */}
        <div className="flex items-center mb-4">
          {renderStars(rating)}
          <span className="text-sm text-gray-400 ml-2">({rating} out of 5)</span>
        </div>

        {/* Author and Posted Date */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User className="w-4 h-4 mr-1" />
          <span>{author}</span>
          <span className="mx-2">•</span>
          <Calendar className="w-4 h-4 mr-1" />
          <span>{postedDate}</span>
        </div>

        {/* Comment Count */}
        <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
          <div className='flex items-center'>

            <MessageCircle className="w-4 h-4 mr-1" />
            <span>{commentCount} Comments</span>
          </div>
          <button
            type="submit"
            className="px-1 md:px-6 py-2 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-[#C24340] rounded-lg  hover:bg-gray-600 focus:bg-[#C24340] focus:outline-none ml-2"
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestReviewCard