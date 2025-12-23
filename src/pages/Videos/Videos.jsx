import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Motivation from "../../components/Motivation";
import VideoCard from "./components/VideoCard";
import HorizontalCard from "../../components/HorizontalCard";
import Pagination from "../../components/Pagination";
import { useGetAllVideosQuery } from "../../services/allApi";
import videoclick from "../../assets/videoclick.png";

function Videos() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useGetAllVideosQuery();
  const location = useLocation();
  const currentPath = location.pathname;

  // Logic to determine context
  const fromMain = currentPath === "/" || currentPath === "/home";
  const isRootVideosRoute = currentPath === "/videos";

  const ITEMS_PER_PAGE = 15;
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);

  const CardComponent = fromMain ? HorizontalCard : VideoCard;

  useEffect(() => {
    if (data) {
      const total = data?.meta?.total || 0;
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

      // If on Home, show only the first 3 or 6 items; otherwise, use pagination logic
      const items = fromMain
        ? data?.data.slice(0, 6)
        : data?.data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      setCurrentItems(items || []);
    }
  }, [data, currentPage, fromMain]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading)
    return <div className="flex justify-center py-20">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-20">
        Error: {error.message}
      </div>
    );

  // --- Dynamic Styling Based on Context ---
  const containerPadding = fromMain
    ? "py-8 sm:py-12 md:py-16"
    : "py-12 sm:py-16 md:py-24 lg:py-32 min-h-[98vh]";

  const titleSize = fromMain
    ? "text-2xl sm:text-3xl md:text-4xl"
    : "text-3xl sm:text-4xl md:text-5xl";

  return (
    <div
      className={`flex flex-col items-center w-full relative ${containerPadding}`}
    >
      {isRootVideosRoute && <Motivation />}

      {/* Header Row */}
      <header className="relative flex justify-center items-center mb-8 sm:mb-10 md:mb-12 w-full px-4 sm:px-8 max-w-7xl">
        <h1
          className={`${titleSize} font-extrabold text-gray-900 text-center w-full`}
        >
          Videos
        </h1>

        {fromMain && (
          <div className="absolute right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2">
            <Link
              to="/videos"
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white text-xs sm:text-sm font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <span>View All</span>
            </Link>
          </div>
        )}
      </header>

      {/* Video Grid */}
      <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 md:px-10 w-full max-w-7xl">
        {currentItems.map((item) => (
          <CardComponent
            key={item._id}
            id={item._id}
            imageUrl={item.thumbnailUrl || "https://via.placeholder.com/150"}
            title={item.title}
            rightIcon={videoclick}
            videoUrl={item.signedUrl}
            description={item.description || "No description available"}
            from="videos"
          />
        ))}
      </div>

      {/* Pagination - Only shows on the main Videos page */}
      {totalPages > 1 && isRootVideosRoute && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default Videos;
