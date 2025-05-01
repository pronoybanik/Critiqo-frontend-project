
import AllProduct from '@/components/modules/home/AllProduct';
import FaqSection from '@/components/modules/home/Faq';
import LatestReview from '@/components/modules/home/LatestReview';
import ProductMarketing from '@/components/modules/home/ProductMarketing';
import Slider from '@/components/modules/home/Slider';
import Summary from '@/components/modules/home/Summary';
import TopBrand from '@/components/modules/home/TopBrand';
import TopCategories from '@/components/modules/home/TopCategory';
import React from 'react';

const HomePage = () => {
    return (
        <div>
            <Slider></Slider>
            <Summary></Summary>
            <LatestReview></LatestReview>
            <TopCategories></TopCategories>
            <AllProduct></AllProduct>
            <ProductMarketing></ProductMarketing>
            <FaqSection></FaqSection>
            <TopBrand></TopBrand>
        </div>
    );
};

export default HomePage;