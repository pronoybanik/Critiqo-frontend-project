"use client";

import React, { useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PrimaryButton from "@/components/shared/PrimayButton";
import UploadToCloudinary from "@/components/shared/UploadToCloudinary";


const UpdateProfile = () => {
  const [formFields, setFormFields] = useState({
    name: "",
    contactNumber: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getMyProfile();
      const user = response?.data;

      setFormFields({
        name: user?.name || "",

        contactNumber: user?.contactNumber || "",
      });
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePhoto(file);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  let profilePhotoUrl: string | null = null;

  if (profilePhoto) {
    profilePhotoUrl = await UploadToCloudinary(profilePhoto);
    if (!profilePhotoUrl) {
      setLoading(false);
      return;
    }
  }

  const payload = {
    name: formFields.name,
    contactNumber: formFields.contactNumber,
    profilePhoto: profilePhotoUrl, 
  };

  const result = await updateProfile(payload); 

  if (result?.success) {
    toast.success(result.message || "Profile updated successfully!");
    router.push("/profile");
  } else {
    setMessage(result.message || "Failed to update profile.");
  }

  setLoading(false);
};


  return (
    <div className="max-w-2xl my-10 mx-auto p-6 bg-white border rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Profile</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            name="name"
            value={formFields.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Contact Number
          </label>
          <input
            name="contactNumber"
            value={formFields.contactNumber}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Profile Photo
          </label>
          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <div className="lg:px-52 flex justify-center items-center">
          <PrimaryButton
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-md transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </PrimaryButton>
        </div>

        {message && (
          <p className="text-center mt-4 text-green-600 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UpdateProfile;
