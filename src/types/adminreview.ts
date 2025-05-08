export type TAdminReview = {
    id: string;
    title: string;
    name:string;
    description: string;
    rating: number;
    purchaseSource: string;
    images: string[];
    isPremium: boolean;
    premiumPrice: number | null;
    status: "PUBLISHED" | "DRAFT" | "REJECTED" |"pending"; // Add other statuses if needed
    moderationNote: string;
    categoryId: string;
    categoryName: string;
    userId: string;
    userName: string;
    userEmail: string;
    userRole: "GUEST" | "USER" | "ADMIN"; // Extend based on roles in your system
    votes: number;
    comments: number;
    createdAt: string; // Consider `Date` if you’ll convert it
    updatedAt: string; // Same as above
  };
  