import React, { useState, useEffect } from "react";
import LiveCard from "./LiveCard"; // Import the LiveCard component
import { useGetAllPodcastQuery } from "../../services/allApi"; // Assuming you are using a service to fetch podcasts

const AllLives = () => {
  const [liveEvents, setLiveEvents] = useState([]);

  // Use your query hook to fetch live podcasts
  const { data, isLoading, error } = useGetAllPodcastQuery();

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
  }, [data]);
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
