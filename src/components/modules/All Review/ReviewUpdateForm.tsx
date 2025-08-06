/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Upload, User } from "lucide-react";

import { updateReview } from "@/services/Review";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PrimaryButton from "@/components/shared/PrimayButton";
import UploadToCloudinary from "@/components/shared/UploadToCloudinary";

type Props = {
  category: { id: string; name: string }[];
  review?: any;
};

const ReviewUpdateForm: React.FC<Props> = ({ category, review }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    review?.images ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();


  const form = useForm({
    defaultValues: {
      title: review?.title || "",
      description: review?.description || "",
      rating: review?.rating || 0,
      purchaseSource: review?.purchaseSource || "",
      categoryId: review?.categoryId || "",
      isPremium: review?.isPremium || false,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  //  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0] || null;
  //     setProfilePhoto(file);
  //   };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRatingClick = (value: number) => {
    form.setValue("rating", value);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (formValue) => {
    try {
      setIsLoading(true);
      const id = review?.id;

      let uploadedImageUrl = review?.images ?? null;

    

      if (photo) {
        uploadedImageUrl = await UploadToCloudinary(photo);
        if (!uploadedImageUrl) {
          toast.error("Image upload failed.");
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        ...formValue,
        images: uploadedImageUrl,
      };

 

      const response = await updateReview(payload, id);


      if (response.success) {
        toast.success("Review updated successfully!");
        form.reset();
        removePhoto();
        router.push("/guest/myreviews");
      } else {
        toast.error(response.message || "Failed to update review");
      }
    } catch (err) {
      console.error("Review update error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-6 bg-white rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Update your Review
          </h2>

          {/* Rating */}
          <div className="space-y-2">
            <p className="font-medium">Rating</p>
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className={`cursor-pointer text-4xl ${
                    form.watch("rating") >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a review title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your experience"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {category.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Purchase Source */}
          <FormField
            control={form.control}
            name="purchaseSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where did you buy it?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="eBay">eBay</SelectItem>
                    <SelectItem value="Walmart">Walmart</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Photo
            </label>
            <div className="flex items-center justify-between">
              {photoPreview ? (
                <div className="relative h-20 w-20">
                  <Image
                    width={80}
                    height={80}
                    src={photoPreview}
                    alt="Product preview"
                    className="h-20 w-20 rounded-md object-cover border-4 border-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <div>
                <label
                  htmlFor="review-image"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                </label>
                <input
                  id="review-image"
                  name="review-image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Review"}
          </PrimaryButton>
        </form>
      </Form>
    </div>
  );
};

export default ReviewUpdateForm;
