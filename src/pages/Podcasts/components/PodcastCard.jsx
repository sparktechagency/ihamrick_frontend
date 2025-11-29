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

const PodcastCard = ({ id, imageUrl, title, description, podcastUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handleOtherPlay = (e) => {
      if (e.detail.id !== id && isPlaying) {
        setIsPlaying(false);
      }
    };
    window.addEventListener("podcastPlay", handleOtherPlay);
    return () => window.removeEventListener("podcastPlay", handleOtherPlay);
  }, [id, isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    // Pause any other audio
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
      currentAudio = audio;
      currentCardId = id;
      // Notify other cards
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
    setDuration(audioRef.current.duration);
  };

  const skip = (seconds, e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    audio.currentTime = Math.min(
      Math.max(0, audio.currentTime + seconds),
      duration
    );
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (currentAudio === audioRef.current) currentAudio = null;
    currentCardId = null;
  };

  return (
    <div className="relative h-[289px] bg-[#FF000040] rounded-xl p-3 flex flex-col items-center shadow-lg transition-all duration-300 hover:shadow-red-500/50">

      <Link
        to={`/podcasts/${id}`}
        state={{ id, imageUrl, title, description, podcastUrl }}
        className="w-full text-center"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[150px] object-cover rounded-md"
        />
        <h2 className="text-black font-semibold text-sm mt-2">
          “{`"${title}"`}”
        </h2>
      </Link>

      <audio
        ref={audioRef}
        src={podcastUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-center gap-3 mt-2 text-black ">
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
    </div>
  );
};

export default PodcastCard;
