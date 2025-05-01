import React from 'react';
import {
  MessageCircle, // Comments
  Users,       // Users
  Activity,    // Activities
  Star,          // Reviews, Ratings
} from 'lucide-react';
import { cn } from "@/lib/utils" // Utility for combining class names




const Summary = () => {

  const data = {
    reviews: 12500,
    users: 5820,
    activities: 2345,
    comments: 8910,
  };
  return (
    <div className='mt-10'>
      <div className="bg-gray-800  py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Reviews/Ratings Card */}
            <div className={cn(
              "flex items-center gap-4 p-6 rounded-lg",
              "bg-gradient-to-r from-purple-500/10 to-purple-600/10",
              "border border-purple-500/20",
              "shadow-lg"
            )}>
              <Star className="w-10 h-10 text-purple-400" />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {data.reviews.toLocaleString()}
                </h3>
                <p className="text-gray-400">Reviews</p>
              </div>
            </div>

            {/* Users Card */}
            <div className={cn(
              "flex items-center gap-4 p-6 rounded-lg",
              "bg-gradient-to-r from-blue-500/10 to-blue-600/10",
              "border border-blue-500/20",
              "shadow-lg "
            )}>
              <Users className="w-10 h-10 text-blue-400" />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {data.users.toLocaleString()}
                </h3>
                <p className="text-gray-400">Users</p>
              </div>
            </div>

            {/* Activities Card */}
            <div className={cn(
              "flex items-center gap-4 p-6 rounded-lg",
              "bg-gradient-to-r from-green-500/10 to-green-600/10",
              "border border-green-500/20",
              "shadow-lg"
            )}>
              <Activity className="w-10 h-10 text-green-400" />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {data.activities.toLocaleString()}
                </h3>
                <p className="text-gray-400">Activities</p>
              </div>
            </div>

            {/* Comments Card */}
            <div className={cn(
              "flex items-center gap-4 p-6 rounded-lg",
              "bg-gradient-to-r from-pink-500/10 to-pink-600/10",
              "border border-pink-500/20",
              "shadow-lg"
            )}>
              <MessageCircle className="w-10 h-10 text-pink-400" />
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {data.comments.toLocaleString()}
                </h3>
                <p className="text-gray-400">Comments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Summary;