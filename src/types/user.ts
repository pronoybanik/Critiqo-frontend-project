export type TUser = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  profilePhoto: string | null;
  role: "GUEST" | "USER" | "ADMIN"; 
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  isDeleteAt: boolean;
  needPasswordChange: boolean;
  subscription: boolean;
  createdAt: string; 
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

