export type TReview = {
  id: string;
  title: string;
  description: string;
  isPremium: boolean;
  premiumPrice: number | null;
  rating: number;
  purchaseSource: string;
  images: string[];
  status: "DRAFT" | "PUBLISHED" | "REJECTED"; 
  category: string;
  author: string;
  authorId: string;
  authorRole: "GUEST" | "USER" | "ADMIN"; 
  createdAt: string; 
  updatedAt: string;
  upvotes: number;
  comments: number;
  votes: number
};
