'use client';
import React, { useState } from 'react';
import img1 from "../../../assets/faq.jpg"
import Image from 'next/image';

const faqs = [
  {
    question: "How do I submit a review?",
    answer: "You can submit a review by signing up, finding the product or service, and clicking the 'Write a Review' button.",
  },
  {
    question: "Are the reviews verified?",
    answer: "We use a mix of automated tools and manual checks to verify that reviews are authentic and not spam.",
  },
  {
    question: "Can I edit or delete my review?",
    answer: "Yes, log into your account, go to your profile, and you'll see options to edit or delete your reviews.",
  },
  {
    question: "Is there a rating system?",
    answer: "Yes, users rate items from 1 to 5 stars and can also leave a written comment for more detail.",
  },
  {
    question: "Do you accept paid reviews?",
    answer: "No, we do not allow paid or sponsored reviews. All opinions must be honest and unbiased.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index: any) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className='max-w-7xl mx-auto mt-6 bg-gray-100 shadow-2xl'>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6  rounded-md shadow">
        {/* Left: FAQ */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border-b pb-3 border-blue-200">
              <button
                onClick={() => toggleFaq(index)}
                className="text-left w-full text-lg font-medium focus:outline-none"
              >
                {faq.question}
              </button>
              {openIndex === index && (
                <p className="mt-2 text-gray-600 transition-all duration-300">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Right: Image */}
        <div className="flex items-center justify-center">
          <Image
            src={img1} // Replace with your actual image
            alt="Review illustration"
            width={400}
            height={400}
            className="rounded-lg shadow-md object-contain"
          />
        </div>
      </section>
    </div>
  );
};

export default FaqSection;