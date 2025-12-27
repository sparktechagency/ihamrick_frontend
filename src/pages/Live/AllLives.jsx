import React, { useState, useMemo } from "react";
import LiveCard from "./LiveCard";
import { useGetAllPodcastQuery } from "../../services/allApi";

const AllLives = () => {
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data, isLoading, error } = useGetAllPodcastQuery({ sortBy, sortOrder });

  // Format and filter data in one place
  const liveEvents = useMemo(() => {
    const podcasts = data?.data?.podcasts ?? [];
    return podcasts
      .filter((podcast) => podcast.status === "live" || podcast.status === "scheduled")
      .map((event) => ({
        id: event._id,
        title: event.title,
        description: event.description || "No description available",
        imageUrl: event.coverImage || "https://via.placeholder.com/300",
        liveStatus: event.status,
      }));
  }, [data]);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading live events.</div>;

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 py-40 md:py-24">
        
        <div className="flex flex-col gap-8">
          {/* Header Section - Now always vertical */}
          <div className="flex flex-col gap-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              All Live Events
            </h1>

            {/* Filters Section */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex flex-col gap-1 w-full sm:w-56">
                <label className="text-sm font-medium text-gray-700">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md hover:bg-gray-700 transition focus:outline-none"
                >
                  <option value="title">Title</option>
                  <option value="createdAt">Date</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-56">
                <label className="text-sm font-medium text-gray-700">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md hover:bg-gray-700 transition focus:outline-none"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Cards Grid */}
          <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          
          {liveEvents.length === 0 && (
            <p className="text-gray-500 text-center py-10">No live or scheduled events found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllLives;