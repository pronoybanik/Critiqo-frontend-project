export interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUser {
    name: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'GUEST';
}

export interface IReview {
    id: string;
    title: string;
    description: string;
    rating: number;
    isPremium: boolean;
    comments: "";
    author: "";
    premiumPrice: number | null;
    purchaseSource: string;
    images: string[];
    status: 'PUBLISHED' | 'PENDING' | 'REJECTED';
    moderationNote: string | null;
    categoryId: string;
    userId: string;
    postId: string | null;
    category: string;
    user: IUser;
    authorId: string;
    authorRole: string;
    createdAt: string;
    updatedAt: string;
}
