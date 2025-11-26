import React, { useRef, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Share2 } from "lucide-react";
import WomanImage from "../assets/Rectangle.png";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
} from "lucide-react";

const SpecificPodcast = () => {
  const { podcastId } = useParams();
  const { state } = useLocation(); // ✅ get passed state data
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
  const { imageUrl, title, description, podcastUrl } = state || {};
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: {title},
          text: {description},
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

  return (
    <div className="flex flex-col items-center py-20 sm:py-12 md:py-16 lg:py-20 min-h-screen w-full bg-white">
      <div className="max-w-full sm:max-w-4xl md:max-w-6xl lg:max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 font-sans leading-relaxed text-sm sm:text-base md:text-lg">

        <header className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 w-full">
            <button
            onClick={() => window.history.back()} // goes back one step in browser history
            className="bg-black text-white rounded-2xl px-4 py-2 font-semibold text-sm shadow hover:bg-gray-900 transition"
          >
            ← Back
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center flex-1">
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
          {/* Podcast Player */}
          <div
            className="w-[90%] sm:w-[500px] md:w-[650px] lg:w-[800px] h-[400px] sm:h-[450px] md:h-[500px]
    bg-[#FF000040] rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl
    backdrop-blur-sm transition-all duration-300"
          >
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-[260px] object-cover rounded-md"
            />
            <h2 className="text-black font-semibold text-sm mt-2">“{title}”</h2>

            <audio
              ref={audioRef}
              src={podcastUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center justify-center gap-3 mt-2 text-black">
              <button onClick={() => skip(-10)} className="hover:text-gray-700">
                <RotateCcw size={18} />
              </button>
              <button onClick={() => skip(-5)} className="hover:text-gray-700">
                <SkipBack size={18} />
              </button>
              <button
                onClick={togglePlay}
                className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button onClick={() => skip(5)} className="hover:text-gray-700">
                <SkipForward size={18} />
              </button>
              <button onClick={() => skip(10)} className="hover:text-gray-700">
                <RotateCw size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full mt-2 text-xs text-gray-700">
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
                className="flex-grow accent-black cursor-pointer"
              />
              <span>{duration ? duration.toFixed(2) : "0.00"}</span>
            </div>
          </div>

          {/* Description Section — same width as player */}
          <div className="w-[90%] sm:w-[500px] md:w-[650px] lg:w-[800px] text-gray-700">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">
              Description
            </h3>
            <p className="m-0 text-sm sm:text-base md:text-lg">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificPodcast;