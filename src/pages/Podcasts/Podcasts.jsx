import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Motivation from "../../components/Motivation";
import PodcastCard from "./components/PodcastCard";
import HorizontalCard from "../../components/HorizontalCard"; // ✅ Your alternative card
import Pagination from "../../components/Pagination";
import { useGetRecordedPodcastsQuery } from "../../services/allApi";
import { useGetRecordedPodcastByIdQuery } from "../../services/allApi";
function Podcasts() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useGetRecordedPodcastsQuery();
  const location = useLocation();
  const currentPath = location.pathname;
  const fromMain = currentPath === "/" || currentPath === "/home";
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);

  const ITEMS_PER_PAGE = 15;
  const isRootPodcastRoute = currentPath === "/podcasts";
  const CardComponent = fromMain ? HorizontalCard : PodcastCard;
  useEffect(() => {
    if (data) {
      const total = data?.results || 0;
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const items =
        data?.data?.podcasts.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];
      setCurrentItems(items);
    }
  }, [data, currentPage]);
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading podcasts. Please try again later.</div>;
  }

  return (
    <div className="flex flex-col items-center py-12 sm:py-16 md:py-24 lg:py-32 min-h-[98vh] relative w-full">
      {isRootPodcastRoute && <Motivation />}
      {/* Header Row */}
      <header className="relative flex justify-center items-center mb-8 sm:mb-10 md:mb-12 w-full px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center w-full">
          Podcasts
        </h1>

        {/* View All Button (Right side) */}
        {fromMain && (
          <div className="absolute right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2">
            <Link
              to="/podcasts"
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white text-xs sm:text-sm md:text-base font-semibold rounded-md sm:rounded-lg shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              <span>View All</span>
            </Link>
          </div>
        )}
      </header>

      {/* Podcast Cards */}
      <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px-4 sm:px-6 md:px-10 w-full max-w-7xl">
        {currentItems.map((item) => (
          <CardComponent
            key={item._id}
            id={item._id}
            imageUrl={item.coverImage}
            title={item.title}
            description={item.description}
            podcastUrl={item.recordedSignedUrl}
            from="podcasts"
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && isRootPodcastRoute && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default Podcasts;
