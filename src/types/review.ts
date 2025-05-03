export interface Review {
  title: string;
  description: string;
  rating: number;
  purchaseSource?: string;
  images: string[];
  isPremium: boolean;
  premiumPrice?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'APPROVED' | 'REJECTED';
  moderationNote?: string;
  createdAt: string; // Store as ISO string
  categoryId: string;
  userId: string;
  id: string; // Add the ID
  authorName: string;       // Added author name
  authorImage: string;      // Added author image URL
  authorProfession: string; // Added author profession
}

export interface Comment {
  id?: string;
  content: string;
  reviewId: string;
  createdAt: string; // Store as ISO string
  replies?: Comment[]; // Nested replies (optional)
}