import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Motivation from "../../components/Motivation";
import PodcastCard from "./components/PodcastCard";
import HorizontalCard from "../../components/HorizontalCard";
import Pagination from "../../components/Pagination";
import { useGetRecordedPodcastsQuery } from "../../services/allApi";

function Podcasts() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useGetRecordedPodcastsQuery();
  const location = useLocation();
  const currentPath = location.pathname;

  // Context Logic
  const fromMain = currentPath === "/" || currentPath === "/home";
  const isRootPodcastRoute = currentPath === "/podcasts";
  
  const ITEMS_PER_PAGE = 15;
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);

  const CardComponent = fromMain ? HorizontalCard : PodcastCard;

  useEffect(() => {
    if (data) {
      const total = data?.results || 0;
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      
      // Limit to 6 items if on Home page, otherwise use pagination
      const items = fromMain
        ? data?.data?.podcasts.slice(0, 6)
        : data?.data?.podcasts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        
      setCurrentItems(items || []);
    }
  }, [data, currentPage, fromMain]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20 text-gray-500">Loading podcasts...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading podcasts. Please try again later.</div>;

  // --- Dynamic Styling Based on Context ---
  const containerPadding = fromMain 
    ? "py-8 sm:py-12 md:py-16" 
    : "py-12 sm:py-16 md:py-24 lg:py-32 min-h-[98vh]";

  const titleSize = fromMain
    ? "text-2xl sm:text-3xl md:text-4xl"
    : "text-3xl sm:text-4xl md:text-5xl";

  return (
    <div className={`flex flex-col items-center w-full relative ${containerPadding}`}>
      {isRootPodcastRoute && <Motivation />}

      {/* Header Row */}
      <header className={`relative flex justify-center items-center w-full px-4 sm:px-8 max-w-7xl ${fromMain ? "mb-6" : "mb-8 sm:mb-10 md:mb-12"}`}>
        <h1 className={`${titleSize} font-extrabold text-gray-900 text-center w-full`}>
          Podcasts
        </h1>

        {fromMain && (
          <div className="absolute right-4 sm:right-6 md:right-10 top-1/2 -translate-y-1/2">
            <Link
              to="/podcasts"
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white text-xs sm:text-sm font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <span>View All</span>
            </Link>
          </div>
        )}
      </header>

      {/* Podcast Cards Grid */}
      <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 md:px-10 w-full max-w-7xl">
        {currentItems.map((item) => {
          const start = item.actualStart ? new Date(item.actualStart) : null;
          const end = item.actualEnd ? new Date(item.actualEnd) : null;

          const startTime = start ? start.toISOString() : null;
          const endTime = end ? end.toISOString() : null;

          const computedDuration =
            start && end ? (end.getTime() - start.getTime()) / 1000 : null;

          return (
            <CardComponent
              key={item._id}
              id={item._id}
              imageUrl={item.coverImage}
              title={item.title}
              description={item.description}
              podcastUrl={item.recordedSignedUrl}
              startTime={startTime}
              endTime={endTime}
              computedDuration={computedDuration}
              totalListeners={item.totalListeners}
              activeListeners={item.activeListeners}
            />
          );
        })}
      </div>

      {/* Pagination - Hidden on Home */}
      {totalPages > 1 && isRootPodcastRoute && (
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

export default Podcasts;