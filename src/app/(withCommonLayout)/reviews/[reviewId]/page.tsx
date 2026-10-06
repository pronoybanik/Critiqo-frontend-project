import ReviewDetailsCard from "@/components/modules/All Review/ReviewDetails";
import ContentRenderer from "@/components/editor/ContentRenderer";
import TopRatedReview from "@/components/modules/All Review/TopRatedReview";
import { loadPublishedContent } from "@/lib/editor/api";
import { featuredReview, getSingleReviewById } from "@/services/Review";
import PublicSeoJsonLd from "@/components/seo/PublicSeoJsonLd";
import {
  fallbackPublicSeoRecord,
  getPublicContentSeo,
  toPageMetadata,
  type SeoPageFallback,
} from "@/lib/seo/pageMetadata";

const fallbackForReview = (reviewId: string): SeoPageFallback => ({
  title: "Community product review | Critiqo",
  description: "Read a community product review on Critiqo.",
  path: `/reviews/${reviewId}`,
  schema: {
    "@context": "https://schema.org",
    "@type": "Review",
    url: new URL(
      `/reviews/${reviewId}`,
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://critiqo-frontend-project.vercel.app",
    ).toString(),
  },
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) {
  const { reviewId } = await params;
  const { data: review } = await getSingleReviewById(reviewId);
  const fallback = fallbackForReview(reviewId);
  if (typeof review?.slug !== "string" || !review.slug) {
    return toPageMetadata(fallbackPublicSeoRecord(fallback));
  }
  return toPageMetadata(
    await getPublicContentSeo(
      "review",
      review.slug,
      fallbackForReview(review.slug),
    ),
  );
}

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
          {typeof review?.slug === "string" && review.slug ? (
            <PublicSeoJsonLd
              type="review"
              slug={review.slug}
              fallback={fallbackForReview(review.slug)}
            />
          ) : null}
        </div>
        <div className="col-span-2">
          <TopRatedReview featured={featured}></TopRatedReview>
        </div>
      </div>

    </div>
  )
}

export default ReviewDetailsPage