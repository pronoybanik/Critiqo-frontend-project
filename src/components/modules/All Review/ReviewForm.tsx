'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { createReview } from '@/services/Review'; // your API function
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  Input
} from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ReviewFormProps {
  categories: { id: string; name: string }[];
}

export default function ReviewForm({ categories }: ReviewFormProps) {
  const form = useForm({
    defaultValues: {
      title: 'This bag lather is good',
      description: 'This is a detailed review of the product...',
      rating: 5,
      purchaseSource: 'Amazon',
      categoryId: '',
      isPremium: false,
    }
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRatingClick = (value: number) => {
    form.setValue("rating", value);
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (photo) {
      formData.append('images', photo);
    }



    // ✅ Confirm data is appended
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const midifiedData = {
      images: photo,
      ...data
    }
    console.log(midifiedData)

    try {
      const res = await createReview(midifiedData);
      if (res.success) {
        toast.success('Review created successfully');
        form.reset();
        setPhoto(null);
        setPhotoPreview(null);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Something went wrong');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Create Your Review</h2>

        {/* Star Rating */}
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRatingClick(star)}
              className={`cursor-pointer text-3xl ${form.watch("rating") >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
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

        <FormField
          control={form.control}
          name="purchaseSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Source</FormLabel>
              <FormControl>
                <select className="w-full p-2 border rounded" {...field}>
                  <option value="">Select Source</option>
                  <option value="Amazon">Amazon</option>
                  <option value="eBay">eBay</option>
                  <option value="Walmart">Walmart</option>
                  <option value="Other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPremium"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Is this a premium product?</FormLabel>
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Upload Photo</FormLabel>
          <FormControl>
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
          </FormControl>
          {photoPreview && (
            <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />
          )}
        </FormItem>

        <Button type="submit" className="w-full">
          Submit Review
        </Button>
      </form>
    </Form>
  );
}
