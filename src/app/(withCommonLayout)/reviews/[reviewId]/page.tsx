import ReviewDetailsCard from "@/components/modules/All Review/ReviewDetails";
import TopRatedReview from "@/components/modules/All Review/TopRatedReview";
import { featuredReview, getSingleReviewById } from "@/services/Review";


const ReviewDetailsPage = async ({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) => {
  const page = "1"
  const limit = "6"
  const { reviewId } = await params;
  const { data: review } = await getSingleReviewById(reviewId);
  const { data: featured } = await featuredReview(page, limit);


  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="col-span-4">
          <ReviewDetailsCard review={review}></ReviewDetailsCard>
        </div>
        <div className="col-span-2">
          <TopRatedReview featured={featured}></TopRatedReview>
        </div>
      </div>

    </div>
  )
}

export default ReviewDetailsPage