"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewCard from "@/components/modules/admin/ReviewCard";
import ReviewAnalytics from "@/app/(withDashboardLayout)/admin/reviewAnalytics/page";

const ReviewsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Reviews Dashboard</h1>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="unpublished">Unpublished</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {/* Map through pending reviews */}
          <ReviewCard status="pending" />
        </TabsContent>

        <TabsContent value="published">
          <ReviewCard status="published" />
        </TabsContent>

        <TabsContent value="unpublished">
          <ReviewCard status="unpublished" />
        </TabsContent>
      </Tabs>

      <ReviewAnalytics />
    </div>
  );
};

export default ReviewsPage;
