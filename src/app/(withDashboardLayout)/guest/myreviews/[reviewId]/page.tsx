import ReviewUpdateForm from "@/components/modules/All Review/ReviewUpdateForm";
import { getAllCategories } from "@/services/Category";
import { getSingleReviewById } from "@/services/Review";


const UpdateReview = async ({
  params
}: {
  params: Promise<{ reviewId: string }>;
}) => {
  const { reviewId } = await params;
  const { data: category } = await getAllCategories();
  const { data: review } = await getSingleReviewById(reviewId)
  
  return (
    <div>
      <ReviewUpdateForm
        category={category}
        review={review}
      ></ReviewUpdateForm>
    </div>
  );
};

export default UpdateReview;