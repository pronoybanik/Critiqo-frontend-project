
"use client";
import { EffectFade, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import img1 from '../../../assets/hero/review1.webp';
import img2 from '../../../assets/hero/review2.jpg';
import Image from 'next/image';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { useSearchParams } from 'next/navigation';

const Slider = () => {
    //   const [search, setSearch] = useState('');
    // const [searchText, setSearchText] = useState('');
    //   const [getDatas, setGetDatas] = useState<any>([]);


    // };
    //   useEffect(() => {
    //     const fetchData = async (page, limit, params) => {
    //       const res = await fetch(
    //         `${process.env.NEXT_PUBLIC_BASE_API}/tutors?page=${page}&limit=${limit}&${params}`,
    //         {
    //           next: {
    //             tags: ["TUTORS"],
    //           },
    //         }
    //       );
    //       const data = await res.json();
    //       console.log({ data })
    //       setGetDatas(data.data);
    //     };
    //     const page = 0;
    //     const limit = 0;
    //     const params = `searchTerm=${searchText} `;
    //     fetchData(page, limit, params);

    //   }, [searchText]);


    //   const handleSearch = e => {
    //     e.preventDefault();
    //     // handleSearchQuery("searchTerm", searchText)
    //     setSearch(searchText);
    //     console.log(searchText)
    //     // e.target.reset();
    //     // mutateAsync(search);
    //   };
    return (
        <div className="max-w-7xl mx-auto   ">
            <div className=" relative">
                <Swiper
                    effect={'fade'}
                    fadeEffect={{ crossFade: true }}
                    slidesPerView={1}
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay, EffectFade]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className="carousel-item relative w-full style lg:h-[550px] mt-8">
                            <Image src={img2} height={500} alt='banner' className="w-full rounded-xl overflow-hidden " />
                            <div className="absolute rounded-xl flex  items-center h-full left-0 top-0 bg-gradient-to-r from-[#151515] from-10% via-[#151515] via-10%  to-[rgba(21, 21, 21, 0)]   ">
                                <div className=" text-white space-y-10 ml-6 lg:ml-20 ">
                                    <h2 className="text-2xl lg:text-5xl font-bold">
                                        If you want to post your <br />{' '}
                                        <span className="text-[#C24340]">opinion</span> with our product
                                        <br /> just join with us and share
                                    </h2>
                                    {/* <Button className="rounded-full" >
                    Find Tutor
                  </Button> */}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="carousel-item relative w-full style lg:h-[550px] mt-8">
                            <Image src={img1} height={500} alt='banner' className="w-full rounded-xl overflow-hidden" />
                            <div className="absolute rounded-xl flex  items-center h-full left-0 top-0 bg-gradient-to-r from-[#151515] from-10% via-[#151515] via-10%  to-[rgba(21, 21, 21, 0)]   ">
                                <div className=" text-white space-y-10 ml-6 lg:ml-20 ">
                                    <h2 className="text-2xl lg:text-5xl font-bold">
                                        Searching for Jenuin ?<br /> {' '}
                                        <span className="text-[#C24340]">Review</span> Just explore <br />{' '}
                                        our site and find<br />  what you want
                                    </h2>
                                    {/* <Button className="rounded-full" >
                    Find Tutor
                  </Button> */}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
                {/* <div className="carousel w-full h-[600px]  object-fill mt-7">
      </div> */}
            </div>


        </div>
    );
};

export default Slider;