import React, { useRef, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Share2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Users,
  UserCheck,
} from "lucide-react";

const SpecificPodcast = () => {
  const { podcastId } = useParams();
  const { state } = useLocation();

  const audioRef = useRef(null);

  const {
    imageUrl,
    title,
    description,
    podcastUrl,
    duration: backendDuration,

    // NEW FIELDS
    activeListeners = 0,
    totalListeners = 0,
  } = state || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(backendDuration || 0);

  useEffect(() => {
    if (backendDuration) setDuration(backendDuration);
  }, [backendDuration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!backendDuration && audio?.duration) {
      setDuration(audio.duration);
    }
    setIsReady(true);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const skip = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.min(
      Math.max(0, audio.currentTime + seconds),
      duration
    );
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (value) => {
    if (!value || isNaN(value)) return "00:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported. Copy the link manually.");
    }
  };

  return (
    <div className="flex flex-col items-center py-20 min-h-screen w-full bg-white">
      <div className="max-w-4xl w-full mx-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <button
            onClick={() => window.history.back()}
            className="bg-black text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-gray-900"
          >
            ← Back
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-center flex-1">
            {title}
          </h1>

          <button
            onClick={handleShare}
            className="text-black hover:text-gray-700"
          >
            <Share2 size={26} />
          </button>
        </header>

        {/* Active + Total Listeners */}
        <div className="flex justify-center gap-6 mt-4 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-green-600" />
            <span className="font-semibold">{activeListeners}</span>
            <span>Listening Now</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <span className="font-semibold">{totalListeners}</span>
            <span>Total Listeners</span>
          </div>
        </div>

        {/* Audio Player */}
        <div className="my-10 flex flex-col items-center w-full">
          <div className="w-full sm:w-[480px] md:w-[600px] bg-[#FFE7E760] rounded-xl p-6 shadow-xl flex flex-col items-center">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-[260px] rounded-md object-cover shadow"
            />

            <h2 className="text-black font-semibold text-lg mt-4">{title}</h2>

            <audio
              ref={audioRef}
              src={podcastUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-5 text-black">
              <button onClick={() => skip(-10)} className="hover:text-gray-700">
                <RotateCcw size={22} />
              </button>

              <button onClick={() => skip(-5)} className="hover:text-gray-700">
                <SkipBack size={22} />
              </button>

              <button
                disabled={!isReady}
                onClick={togglePlay}
                className={`p-3 rounded-full ${
                  isReady
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-400 text-white"
                }`}
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
              </button>

              <button onClick={() => skip(5)} className="hover:text-gray-700">
                <SkipForward size={22} />
              </button>

              <button onClick={() => skip(10)} className="hover:text-gray-700">
                <RotateCw size={22} />
              </button>
            </div>

            {/* Custom Timeline */}
            <div className="flex items-center gap-3 w-full mt-5 text-xs text-gray-700">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>

              <div className="relative flex-grow h-2 bg-gray-300 rounded-full cursor-pointer group">
                <div
                  className="h-2 bg-red-600 rounded-full"
                  style={{
                    width: `${(currentTime / duration) * 100}%`,
                  }}
                />

                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                  style={{
                    left: `${(currentTime / duration) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                ></div>

                {/* Scrubbing */}
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => {
                    const newTime = Number(e.target.value);
                    audioRef.current.currentTime = newTime;
                    setCurrentTime(newTime);
                  }}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>

              <span className="w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="w-full sm:w-[480px] md:w-[600px] mt-6 text-gray-700">
            <h3 className="text-lg font-bold mb-2">Description</h3>
            <div
              className="prose prose-sm sm:prose-base md:prose-lg max-w-none leading-relaxed font-normal text-gray-600 custom-html-content"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificPodcast;
