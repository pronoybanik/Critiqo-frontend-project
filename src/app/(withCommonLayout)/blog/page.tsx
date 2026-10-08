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

import blogsData from "@/data/blogs.json";

// Sample blog data loaded from JSON
const sampleBlogs: Blog[] = blogsData as Blog[];

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
