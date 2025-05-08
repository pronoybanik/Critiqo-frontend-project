export type TUser = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  profilePhoto: string | null;
  role: "GUEST" | "USER" | "ADMIN"; // Extend as needed
  status: "ACTIVE" | "INACTIVE" | "BANNED"; // Extend as needed
  isDeleteAt: boolean;
  needPasswordChange: boolean;
  createdAt: string; // Or `Date` if parsed
  updatedAt: string;
  admin: null ; 
  guest?: {
    contactNumber: string;
    createdAt: string;
    email: string;
    id: string;
    isDeleteAt: boolean;
    name: string;
    profilePhoto: string | null;
    updatedAt: string;
  };
};


export type TUserToken = {
  id: string;
  userId: string;
  email: string;
  role: 'ADMIN' | 'GUEST' | 'USER'; // Add other roles as needed
  iat: number; // issued at (timestamp)
  exp: number; // expiration (timestamp)
};

