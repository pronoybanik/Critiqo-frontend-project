import React from "react";
import { MessageCircle, Users, Activity, Star } from "lucide-react";

const Summary = () => {
  const data = {
    reviews: 12300,
    users: 5820,
    activities: 2345,
    comments: 8910,
  };

  return (
    <div className="mt-10">
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Reviews Card */}
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-l-4 border-purple-300 hover:shadow-xl transition-all">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Reviews</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {data.reviews.toLocaleString()}
                  </h3>
                </div>
                <div className="rounded-full p-3 bg-purple-400">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="h-1 w-full absolute bottom-0 left-0 bg-purple-300"></div>
            </div>

            {/* Users Card */}
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-l-4 border-blue-300 hover:shadow-xl transition-all">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Users</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {data.users.toLocaleString()}
                  </h3>
                </div>
                <div className="rounded-full p-3 bg-blue-400">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="h-1 w-full absolute bottom-0 left-0 bg-blue-300"></div>
            </div>

            {/* Activities Card */}
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-l-4 border-green-300 hover:shadow-xl transition-all">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Activities
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {data.activities.toLocaleString()}
                  </h3>
                </div>
                <div className="rounded-full p-3 bg-green-400">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="h-1 w-full absolute bottom-0 left-0 bg-green-200"></div>
            </div>

            {/* Comments Card */}
            <div className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-l-4 border-pink-300 hover:shadow-xl transition-all">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Comments</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {data.comments.toLocaleString()}
                  </h3>
                </div>
                <div className="rounded-full p-3 bg-pink-400">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="h-1 w-full absolute bottom-0 left-0 bg-pink-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
