/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';

const ReviewDescription = ({ description }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 300; // Change to your desired cutoff length

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const shouldTruncate = description && description.length > characterLimit;
  const displayText = isExpanded || !shouldTruncate
    ? description
    : description.slice(0, characterLimit) + '...';

  return (
    <div className="mt-6">
      <p className="text-gray-900 whitespace-pre-line">{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={toggleExpanded}
          className="mt-2 text-blue-600 font-medium hover:underline"
        >
          {isExpanded ? 'See less' : 'See more'}
        </button>
      )}
    </div>
  );
};

export default ReviewDescription;
