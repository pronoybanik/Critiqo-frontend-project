import LatestReviewCard from '@/components/cards/LatestReviewCards';
import React from 'react';

const LatestReview = () => {
  const reviewDataArray = [
    {
      images: ['https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/NoiseFit_Halo_AMOLED_Display_Smart_Watch-Noise-89abc-399169.png'],
      title: 'Best Smartwatch for Fitness Tracking',
      category: 'Wearable Tech',
      author: 'Alice Smith',
      createdAt: '2024-07-25',
      comments: 22,
      rating: 4.8,
    },
    {
      images: ['https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Hoco_W35_Max_ANC_Wireless_Headphone-hoco-c84b8-436657.png'],
      title: 'Great Noise-Cancelling Headphones',
      category: 'Audio',
      author: 'Bob Johnson',
      createdAt: '2024-07-24',
      comments: 15,
      rating: 5,
    },
    {
      images: ['https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Jisulife_FA45_NeckFan_Pro1_5000mAh_With_-JISULIFE-fbade-330914.png'],
      title: 'Durable Backpack for Hiking',
      category: 'Outdoor Gear',
      author: 'Carol Williams',
      createdAt: '2024-07-23',
      comments: 30,
      rating: 4,
    },
    {
      images: ['https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/ARCTIC_HUNTER_Water_Resistant_Anti_Theft-Arctic_Hunter-d3b23-423743.png'],
      title: 'Lightweight and Comfortable Running Shoes',
      category: 'Sports',
      author: 'David Brown',
      createdAt: '2024-07-22',
      comments: 18,
      rating: 3.5,
    },
    {
      images: ['https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/JBL_GO_4_Ultra_Portable_Waterproof_Bluet-JBL-bfb1e-412673.png'],
      title: 'Portable Bluetooth Speaker with Great Sound',
      category: 'Audio',
      author: 'Emily Green',
      createdAt: '2024-07-21',
      comments: 25,
      rating: 4.5,
    },

    {
      images: ['https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Jisulife_FA45_NeckFan_Pro1_5000mAh_With_-JISULIFE-fbade-330914.png'],
      title: 'High-Resolution Monitor for Designers',
      category: 'Electronics',
      author: 'Grace Davis',
      createdAt: '2024-07-19',
      comments: 28,
      rating: 4,
    },
  ];

  return (
    <div className='max-w-7xl mx-auto'>
      <div>
        <h1 className='text-3xl py-5 font-bold'>Latest Review</h1>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewDataArray.map((review, index) => (
          <LatestReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
};

export default LatestReview;