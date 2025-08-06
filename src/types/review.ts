export type TReview = {
  id: string;
  title: string;
  description: string;
  isPremium: boolean;
  premiumPrice: number | null;
  rating: number;
  purchaseSource: string;
  images: string;
  image: string
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


export interface TGuestReview {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string | null;
  isPremium: boolean;
  rating: number;
  upvotes: number;
  comments: number;
  status: "PUBLISHED" | "DRAFT" | "REJECTED"; // extend as needed
  moderationNote: string;
  createdAt: string; // or Date, depending on how you use it
}

