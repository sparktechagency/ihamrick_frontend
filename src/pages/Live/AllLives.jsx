import React, { useState, useEffect } from "react";
import LiveCard from "./LiveCard"; // Import the LiveCard component
import { useGetAllPodcastQuery } from "../../services/allApi"; // Assuming you are using a service to fetch podcasts

const AllLives = () => {
  const [liveEvents, setLiveEvents] = useState([]);
  const [sortBy, setSortBy] = useState("title"); // Default sorting by title
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order is ascending

  // Use your query hook to fetch live podcasts
  const { data, isLoading, error } = useGetAllPodcastQuery({
    sortBy,
    sortOrder,
  });

  useEffect(() => {
    if (data) {
      // Filter the podcasts to only use those that are live
      const livePodcasts = data?.data?.podcasts.filter(
        (podcast) => podcast.status === "live" || podcast.status === "scheduled"
      );

      // Map over the live podcasts and format them for use in the LiveCard
      const formattedLiveEvents = livePodcasts.map((event) => ({
        id: event._id,
        title: event.title,
        description: event.description || "No description available",
        imageUrl: event.coverImage || "https://via.placeholder.com/300",
        liveStatus: event.status,
      }));
      setLiveEvents(formattedLiveEvents);
    }
  }, [data, sortBy, sortOrder]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading live events. Please try again later.</div>;
  }

  return (
    <div className="flex flex-col items-center py-12 sm:py-16 md:py-24 lg:py-32 min-h-screen w-full bg-white">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        All Live Events
      </h1>

      <div className="absolute top-1/4 right-4 sm:right-6 md:right-10 z-10 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-gray-900 text-white text-sm sm:text-base font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300 w-full sm:w-auto"
        >
          <option value="title">Sort by Title</option>
          <option value="createdAt">Sort by Date</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 bg-gray-900 text-white text-sm sm:text-base font-semibold rounded-md shadow-md hover:bg-gray-700 transition duration-300 w-full sm:w-auto"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Live Event Cards */}
      <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px-4 sm:px-6 md:px-10 w-full max-w-7xl">
        {liveEvents.map((event) => (
          <LiveCard
            key={event.id}
            liveId={event.id}
            imageUrl={event.imageUrl}
            title={event.title}
            description={event.description}
            liveStatus={event.liveStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default AllLives;
