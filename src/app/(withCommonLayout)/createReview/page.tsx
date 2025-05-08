import ReviewForm from "@/components/modules/All Review/ReviewForm";
import { getAllCategories } from "@/services/Category";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { data: category } = await getAllCategories();

  if (!category || category.length === 0) {
    redirect("/login");
  }

  return (
    <main className="bg-gray-100 min-h-screen py-10">
      <ReviewForm categories={category} />
    </main>
  );
};

export default page;
