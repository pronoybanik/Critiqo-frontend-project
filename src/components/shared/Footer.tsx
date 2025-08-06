import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import logo from "../../assets/logo/2-removebg-preview.png";
import google from "../../assets/logo/google.png";
import apple from "../../assets/logo/apple.png";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Download,
  Star,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";
import { featuredReview } from "@/services/Review";
import { StarRating } from "../modules/All Review/ReviewDetails";
import { TReview } from "@/types/review";

const Footer = async () => {
  const page = "1";
  const limit = "6";
  const { data: featureds } = await featuredReview(page, limit);
  console.log("featureds", featureds);

  const quickLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/gallery", label: "Gallery", icon: "🖼️" },
    { href: "/smartwatch", label: "Smartwatch", icon: "⌚" },
    { href: "/terms", label: "Terms & Conditions", icon: "📄" },
  ];

  const companyLinks = [
    { href: "/about", label: "About Us", icon: "ℹ️" },
    { href: "/blog", label: "Blog", icon: "📝" },
    { href: "/contact", label: "Contact Us", icon: "📞" },
    { href: "/privacy", label: "Privacy Policy", icon: "🔒" },
  ];

  const socialLinks = [
    {
      href: "#",
      icon: Facebook,
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    { href: "#", icon: Twitter, label: "Twitter", color: "hover:text-sky-400" },
    {
      href: "#",
      icon: Instagram,
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      href: "#",
      icon: Linkedin,
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-600/10 to-transparent rounded-full blur-3xl"></div>

      <div className="relative container mx-auto">
        {/* Stats Section */}
        {/* Newsletter Section */}
        <div className="py-16 border-b border-gray-700/50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Updated with Latest Reviews
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Get the latest product reviews, exclusive deals, and insider
                tips delivered straight to your inbox. Join over 10,000 smart
                shoppers who never miss out!
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 max-w-2xl mx-auto">
              <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscribe Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Unsubscribe anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Weekly updates</span>
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>10,000+ subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>Growing daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-7xl mx-auto px-6">
            {/* Company Info + App Download */}
            <div className="lg:col-span-1 space-y-8">
              {/* Logo and Description */}
              <div>
                <div className="mb-6">
                  <Image
                    src={logo}
                    alt="footer logo"
                    height={60}
                    width={180}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                </div>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Your trusted platform for authentic product reviews and
                  customer feedback. Join thousands of users making informed
                  decisions every day.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>support@opinionoasis.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span>123 Tech Street, Digital City</span>
                  </div>
                </div>
              </div>

              {/* App Download Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <Download className="w-5 h-5 mr-2 text-blue-400" />
                  Download Our App
                </h3>
                <div className="space-y-3">
                  <Link href="#" className="block group">
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                      <Image
                        src={google}
                        alt="Google Play"
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">
                          Get it on
                        </p>
                        <p className="text-blue-400 font-semibold">
                          Google Play
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link href="#" className="block group">
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105">
                      <Image
                        src={apple}
                        alt="App Store"
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">
                          Download on
                        </p>
                        <p className="text-blue-400 font-semibold">App Store</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-700/50 pb-2">
                Quick Links
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 group"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="group-hover:text-blue-400 transition-colors duration-300">
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                ))}
              </div>

              {/* Company Links */}
              <h3 className="text-lg font-semibold mb-6 mt-8 text-white border-b border-gray-700/50 pb-2">
                Company
              </h3>
              <div className="space-y-3">
                {companyLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 group"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="group-hover:text-blue-400 transition-colors duration-300">
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Highest Rated Reviews */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-700/50 pb-2 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Highest Rated Reviews
              </h3>
              <div className="space-y-4">
                {featureds?.highestRated?.slice(0, 3).map((review: TReview) => (
                  <div
                    key={review.id}
                    className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/30 shadow-lg hover:shadow-xl rounded-xl p-4 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Image
                          width={50}
                          height={50}
                          src={review?.image}
                          alt={review.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors duration-300">
                          {review.title}
                        </h4>
                        <p className="text-gray-500 text-xs">
                          {format(new Date(review.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StarRating rating={review?.rating} />
                        <span className="text-yellow-400 text-sm font-medium">
                          {review?.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Voted Reviews */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white border-b border-gray-700/50 pb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Most Voted Reviews
              </h3>
              <div className="space-y-4">
                {featureds?.mostVoted?.slice(0, 3).map((review: TReview) => (
                  <div
                    key={review.id}
                    className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/30 shadow-lg hover:shadow-xl rounded-xl p-4 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Image
                          width={50}
                          height={50}
                          src={review.image}
                          alt={review.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors duration-300">
                          {review.title}
                        </h4>
                        <p className="text-gray-500 text-xs">
                          {format(new Date(review.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StarRating rating={review?.rating} />
                        <span className="text-green-400 text-sm font-medium">
                          {review?.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between px-6 space-y-6 lg:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <h4 className="text-sm font-semibold text-gray-400">
                Follow Us:
              </h4>
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-110 ${social.color}`}
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-right">
              <p className="text-sm text-gray-500">
                Copyright © {new Date().getFullYear()} Team Opinion Oasis. All
                rights reserved.
              </p>
              <div className="flex items-center justify-center lg:justify-end space-x-6 mt-2">
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
