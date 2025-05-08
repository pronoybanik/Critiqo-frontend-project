import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import logo from "../../assets/logo/2-removebg-preview.png";
import google from "../../assets/logo/google.png";
import apple from "../../assets/logo/apple.png";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { featuredReview } from "@/services/Review";
import { CardContent, CardTitle } from "../ui/card";
import { StarRating } from "../modules/All Review/ReviewDetails";
import { TReview } from "@/types/review";

const Footer = async () => {
  const page = "1";
  const limit = "6";
  const { data: featureds } = await featuredReview(page, limit);

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mx-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 px-10 gap-8 max-w-7xl">
          {/* Helpful Links + App Download */}
          <div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-800">
                Helpful Links
              </h3>
              <div className="flex flex-col md:flex-row gap-12">
                <ul className="space-y-2">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/gallery">Gallery</Link>
                  </li>
                  <li>
                    <Link href="/smartwatch">Smartwatch</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms & Conditions</Link>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact Us</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-800">
                Download Our App
              </h3>
              <div className="flex space-x-4 mt-1">
                <Link href="#">
                  <Image
                    src={google}
                    alt="Google Play"
                    width={130}
                    height={40}
                  />
                </Link>
                <Link className="mt-1" href="#">
                  <Image src={apple} alt="App Store" width={130} height={50} />
                </Link>
              </div>
            </div>
          </div>

          {/* Highest Rated Reviews */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-800">
              Highest Rated Review
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {featureds?.highestRated?.map((review: TReview) => (
                <div
                  key={review.id}
                  className="bg-gray-800 border-gray-200 shadow-md hover:shadow-lg rounded-xl p-2"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      width={100}
                      height={100}
                      src={review.image}
                      alt={review.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-200">
                        {review.title}
                      </CardTitle>
                      <p className="text-gray-500 text-sm">
                        {format(new Date(review.createdAt), "PPP")}
                      </p>
                    </div>
                  </div>
                  <CardContent className="flex justify-between items-center">
                    <div className="flex gap-2 items-center pt-1.5">
                      <StarRating rating={review?.rating} />
                      <span className="text-gray-500 text-sm">
                        ({review?.rating})
                      </span>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          </div>

          {/* Most Voted Reviews */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-800">
              Most Voted Review
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {featureds?.mostVoted?.map((review: TReview) => (
                <div
                  key={review.id}
                  className="bg-gray-800 border-gray-200 shadow-md hover:shadow-lg rounded-xl p-2"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      width={100}
                      height={100}
                      src={review.image}
                      alt={review.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-200">
                        {review.title}
                      </CardTitle>
                      <p className="text-gray-500 text-sm">
                        {format(new Date(review.createdAt), "PPP")}
                      </p>
                    </div>
                  </div>
                  <CardContent className="flex justify-between items-center">
                    <div className="flex gap-2 items-center pt-1.5">
                      <StarRating rating={review?.rating} />
                      <span className="text-gray-500 text-sm">
                        ({review?.rating})
                      </span>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 bg-gray-900 py-4 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between px-10">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-semibold text-white">
              <Image src={logo} alt="footer logo" height={170} width={250} />
            </span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2 md:hidden">
              Follow Us
            </h4>
            <div className="flex items-center space-x-4">
              <h4 className="text-sm font-semibold text-gray-400 hidden md:block">
                Follow Us
              </h4>
              <Link href="#" className="hover:text-white">
                <Facebook className="w-5 h-5 fill-current" />
              </Link>
              <Link href="#" className="hover:text-white">
                <Twitter className="w-5 h-5 fill-current" />
              </Link>
              <Link href="#" className="hover:text-white">
                <Instagram className="w-5 h-5 fill-current" />
              </Link>
              <Link href="#" className="hover:text-white">
                <Linkedin className="w-5 h-5 fill-current" />
              </Link>
            </div>
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            <Link href="/terms" className="mr-4 hover:text-gray-300">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <p className="text-sm text-gray-500 mt-1">
            Copyright ©{new Date().getFullYear()} Team Opinion Oisis
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
