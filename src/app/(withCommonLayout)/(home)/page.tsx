
import LatestReview from '@/components/modules/home/LatestReview';
import Slider from '@/components/modules/home/Slider';
import Summary from '@/components/modules/home/Summary';
import React from 'react';

const HomePage = () => {
    return (
        <div>
            <Slider></Slider>
            <Summary></Summary>
            <LatestReview></LatestReview>
        </div>
    );
};

export default HomePage;