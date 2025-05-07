"use client";

import { useState } from "react";
import {
  Calendar,
  MessageSquare,
  ChevronLeft,
  Heart,
  Send,
} from "lucide-react";
import Image from "next/image";
import GlassmorphicBanner from "@/components/shared/GlassmorphicBanner";

// Define TypeScript interfaces
interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
}

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  likes: number;
  comments: Comment[];
  category: string;
  readTime: string;
  tags: string[];
}

// Sample blog data - replace with your actual data fetching logic
const sampleBlogs: Blog[] = [
  {
    id: 1,
    title: "Top 10 Restaurants in the City",
    excerpt:
      "Discover the best dining experiences our city has to offer, from cozy cafes to fine dining.",
    content:
      "Our city is home to some of the most incredible dining experiences you can find. From small family-owned restaurants serving authentic cuisine to innovative fine dining establishments pushing culinary boundaries, there's something for everyone. In this blog, we explore the top 10 restaurants that consistently deliver exceptional food, service, and ambiance.\n\nFirst on our list is La Maison, a French bistro that brings Paris to your plate with their perfect coq au vin and crème brûlée. Next up is Sakura Garden, where the sushi chef creates edible art with the freshest ingredients flown in daily from Japan.\n\nFor those who enjoy a more casual setting, Hometown Grill offers the juiciest burgers and tastiest fries in town, while Green Leaf provides vegan and vegetarian options that even meat-lovers enjoy.\n\nOur top pick? The Riverfront Kitchen, where seasonal ingredients and innovative cooking techniques come together to create unforgettable culinary experiences.",
    author: "Jamie Rodriguez",
    date: "May 3, 2025",
    image:
      "https://img.freepik.com/free-photo/restaurant-interior_1127-3392.jpg?t=st=1746597669~exp=1746601269~hmac=02b3d050385180927495a4fb8fff2189a10e30fbaa7a4063fbb3b9b74861e2bc&w=900",
    likes: 42,
    category: "Food & Dining",
    readTime: "5 min",
    tags: ["restaurants", "food", "dining", "city guide"],
    comments: [
      {
        id: 1,
        author: "Chris L.",
        date: "May 4, 2025",
        text: "I've tried 8 out of these 10 restaurants, and I completely agree with your assessments!",
      },
      {
        id: 2,
        author: "Taylor M.",
        date: "May 5, 2025",
        text: "You forgot to mention that Riverfront Kitchen has amazing desserts too!",
      },
    ],
  },
  {
    id: 2,
    title: "How to Spot Fake Reviews Online",
    excerpt:
      "Learn the telltale signs of inauthentic reviews and how to find genuine opinions about products and services.",
    content:
      "In today's digital marketplace, online reviews play a crucial role in our purchasing decisions. However, not all reviews are created equal. Some are fabricated by companies to boost their ratings or by competitors to damage reputations. This guide will help you become more discerning when reading online reviews.\n\nFirst, be suspicious of extremes. Reviews that are overly enthusiastic or exceedingly negative without specific details may be fake. Authentic reviews typically include specific information about the product or service, describing personal experiences rather than vague statements.\n\nCheck the timing of reviews. If a product or service suddenly receives a flood of positive or negative reviews within a short timeframe, this could indicate a coordinated effort rather than organic customer feedback.\n\nLook at the reviewer's profile. New accounts with few reviews or accounts that have reviewed multiple products from the same company in a short period may lack credibility.\n\nBy developing a critical eye for online reviews, you can make more informed decisions and avoid falling for marketing ploys disguised as customer feedback.",
    author: "Alex Washington",
    date: "May 1, 2025",
    image:
      "https://img.freepik.com/free-photo/travel-concept-with-landmarks_23-2149153256.jpg?t=st=1746597596~exp=1746601196~hmac=2f847d8bbc441013ac4a6ae06b0e2a0ef7f806044c447d1deb037bf5a3527a7d&w=1380",
    likes: 37,
    category: "Digital Literacy",
    readTime: "4 min",
    tags: ["reviews", "online shopping", "digital literacy"],
    comments: [
      {
        id: 1,
        author: "Jordan P.",
        date: "May 2, 2025",
        text: "This is so important! I've been burned by fake reviews before.",
      },
      {
        id: 2,
        author: "Sam K.",
        date: "May 3, 2025",
        text: "Great article. I always check the 3-star reviews first - they tend to be most honest.",
      },
    ],
  },
  {
    id: 3,
    title: "The Rise of Virtual Reality Tourism",
    excerpt:
      "Explore how VR technology is changing the way we experience travel and cultural attractions.",
    content:
      "Virtual Reality (VR) technology is revolutionizing the tourism industry, offering immersive experiences that allow people to 'visit' destinations without leaving their homes. While nothing can truly replace the sensory experience of physical travel, VR tourism presents exciting possibilities for accessibility, sustainability, and preview experiences.\n\nMany museums and historical sites now offer virtual tours, allowing visitors from anywhere in the world to explore their collections and spaces. This democratizes access to cultural institutions that might otherwise be inaccessible due to distance, cost, or physical limitations.\n\nTravel companies are also leveraging VR as a marketing tool, giving potential tourists a taste of destinations before they book. This 'try before you fly' approach helps travelers make more informed decisions about their trips.\n\nVR tourism also offers a more sustainable alternative to physical travel, reducing carbon emissions associated with transportation. Additionally, it can help preserve fragile cultural and natural sites by reducing foot traffic while still allowing people to appreciate their beauty and significance.\n\nAs VR technology continues to advance, we can expect even more realistic and interactive virtual tourism experiences in the future.",
    author: "Morgan Chen",
    date: "April 28, 2025",
    image:
      "https://img.freepik.com/free-photo/historical-sinaia-monastery-surrounded-by-green-trees-sinaia-romania_181624-17259.jpg?t=st=1746597527~exp=1746601127~hmac=9b328f7de7b1d40ce2c3a1f54b517a6e2d5150d579c6823fad238f3ea16754cb&w=996",
    likes: 29,
    category: "Technology",
    readTime: "6 min",
    tags: ["VR", "tourism", "technology", "travel"],
    comments: [
      {
        id: 1,
        author: "Robin T.",
        date: "April 29, 2025",
        text: "I tried a VR tour of the Louvre last month and was blown away by how detailed it was!",
      },
      {
        id: 2,
        author: "Casey B.",
        date: "May 2, 2025",
        text: "Interesting concept, but I still prefer real travel. Nothing beats the real thing.",
      },
    ],
  },
  {
    id: 4,
    title: "Sustainable Home Renovation Tips",
    excerpt:
      "Transform your living space with these eco-friendly renovation ideas that are both beautiful and planet-conscious.",
    content:
      "Home renovations provide the perfect opportunity to make your living space more sustainable. By choosing eco-friendly materials and energy-efficient systems, you can reduce your environmental footprint while creating a healthier home environment.\n\nStart with energy efficiency. Upgrading insulation, sealing air leaks, and installing energy-efficient windows can dramatically reduce your energy consumption. Consider appliances with high energy-star ratings and LED lighting throughout your home.\n\nWhen it comes to materials, look for recycled, reclaimed, or sustainably sourced options. Bamboo flooring, recycled glass countertops, and reclaimed wood features add character while minimizing environmental impact. Low-VOC paints and natural finishes improve indoor air quality.\n\nWater conservation should be a priority with low-flow fixtures, dual-flush toilets, and perhaps a rainwater harvesting system for garden irrigation. For larger renovations, consider solar panels or other renewable energy systems.\n\nRemember that the most sustainable approach often involves working with what you already have. Refinishing existing floors or cabinets rather than replacing them reduces waste and often costs less. With thoughtful planning, your renovation can be beautiful, functional, and environmentally responsible.",
    author: "Taylor Green",
    date: "May 5, 2025",
    image:
      "https://img.freepik.com/free-vector/household-appliances-realistic-composition_1284-65307.jpg?t=st=1746597460~exp=1746601060~hmac=0b039a46c934996922027d769755b32bc24eb8d613df8ba6076561b5621ceed2&w=1060",
    likes: 18,
    category: "Home & Garden",
    readTime: "7 min",
    tags: ["sustainability", "home renovation", "eco-friendly", "DIY"],
    comments: [
      {
        id: 1,
        author: "Pat J.",
        date: "May 6, 2025",
        text: "We just finished a kitchen renovation using recycled materials and it turned out amazing!",
      },
    ],
  },
  {
    id: 5,
    title: "Sustainable Home Renovation Tips",
    excerpt:
      "Transform your living space with these eco-friendly renovation ideas that are both beautiful and planet-conscious.",
    content:
      "Home renovations provide the perfect opportunity to make your living space more sustainable. By choosing eco-friendly materials and energy-efficient systems, you can reduce your environmental footprint while creating a healthier home environment.\n\nStart with energy efficiency. Upgrading insulation, sealing air leaks, and installing energy-efficient windows can dramatically reduce your energy consumption. Consider appliances with high energy-star ratings and LED lighting throughout your home.\n\nWhen it comes to materials, look for recycled, reclaimed, or sustainably sourced options. Bamboo flooring, recycled glass countertops, and reclaimed wood features add character while minimizing environmental impact. Low-VOC paints and natural finishes improve indoor air quality.\n\nWater conservation should be a priority with low-flow fixtures, dual-flush toilets, and perhaps a rainwater harvesting system for garden irrigation. For larger renovations, consider solar panels or other renewable energy systems.\n\nRemember that the most sustainable approach often involves working with what you already have. Refinishing existing floors or cabinets rather than replacing them reduces waste and often costs less. With thoughtful planning, your renovation can be beautiful, functional, and environmentally responsible.",
    author: "Taylor Green",
    date: "May 5, 2025",
    image:
      "https://img.freepik.com/free-vector/household-appliances-realistic-composition_1284-65307.jpg?t=st=1746597460~exp=1746601060~hmac=0b039a46c934996922027d769755b32bc24eb8d613df8ba6076561b5621ceed2&w=1060",
    likes: 18,
    category: "Home & Garden",
    readTime: "7 min",
    tags: ["sustainability", "home renovation", "eco-friendly", "DIY"],
    comments: [
      {
        id: 1,
        author: "Pat J.",
        date: "May 6, 2025",
        text: "We just finished a kitchen renovation using recycled materials and it turned out amazing!",
      },
    ],
  },
  {
    id: 6,
    title: "Sustainable Home Renovation Tips",
    excerpt:
      "Transform your living space with these eco-friendly renovation ideas that are both beautiful and planet-conscious.",
    content:
      "Home renovations provide the perfect opportunity to make your living space more sustainable. By choosing eco-friendly materials and energy-efficient systems, you can reduce your environmental footprint while creating a healthier home environment.\n\nStart with energy efficiency. Upgrading insulation, sealing air leaks, and installing energy-efficient windows can dramatically reduce your energy consumption. Consider appliances with high energy-star ratings and LED lighting throughout your home.\n\nWhen it comes to materials, look for recycled, reclaimed, or sustainably sourced options. Bamboo flooring, recycled glass countertops, and reclaimed wood features add character while minimizing environmental impact. Low-VOC paints and natural finishes improve indoor air quality.\n\nWater conservation should be a priority with low-flow fixtures, dual-flush toilets, and perhaps a rainwater harvesting system for garden irrigation. For larger renovations, consider solar panels or other renewable energy systems.\n\nRemember that the most sustainable approach often involves working with what you already have. Refinishing existing floors or cabinets rather than replacing them reduces waste and often costs less. With thoughtful planning, your renovation can be beautiful, functional, and environmentally responsible.",
    author: "Taylor Green",
    date: "May 5, 2025",
    image:
      "https://img.freepik.com/free-photo/standard-quality-control-concept-m_23-2150041859.jpg?t=st=1746597404~exp=1746601004~hmac=f644644f18a81e0f88aaae3d426a7eda7c769ef495b427bef4488cefc9e45f46&w=900",
    likes: 18,
    category: "Technology",
    readTime: "7 min",
    tags: ["sustainability", "home renovation", "eco-friendly", "DIY"],
    comments: [
      {
        id: 1,
        author: "Pat J.",
        date: "May 6, 2025",
        text: "We just finished a kitchen renovation using recycled materials and it turned out amazing!",
      },
    ],
  },
];

const BlogPage: React.FC = () => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [blogs, setBlogs] = useState<Blog[]>(sampleBlogs);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeTag, setActiveTag] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Function to handle blog selection
  const viewBlogDetails = (blogId: number): void => {
    const blog = blogs.find((blog) => blog.id === blogId);
    if (blog) {
      setSelectedBlog(blog);
      window.scrollTo(0, 0);
    }
  };

  // Function to go back to blog list
  const goBackToList = (): void => {
    setSelectedBlog(null);
    setActiveCategory("");
    setActiveTag("");
    setSearchTerm("");
  };

  // Function to add a new comment
  const addComment = (e?: React.MouseEvent): void => {
    if (e) e.preventDefault();
    if (!newComment.trim() || !selectedBlog) return;

    const updatedBlogs = blogs.map((blog) => {
      if (blog.id === selectedBlog.id) {
        const newCommentObj: Comment = {
          id: blog.comments.length + 1,
          author: "You",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          text: newComment,
        };
        return {
          ...blog,
          comments: [...blog.comments, newCommentObj],
        };
      }
      return blog;
    });

    setBlogs(updatedBlogs);
    const updatedSelectedBlog = updatedBlogs.find(
      (blog) => blog.id === selectedBlog.id
    );
    if (updatedSelectedBlog) {
      setSelectedBlog(updatedSelectedBlog);
    }
    setNewComment("");
  };

  // Function to like a blog
  const likeBlog = (): void => {
    if (!selectedBlog) return;

    const updatedBlogs = blogs.map((blog) => {
      if (blog.id === selectedBlog.id) {
        return {
          ...blog,
          likes: blog.likes + 1,
        };
      }
      return blog;
    });

    setBlogs(updatedBlogs);
    const updatedSelectedBlog = updatedBlogs.find(
      (blog) => blog.id === selectedBlog.id
    );
    if (updatedSelectedBlog) {
      setSelectedBlog(updatedSelectedBlog);
    }
  };

  // Function to toggle bookmark status
  const toggleBookmark = (blogId: number, e: React.MouseEvent): void => {
    e.stopPropagation();

    if (bookmarks.includes(blogId)) {
      setBookmarks(bookmarks.filter((id) => id !== blogId));
    } else {
      setBookmarks([...bookmarks, blogId]);
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = (): void => {
    setDarkMode(!darkMode);
  };

  // Function to filter blogs by search term, category, or tag
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      searchTerm === "" ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "" || blog.category === activeCategory;

    const matchesTag = activeTag === "" || blog.tags.includes(activeTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Function to get all unique categories
  const categories = Array.from(new Set(blogs.map((blog) => blog.category)));

  // Function to get all unique tags
  const tags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)));

  return (
    <section>
      <div>
        <GlassmorphicBanner
          title="Your Hub for Digital Innovation and Trends"
          subtitle="Welcome to Smart Insights, the blog that keeps you ahead in the fast-paced world of technology, business, and digital transformation."
        />
      </div>
      <div
        className={`max-w-6xl mx-auto px-4 py-8 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Our Blog
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Blog Content */}
        {selectedBlog ? (
          // Blog Detail View
          <div className="animate-fade-in">
            {/* Back Button */}
            <button
              onClick={goBackToList}
              className={`flex items-center ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              } mb-6 transition duration-200`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to all blogs
            </button>

            {/* Blog Hero */}
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg overflow-hidden mb-8`}
            >
              <Image
                src={selectedBlog.image}
                alt={selectedBlog.title}
                height={300}
                width={700}
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedBlog.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {selectedBlog.readTime} read
                  </span>
                </div>

                <h2
                  className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  } mb-4`}
                >
                  {selectedBlog.title}
                </h2>

                <div
                  className={`flex items-center ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } mb-6`}
                >
                  <div className="flex items-center mr-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{selectedBlog.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span>{selectedBlog.comments.length} comments</span>
                  </div>
                </div>

                <div
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  } mb-6 whitespace-pre-line`}
                >
                  {selectedBlog.content.split("\n\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div
                  className={`border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } pt-4 flex items-center justify-between`}
                >
                  <div
                    className={`flex items-center ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="font-medium">
                      By {selectedBlog.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={likeBlog}
                      className={`flex items-center ${
                        darkMode
                          ? "text-rose-400 hover:text-rose-300"
                          : "text-rose-500 hover:text-rose-700"
                      } transition duration-200`}
                    >
                      <Heart
                        className="w-5 h-5 mr-1"
                        fill={selectedBlog.likes > 0 ? "currentColor" : "none"}
                      />
                      <span>{selectedBlog.likes}</span>
                    </button>

                    <button
                      onClick={(e) => toggleBookmark(selectedBlog.id, e)}
                      className={`ml-4 ${
                        darkMode
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-yellow-500 hover:text-yellow-700"
                      }`}
                    >
                      {bookmarks.includes(selectedBlog.id) ? "★" : "☆"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg overflow-hidden mb-8`}
            >
              <div className="p-6">
                <h3
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  } mb-6`}
                >
                  You might also like
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs
                    .filter(
                      (blog) =>
                        blog.id !== selectedBlog.id &&
                        blog.category === selectedBlog.category
                    )
                    .slice(0, 2)
                    .map((blog) => (
                      <div
                        key={blog.id}
                        className={`flex gap-4 cursor-pointer ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        } p-2 rounded transition duration-200`}
                        onClick={() => viewBlogDetails(blog.id)}
                      >
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          height={500}
                          width={500}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div>
                          <h4
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-800"
                            } mb-1`}
                          >
                            {blog.title}
                          </h4>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {blog.readTime} read
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg overflow-hidden mb-8`}
            >
              <div className="p-6">
                <h3
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  } mb-6`}
                >
                  Comments ({selectedBlog.comments.length})
                </h3>

                {/* Comment List */}
                <div className="space-y-6 mb-8">
                  {selectedBlog.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`border-b ${
                        darkMode ? "border-gray-700" : "border-gray-100"
                      } pb-6 last:border-b-0 last:pb-0`}
                    >
                      <div className="flex justify-between mb-2">
                        <span
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {comment.author}
                        </span>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {comment.date}
                        </span>
                      </div>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Section */}
                <div className="mt-8">
                  <h4
                    className={`text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-800"
                    } mb-4`}
                  >
                    Leave a comment
                  </h4>
                  <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className={`w-full p-4 pr-12 border rounded-lg resize-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-600 focus:border-blue-600"
                      }`}
                      rows={4}
                    ></textarea>
                    <button
                      onClick={addComment}
                      className={`absolute right-3 bottom-3 p-2 rounded-full ${
                        darkMode
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      } transition duration-200`}
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Blog List View
          <div>
            {/* Search and Filter Section */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full p-3 pl-10 rounded-lg ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>

              {/* Categories */}
              <div className="mt-4">
                <h3
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveCategory("")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === ""
                        ? darkMode
                          ? "bg-blue-700 text-white"
                          : "bg-blue-600 text-white"
                        : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeCategory === category
                          ? darkMode
                            ? "bg-blue-700 text-white"
                            : "bg-blue-600 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4">
                <h3
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 8).map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeTag === tag
                          ? darkMode
                            ? "bg-blue-700 text-white"
                            : "bg-blue-600 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer`}
                  onClick={() => viewBlogDetails(blog.id)}
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    height={250}
                    width={300}
                    className="w-full h-48 object-cover object-center"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-blue-900 text-blue-200"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {blog.category}
                      </span>
                      <button
                        onClick={(e) => toggleBookmark(blog.id, e)}
                        className={`${
                          darkMode
                            ? "text-yellow-400 hover:text-yellow-300"
                            : "text-yellow-500 hover:text-yellow-700"
                        }`}
                      >
                        {bookmarks.includes(blog.id) ? "★" : "☆"}
                      </button>
                    </div>
                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-800"
                      } mb-2`}
                    >
                      {blog.title}
                    </h2>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      } mb-4 line-clamp-3`}
                    >
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div
                        className={`flex items-center ${
                          darkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{blog.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          } mr-3`}
                        >
                          {blog.readTime} read
                        </span>
                        <div className="flex items-center text-rose-500">
                          <Heart
                            className="w-4 h-4 mr-1"
                            fill={blog.likes > 0 ? "currentColor" : "none"}
                          />
                          <span>{blog.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPage;
