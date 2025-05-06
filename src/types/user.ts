export type TUser = {
    id: string;
    email: string;
    role: "ADMIN" | "GUEST";
    status: "ACTIVE" | "INACTIVE";
    needPasswordChange: boolean;
    createdAt: string;
    updatedAt: string;
    guest: GuestInfo | null;
    admin: AdminInfo | null;
  };
  
  type GuestInfo = {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    contactNumber: string;
    address: string | null;
    bio: string | null;
  };
  
  type AdminInfo = {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    contactNumber: string;
    address: string | null;
    bio: string | null;
  };
  