import ReviewDetailsCard from "@/components/modules/All Review/ReviewDetails";
import ContentRenderer from "@/components/editor/ContentRenderer";
import TopRatedReview from "@/components/modules/All Review/TopRatedReview";
import { loadPublishedContent } from "@/lib/editor/api";
import { featuredReview, getSingleReviewById } from "@/services/Review";


const ReviewDetailsPage = async ({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) => {
  const page = "1"
  const limit = "6"
  const { reviewId } = await params;
  const [{ data: review }, { data: featured }, managedContent] = await Promise.all([
    getSingleReviewById(reviewId),
    featuredReview(page, limit),
    loadPublishedContent("review", reviewId).catch((error: unknown) => {
      console.error("Unable to load managed review content", error);
      return null;
    }),
  ]);
  const contentHtml = managedContent?.ok
    ? managedContent.data.contentHtml
    : typeof review?.contentHtml === "string"
      ? review.contentHtml
      : null;


  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="col-span-4">
          <ReviewDetailsCard review={review}></ReviewDetailsCard>
          <ContentRenderer
            html={contentHtml}
            className="mt-6 rounded-xl bg-white p-4 leading-7 shadow-sm sm:p-6 [&_a]:break-all [&_img]:rounded-xl"
          />
        </div>
        <div className="col-span-2">
          <TopRatedReview featured={featured}></TopRatedReview>
        </div>
      </div>

    </div>
  )
}

export default ReviewDetailsPage