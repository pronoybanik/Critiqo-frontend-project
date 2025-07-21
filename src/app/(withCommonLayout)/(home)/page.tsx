import Banner from "@/components/modules/home/Banner";
import FaqSection from "@/components/modules/home/Faq";
import LatestReview from "@/components/modules/home/LatestReview";
import ProductMarketing from "@/components/modules/home/ProductMarketing";
import ShutterIntro from "@/components/modules/home/ShutterIntro";
import Summary from "@/components/modules/home/Summary";
import TopBrand from "@/components/modules/home/TopBrand";
import TopCategories from "@/components/modules/home/TopCategory";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <ShutterIntro>
      </ShutterIntro>
      <Banner></Banner>
      <Summary></Summary>
      <LatestReview></LatestReview>
      <TopCategories></TopCategories>
      <ProductMarketing></ProductMarketing>

      {/* <TopCategories></TopCategories> */}

      <FaqSection></FaqSection>
      <TopBrand></TopBrand>

    </div>
  );
};

export default HomePage;
