import React, { useRef, useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Share2 } from "lucide-react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useGetLivePodcastsQuery } from "../../services/allApi";

const SpecificLive = () => {
  const { liveId } = useParams(); // liveId from URL params (to be dynamic)
  const { data, isLoading, error } = useGetLivePodcastsQuery(liveId); // Fetch the podcast data based on the liveId
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (data && audioRef.current) {
      const audio = audioRef.current;
      audio.play();
      setIsPlaying(true);
    }
  }, [data]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    setDuration(audio.duration);
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = Math.min(
      Math.max(0, audio.currentTime + seconds),
      duration
    );
  };

  // Extract data from the API response
  const { title, coverImage, description, ivsPlaybackUrl } = data?.data?.podcast || {};

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: description,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert(
        "Share functionality is not supported in this browser. You can copy the link manually."
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading live event. Please try again later.</div>;
  }

  return (
    <div className="flex flex-col items-center py-20 sm:py-12 md:py-16 lg:py-20 min-h-screen w-full bg-white">
      <div className="max-w-full sm:max-w-4xl md:max-w-6xl lg:max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 font-sans leading-relaxed text-sm sm:text-base md:text-lg">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 w-full">
          <button
            onClick={() => window.history.back()} // goes back one step in browser history
            className="bg-black text-white rounded-2xl px-4 py-2 font-semibold text-sm shadow hover:bg-gray-900 transition"
          >
            ← Back
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center flex-1 text-gray-900">
            {title}
          </h1>
          <button
            onClick={handleShare}
            className="text-black hover:text-gray-700 transition"
          >
            <Share2 size={24} />
          </button>
        </header>

        {/* Center the container and enlarge it */}
        <div className="my-10 flex flex-col items-center gap-8">
          {/* Live Event Player */}
          <div
            className="w-[90%] sm:w-[500px] md:w-[650px] lg:w-[800px] h-[400px] sm:h-[450px] md:h-[500px]
            bg-[#05eb5140] rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl
            backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
          >
            <img
              src={coverImage || "https://via.placeholder.com/300"} // Default image if no coverImage
              alt={title}
              className="w-full h-[260px] object-cover rounded-md shadow-lg"
            />
            <h2 className="text-black font-semibold text-lg mt-2">“{title}”</h2>

            <audio
              ref={audioRef}
              src={ivsPlaybackUrl} // live stream URL from API
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              autoPlay
            />

            <div className="flex items-center justify-center gap-6 mt-4 text-black">
              <button onClick={() => skip(-10)} className="hover:text-gray-700">
                <RotateCcw size={20} />
              </button>
              <button onClick={() => skip(-5)} className="hover:text-gray-700">
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={() => skip(5)} className="hover:text-gray-700">
                <SkipForward size={20} />
              </button>
              <button onClick={() => skip(10)} className="hover:text-gray-700">
                <RotateCw size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 w-full mt-2 text-xs text-gray-700">
              <span>{currentTime.toFixed(2)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value);
                  const audio = audioRef.current;
                  audio.currentTime = newTime;
                  setCurrentTime(newTime);
                }}
                className="flex-grow accent-blue-600 cursor-pointer"
              />
              <span>{duration ? duration.toFixed(2) : "0.00"}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="w-[90%] sm:w-[500px] md:w-[650px] lg:w-[800px] text-gray-700 mt-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              Description
            </h3>
            <p className="text-sm sm:text-base md:text-lg">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificLive;
