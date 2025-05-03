import LatestReviewCard from '@/components/cards/LatestReviewCards';
import React from 'react';

const LatestReview = () => {
  const reviewDataArray = [
    {
      imageUrl: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/NoiseFit_Halo_AMOLED_Display_Smart_Watch-Noise-89abc-399169.png',
      title: 'Best Smartwatch for Fitness Tracking',
      category: 'Wearable Tech',
      author: 'Alice Smith',
      postedDate: '2024-07-25',
      commentCount: 22,
      rating: 4.8,
    },
    {
      imageUrl: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Hoco_W35_Max_ANC_Wireless_Headphone-hoco-c84b8-436657.png',
      title: 'Great Noise-Cancelling Headphones',
      category: 'Audio',
      author: 'Bob Johnson',
      postedDate: '2024-07-24',
      commentCount: 15,
      rating: 5,
    },
    {
      imageUrl: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Jisulife_FA45_NeckFan_Pro1_5000mAh_With_-JISULIFE-fbade-330914.png',
      title: 'Durable Backpack for Hiking',
      category: 'Outdoor Gear',
      author: 'Carol Williams',
      postedDate: '2024-07-23',
      commentCount: 30,
      rating: 4,
    },
    {
      imageUrl: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/ARCTIC_HUNTER_Water_Resistant_Anti_Theft-Arctic_Hunter-d3b23-423743.png',
      title: 'Lightweight and Comfortable Running Shoes',
      category: 'Sports',
      author: 'David Brown',
      postedDate: '2024-07-22',
      commentCount: 18,
      rating: 3.5,
    },
    {
      imageUrl: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/JBL_GO_4_Ultra_Portable_Waterproof_Bluet-JBL-bfb1e-412673.png',
      title: 'Portable Bluetooth Speaker with Great Sound',
      category: 'Audio',
      author: 'Emily Green',
      postedDate: '2024-07-21',
      commentCount: 25,
      rating: 4.5,
    },

    {
      imageUrl: 'https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Jisulife_FA45_NeckFan_Pro1_5000mAh_With_-JISULIFE-fbade-330914.png',
      title: 'High-Resolution Monitor for Designers',
      category: 'Electronics',
      author: 'Grace Davis',
      postedDate: '2024-07-19',
      commentCount: 28,
      rating: 4,
    },
  ];

  return (
    <div className='max-w-7xl mx-auto py-10'>
      <div className='text-center py-4'>
        <h1 className='text-3xl py-5 font-bold'>Latest Review</h1>
      </div>
      <div className="p-4  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewDataArray.map((review, index) => (
          <LatestReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
};

export default LatestReview;