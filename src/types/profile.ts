export type IProfile = {
    id: string;
    email: string;
    role: 'ADMIN' | 'GUEST' | 'USER'; 
    status: 'ACTIVE' | 'BLOCKED' | 'DELETED'; 
    name: string;
    profilePhoto?: string | null;
    contactNumber: string;
    isDeleteAt: boolean;
    createdAt: string; 
    updatedAt: string;
  };

  