import ReviewForm from '@/components/modules/All Review/ReviewForm';
import { getAllCategories } from '@/services/Category';
import React from 'react';

const page = async () => {

  const { data: category } = await getAllCategories();
  console.log(category)
  return (
    <main className="bg-gray-100 min-h-screen py-10">
      <ReviewForm categories={category} />
    </main>

  );
};

export default page;