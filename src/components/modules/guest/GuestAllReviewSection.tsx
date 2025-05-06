// "use client";

// import { getAllUserReviews } from "@/services/Review";
// import React, { useEffect, useState } from "react";

// interface GuestAllReviewSectionProps {
//   id?: string;
// }

// const GuestAllReviewSection: React.FC<GuestAllReviewSectionProps> = ({ id }) => {
//   const [reviewsData, setReviewsData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Only fetch if id is defined and not empty
//     if (!id) return;

//     let isMounted = true; // prevent state update if unmounted

//     const fetchReviews = async () => {
//       try {
//         const data = await getAllUserReviews(id);
//         if (isMounted) {
//           setReviewsData(data);
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Failed to fetch reviews:", error);
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchReviews();

//     return () => {
//       isMounted = false; // cleanup to avoid memory leak
//     };
//   }, [id]); // This should NOT trigger infinitely if `id` is stable

//   if (loading) return <div>Loading reviews...</div>;

//   return (
//     <div>
//       {reviewsData.length === 0 ? (
//         <p>No reviews found.</p>
//       ) : (
//         reviewsData.map((review, index) => (
//           <div key={index}>{review.content}</div> // Adjust as needed
//         ))
//       )}
//     </div>
//   );
// };

// export default GuestAllReviewSection;
