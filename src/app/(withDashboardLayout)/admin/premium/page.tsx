'use client';
import React from "react";

const PremiumPage = () => {
    return (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Create Premium Review</h2>
          <form className="space-y-4 max-w-lg">
            <input className="w-full border p-2 rounded" placeholder="Title" />
            <textarea className="w-full border p-2 rounded" placeholder="Description" />
            <input className="w-full border p-2 rounded" type="number" placeholder="Rating (0-5)" />
            <input className="w-full border p-2 rounded" placeholder="Category" />
            <input className="w-full border p-2 rounded" placeholder="Purchase Source" />
            <input className="w-full border p-2 rounded" type="number" placeholder="Price (USD)" />
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Create</button>
          </form>
        </div>
      );;
};

export default PremiumPage;
