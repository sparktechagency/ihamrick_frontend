import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { Link } from "react-router-dom";

let currentAudio = null;
let currentCardId = null;

const PodcastCard = ({
  id,
  imageUrl,
  title,
  description,
  podcastUrl,
  computedDuration,
  startTime,
  endTime,
  activeListeners,
  totalListeners,
}) => {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Duration prioritizes backend duration > audio duration
  const [duration, setDuration] = useState(computedDuration || 0);

  useEffect(() => {
    if (computedDuration) {
      setDuration(computedDuration);
    }
  }, [computedDuration]);

  useEffect(() => {
    const handleOtherPlay = (e) => {
      if (e.detail.id !== id && isPlaying) {
        setIsPlaying(false);
        audioRef.current?.pause();
      }
    };

    window.addEventListener("podcastPlay", handleOtherPlay);
    return () => window.removeEventListener("podcastPlay", handleOtherPlay);
  }, [id, isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    // If another card is playing -> pause it
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
      currentAudio = audio;
      currentCardId = id;

      window.dispatchEvent(new CustomEvent("podcastPlay", { detail: { id } }));
    } else {
      audio.pause();
      setIsPlaying(false);

      currentAudio = null;
      currentCardId = null;
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!computedDuration) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);

    if (currentAudio === audioRef.current) currentAudio = null;
    currentCardId = null;
  };

  const skip = (seconds, e) => {
    e.stopPropagation();

    const audio = audioRef.current;
    const newTime = Math.min(
      Math.max(0, audio.currentTime + seconds),
      duration
    );

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (value) => {
    if (isNaN(value) || value < 0) return "00:00";
    const m = Math.floor(value / 60);
    const s = Math.floor(value % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative h-[289px] bg-[#FF000040] rounded-xl p-3 flex flex-col items-center shadow-lg transition-all hover:shadow-red-500/50">
      {/* Header */}
      <Link
        to={`/podcasts/${id}`}
        state={{
          id,
          imageUrl,
          title,
          description,
          podcastUrl,
          endTime,
          startTime,
          duration,
          activeListeners,
          totalListeners,
        }}
        className="w-full text-center"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[150px] object-cover rounded-md"
        />

        <h2 className="text-black font-semibold text-sm mt-2">“{title}”</h2>
      </Link>

      {/* Audio */}
      <audio
        ref={audioRef}
        src={podcastUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-2 text-black">
        <button onClick={(e) => skip(-10, e)} className="hover:text-gray-700">
          <RotateCcw size={18} />
        </button>

        <button onClick={(e) => skip(-5, e)} className="hover:text-gray-700">
          <SkipBack size={18} />
        </button>

        <button
          onClick={togglePlay}
          className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button onClick={(e) => skip(5, e)} className="hover:text-gray-700">
          <SkipForward size={18} />
        </button>

        <button onClick={(e) => skip(10, e)} className="hover:text-gray-700">
          <RotateCw size={18} />
        </button>
      </div>

      {/* Slider + Time */}
      <div className="flex items-center gap-2 w-full mt-2 text-xs text-gray-700">
        <span>{formatTime(currentTime)}</span>

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
          className="flex-grow accent-black cursor-pointer"
        />

        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default PodcastCard;
