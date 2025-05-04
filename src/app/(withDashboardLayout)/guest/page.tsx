"use client"

import { useState } from 'react';
import { Heart, Star, Gift, User, MessageSquare, ShoppingBag } from 'lucide-react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rating, setRating] = useState(0);
  
  const dashboardCards = [
    {
      id: 'saved',
      title: 'Saved Products',
      description: 'Access your favorites here',
      icon: <Heart size={24} className="text-white" />,
      color: 'bg-orange-400',
    },
    {
      id: 'reviews',
      title: 'My Reviews',
      description: 'Your published reviews, all in one place',
      icon: <Star size={24} className="text-white" />,
      color: 'bg-orange-400',
    },
    {
      id: 'comments',
      title: 'My Comments',
      description: 'Track discussions you ve participated in',
      icon: <MessageSquare size={24} className="text-white" />,
      color: 'bg-blue-500',
    },
    {
      id: 'purchases',
      title: 'My Purchases',
      description: 'View your order history and status',
      icon: <ShoppingBag size={24} className="text-white" />,
      color: 'bg-green-500',
    },
    {
      id: 'rewards',
      title: 'My Rewards',
      description: 'Claim your rewards and discover new review offers!',
      icon: <Gift size={24} className="text-white" />,
      color: 'bg-purple-500',
    },
    {
      id: 'profile',
      title: 'My Profile',
      description: 'Add your industry, job function, company size to get personalized picks',
      icon: <User size={24} className="text-white" />,
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setActiveTab(card.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`p-2 rounded-full ${card.color}`}>
                          {card.icon}
                        </div>
                        <h3 className="ml-3 text-lg font-medium text-gray-900">{card.title}</h3>
                      </div>
                      <p className="text-gray-600">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                    <button className="text-blue-600 hover:text-blue-800">View all</button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start p-3 border-l-4 border-green-500 bg-green-50 rounded">
                      <ShoppingBag className="text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">New purchase completed</p>
                        <p className="text-gray-600 text-sm">Product XYZ - $99.99</p>
                        <p className="text-gray-500 text-xs mt-1">Today, 10:45 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 border-l-4 border-orange-500 bg-orange-50 rounded">
                      <Star className="text-orange-500 mr-3" />
                      <div>
                        <p className="font-medium">Review published</p>
                        <p className="text-gray-600 text-sm">You gave Product ABC 4 stars</p>
                        <p className="text-gray-500 text-xs mt-1">Yesterday, 3:22 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                      <MessageSquare className="text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium">New comment reply</p>
                        <p className="text-gray-600 text-sm">Someone replied to your comment on Product DEF</p>
                        <p className="text-gray-500 text-xs mt-1">May 2, 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'create-review' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Create a New Review</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Product
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2">
                    <option>Select a product</option>
                    <option>Product A</option>
                    <option>Product B</option>
                    <option>Product C</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill={rating >= star ? 'currentColor' : 'none'}
                        size={24}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Title
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
                    placeholder="Summarize your experience"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Details
                  </label>
                  <textarea
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
                    placeholder="Share your experience with this product..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Photos (optional)
                  </label>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        Drag and drop images or click to upload
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-3 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Other tab content would go here */}
          {activeTab !== 'dashboard' && activeTab !== 'create-review' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">
                Content for {menuItems.find(item => item.id === activeTab)?.label} goes here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}