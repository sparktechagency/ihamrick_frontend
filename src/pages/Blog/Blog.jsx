import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Motivation from "../../components/Motivation";
import BlogCard from "./components/BlogCard";
import HorizontalCard from "../../components/HorizontalCard";
import { useGetAllBlogsQuery } from "../../services/allApi";
import Pagination from "../../components/Pagination";

function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("title"); // Default sorting by title
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order is ascending
  const location = useLocation();
  const currentPath = location.pathname;

  // Context Logic
  const fromMain = currentPath === "/" || currentPath === "/home";
  const isRootBlogRoute = currentPath === "/blog";

  const ITEMS_PER_PAGE = 15;
  const CardComponent = fromMain ? HorizontalCard : BlogCard;

  // API Call with sorting parameters
  const { data, isLoading, error } = useGetAllBlogsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading blogs...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Error loading blogs. Please try again later.
      </div>
    );

  // Logic for data slicing and pagination
  const total = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // Show only 6 blogs on Home page, otherwise use standard pagination slice
  const currentItems = fromMain
    ? data?.data.slice(0, 6)
    : data?.data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- Dynamic Styling Based on Context ---
  const containerPadding = fromMain
    ? "py-8 sm:py-12 md:py-16"
    : "py-12 sm:py-16 md:py-24 lg:py-32 min-h-[98vh]";

  const titleSize = fromMain
    ? "text-2xl sm:text-3xl md:text-4xl"
    : "text-3xl sm:text-4xl md:text-5xl";

  // Determine grid columns based on the CardComponent
  const gridCols =
    CardComponent === BlogCard
      ? "grid-cols-1"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className={`flex flex-col items-center w-full relative ${containerPadding}`}
    >
      {isRootBlogRoute && <Motivation />}

      {/* Header Row */}
      <header
        className={`relative flex justify-center items-center w-full px-4 sm:px-8 max-w-7xl ${
          fromMain ? "mb-6" : "mb-8 sm:mb-10 md:mb-12"
        }`}
      >
        <h1
          className={`${titleSize} font-extrabold text-gray-900 text-center w-full`}
        >
          Blog
        </h1>

        {fromMain && (
          <div className="absolute right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2">
            <Link
              to="/blog"
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white text-xs sm:text-sm font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <span>View All</span>
            </Link>
          </div>
        )}
      </header>

      {/* Sorter (visible only on /blog route) */}
      {isRootBlogRoute && (
        <div className="absolute top-1/4 right-4 sm:right-10 z-10">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300"
          >
            <option value="title">Sort by Title</option>
            <option value="date">Sort by Date</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="ml-2 px-3 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      )}

      {/* Blog Grid */}
      <div
        className={`grid gap-8 sm:gap-10 md:gap-12 ${gridCols} px-4 sm:px-6 md:px-10 w-full max-w-7xl`}
      >
        {currentItems?.map((item) => (
          <CardComponent
            key={item._id}
            id={item._id}
            imageUrl={item.coverImage}
            headline={item.title}
            linkText="Read More"
            blogContent={item.description}
            from="blogs"
          />
        ))}
      </div>

      {/* Pagination - Only visible on the main Blog route */}
      {totalPages > 1 && isRootBlogRoute && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}

export default Blog;
