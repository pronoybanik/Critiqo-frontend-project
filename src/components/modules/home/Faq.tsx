"use client";
import React, { useState, useEffect } from "react";
import img1 from "../../../assets/faq2.png";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Star,
  Shield,
  Edit3,
} from "lucide-react";

const faqs = [
  {
    question: "How do I submit a review?",
    answer:
      "You can submit a review by signing up, finding the product or service, and clicking the 'Write a Review' button. Our intuitive interface makes it easy to share your experience.",
    icon: Edit3,
    color: "from-blue-500 to-blue-600",
  },
  {
    question: "Are the reviews verified?",
    answer:
      "We use a mix of automated tools and manual checks to verify that reviews are authentic and not spam. Our verification process ensures the highest quality and trustworthiness.",
    icon: Shield,
    color: "from-green-500 to-green-600",
  },
  {
    question: "Can I edit or delete my review?",
    answer:
      "Yes, log into your account, go to your profile, and you'll see options to edit or delete your reviews. You have full control over your content.",
    icon: MessageCircle,
    color: "from-purple-500 to-purple-600",
  },
  {
    question: "Is there a rating system?",
    answer:
      "Yes, users rate items from 1 to 5 stars and can also leave a written comment for more detail. This dual system provides comprehensive feedback.",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
  },
  {
    question: "Do you accept paid reviews?",
    answer:
      "No, we do not allow paid or sponsored reviews. All opinions must be honest and unbiased. We maintain strict policies to ensure authenticity.",
    icon: HelpCircle,
    color: "from-red-500 to-pink-500",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("faq-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div
      id="faq-section"
      className="relative py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm mb-4">
            <HelpCircle className="w-4 h-4 mr-2 text-blue-600" />
            Got Questions? We Have Answers
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our review platform and how
            to make the most of your experience
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: FAQ List */}
            <div className="p-8 lg:p-12">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <div
                      className={`bg-gradient-to-r ${
                        openIndex === index
                          ? "from-gray-50 to-blue-50"
                          : "from-white to-gray-50"
                      } rounded-2xl border ${
                        openIndex === index
                          ? "border-blue-200"
                          : "border-gray-100"
                      } overflow-hidden transition-all duration-300 hover:shadow-lg`}
                    >
                      {/* Question Header */}
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-10 h-10 bg-gradient-to-r ${faq.color} rounded-xl flex items-center justify-center shadow-md`}
                            >
                              <faq.icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                              {faq.question}
                            </h3>
                          </div>
                          <div
                            className={`w-8 h-8 bg-gradient-to-r ${
                              openIndex === index
                                ? "from-blue-500 to-purple-500"
                                : "from-gray-300 to-gray-400"
                            } rounded-full flex items-center justify-center transition-all duration-300 transform ${
                              openIndex === index ? "rotate-180" : ""
                            }`}
                          >
                            <ChevronDown className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </button>

                      {/* Answer Content */}
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              <div className="ml-14 pt-2">
                                <p className="text-gray-600 leading-relaxed">
                                  {faq.answer}
                                </p>
                                <div className="mt-4 flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="text-sm text-green-600 font-medium">
                                    Helpful answer
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Enhanced Image Section */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-100 p-8 lg:p-12 flex items-center justify-center">
              {/* Floating decorative elements */}
              <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-xl"></div>

              {/* Main illustration container */}
              <motion.div
                initial={{ x: -10, scale: 0.95 }}
                animate={{ x: 10, scale: 1 }}
                whileHover={{ x: 0, scale: 1.02 }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 0.3,
                  },
                }}
                className="relative"
              >
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-3xl blur-2xl transform scale-110"></div>

                {/* Image container */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-6 transform hover:shadow-3xl transition-all duration-300">
                  <Image
                    src={img1}
                    alt="FAQ illustration showing customer support and reviews"
                    width={400}
                    height={600}
                    className="rounded-2xl object-contain"
                    priority
                  />

                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    24/7 Support
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Instant Help
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can not find the answer you are looking for? Our support team is
              here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Contact Support
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200">
                Browse Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
