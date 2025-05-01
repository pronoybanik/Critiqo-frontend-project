export interface IUser {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    contactNumber: string;
    isDeleteAt: boolean;
    createdAt: string; // or Date, depending on usage
    updatedAt: string; // or Date, depending on usage
  }
  