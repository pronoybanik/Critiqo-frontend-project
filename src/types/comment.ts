export type TComment = {
    id: string;
  content: string;
  reviewId: string;
  userId: string;
  author: string;
  authorId: string;
  parentId?: string;
  createdAt: string; // or Date
  updatedAt: string;
  replies?: TComment[];
  }
  