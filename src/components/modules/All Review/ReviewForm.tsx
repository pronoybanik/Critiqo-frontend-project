'use client';
import { createReview } from '@/services/Review';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ReviewForm = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: 'This bag lather is goog',
      description: 'This is a detailed review of the product...',
      rating: 5,
      purchaseSource: 'Amazon',
      categoryId: 'Choose category',
      isPremium: false,

    }
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleRating = (val: number) => {
    setValue('rating', val);
  };

  const onSubmit = async (data: any) => {
    const photo = data.photo?.[0];
    // const formData = new FormData();
    // formData.append("data", JSON.stringify(data));
    // formData.append("images", photo)
    const rData = {
      title: data.title,
      description: data.description,
      rating: data.rating,
      purchaseSource: data.purchaseSource,
      categoryId: data.categoryId,
      isPremium: data.isPremium,

    }
    const formData = {
      images: photo,
      data: (JSON.stringify(rData))
    }
    console.log(formData)
    try {
      const res = await createReview(formData)
      if (res.success) {
        toast.success("Review Create successfully")
      }
    } catch (err: any) {
      console.log(err)
    }

  };

  const watchPhoto = watch("photo");

  React.useEffect(() => {
    const file = watchPhoto?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }, [watchPhoto]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Create Your Review</h2>

      {/* Star Rating */}
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            className={`cursor-pointer text-3xl ${watch("rating") >= star ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Title */}
      <label className="font-medium">Title *</label>
      <input
        {...register('title', { required: true })}
        className="w-full p-2 border rounded mb-4"
      />
      {errors.title && <p className="text-red-500 text-sm mb-2">Title is required</p>}

      {/* Description */}
      <label className="font-medium">Description *</label>
      <textarea
        {...register('description', { required: true })}
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />
      {errors.description && <p className="text-red-500 text-sm mb-2">Description is required</p>}

      {/* Category */}
      <label className="font-medium">Select Category *</label>
      <select
        {...register('categoryId', { required: true })}
        className="w-full p-2 border-2 border-gray-300 rounded mb-4"
      >
        <option value="">-- Select a category --</option>
        <option value="5f9c7372-2aff-46d5-b55f-51e53b9ff717">Electronics</option>
        <option value="5f9c7372-2aff-46d5-b55f-51e53b9ff717">Sports</option>
        <option value="5f9c7372-2aff-46d5-b55f-51e53b9ff717">Appliance</option>
      </select>
      {errors.categoryId && <p className="text-red-500 text-sm mb-2">Category is required</p>}

      {/* Purchase Source */}
      <label className="font-medium">Where did you purchase this?</label>
      <select
        {...register('purchaseSource')}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select Source</option>
        <option value="Amazon">Amazon</option>
        <option value="eBay">eBay</option>
        <option value="Walmart">Walmart</option>
        <option value="Other">Other</option>
      </select>

      {/* isPremium */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          {...register('isPremium')}
          className="mr-2"
        />
        <label>Is this a premium product?</label>
      </div>

      {/* Photo Upload */}
      <label className="font-medium">Upload Photo</label>
      <input
        type="file"
        accept="image/*"
        {...register('photo')}
        className="w-full p-2 border-2 border-blue-500 rounded mb-4"
      />
      {photoPreview && (
        <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded mb-4" />
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Continue
      </button>
    </form>
  );
};

export default ReviewForm;
