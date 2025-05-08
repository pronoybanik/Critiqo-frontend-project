/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./ReviewDetails";
import Image from "next/image";

// Mock data for top-rated reviews (replace with your actual data)

const TopRatedReview = (featured: any) => {

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-950 mb-6">
          Top Rated Review
        </h2>
        <div className="grid grid-cols-1   gap-6">
          {featured?.featured?.highestRated?.map((review: any) => (
            <Card
              key={review.id}
              className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Image
                    width={100}
                    height={100}
                    src={review.image}
                    alt={review.title}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {review.title}
                    </CardTitle>
                    <p className="text-gray-500 text-sm">
                      {format(new Date(review.createdAt), "PPP")}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <Badge
                  variant="secondary"
                  className="text-gray-600 bg-gray-100 border-gray-200"
                >
                  {review.category}
                </Badge>
                <div className="flex gap-2 items-center">
                  <StarRating rating={review?.rating} />
                  <span className="text-gray-500 text-sm">
                    ({review?.rating} ) out of 5
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopRatedReview;
