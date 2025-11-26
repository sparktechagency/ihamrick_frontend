import React, { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
} from "lucide-react";
import videoData from "./videoData";
import { useGetVideoByIdQuery } from "../../../services/allApi";
import { useNavigate } from "react-router-dom";

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

const SpecificVideo = () => {
  const { videoId } = useParams();
  const { state } = useLocation();

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const relatedVideosRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekProgress, setSeekProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { data, isLoading, error } = useGetVideoByIdQuery(videoId);
  const vd = data?.data || {};
  const { _id, title, description, transcription, signedUrl, thumbnailUrl, uploadDate, views } = vd;

  // --- Video Controls ---
  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) video.play();
    else video.pause();
  }, []);

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback(
    (e) => {
      const newVolume = parseFloat(e.target.value);
      const video = videoRef.current;
      if (!video) return;
      video.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        video.muted = false;
        setIsMuted(false);
      }
    },
    [isMuted]
  );

  const handleRateChange = useCallback((rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  }, []);

  const handleFullScreenToggle = useCallback(() => {
    const container = playerContainerRef.current;
    if (!container) return;
    if (!isFullScreen) {
      if (container.requestFullscreen) container.requestFullscreen();
      else if (container.webkitRequestFullscreen)
        container.webkitRequestFullscreen();
      else if (container.msRequestFullscreen) container.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  }, [isFullScreen]);

  // Fullscreen change listener
  useEffect(() => {
    const exitHandler = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("msfullscreenchange", exitHandler);
    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
      document.removeEventListener("msfullscreenchange", exitHandler);
    };
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && !isSeeking) {
      const newProgress = (video.currentTime / video.duration) * 100;
      setProgress(newProgress);
      setCurrentTime(video.currentTime);
    }
  };

  const handleMetadataLoad = () => {
    const video = videoRef.current;
    setDuration(video.duration);
    setVolume(video.volume);
    setIsMuted(video.muted);
  };

  const handleSeekStart = (e) => {
    setIsSeeking(true);
    handleSeeking(e);
  };

  const handleSeeking = (e) => {
    if (!isSeeking) return;
    const bar = e.currentTarget.parentNode;
    const rect = bar.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    clickX = Math.max(0, Math.min(rect.width, clickX));
    const percent = clickX / rect.width;
    setSeekProgress(percent * 100);
    setCurrentTime(percent * duration);
  };

  const handleSeekEnd = (e) => {
    if (!isSeeking) return;
    const bar = e.currentTarget.parentNode;
    const rect = bar.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    clickX = Math.max(0, Math.min(rect.width, clickX));
    const percent = clickX / rect.width;
    if (videoRef.current) videoRef.current.currentTime = percent * duration;
    setProgress(percent * 100);
    setIsSeeking(false);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isSeeking) handleSeeking(e);
    },
    [isSeeking]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ": // Spacebar to toggle play/pause
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft": // Left arrow: rewind 5 seconds
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case "ArrowRight": // Right arrow: forward 5 seconds
          video.currentTime = Math.min(video.duration, video.currentTime + 5);
          break;
        case "m": // M key: mute/unmute
        case "M":
          handleMuteToggle();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePlayPause, handleMuteToggle]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("loadedmetadata", handleMetadataLoad);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", () => setIsPlaying(true));
      video.addEventListener("pause", () => setIsPlaying(false));
      video.addEventListener("volumechange", () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
      });
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleSeekEnd);

    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", handleMetadataLoad);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", () => setIsPlaying(true));
        video.removeEventListener("pause", () => setIsPlaying(false));
        video.removeEventListener("volumechange", () => {
          setVolume(video.volume);
          setIsMuted(video.muted);
        });
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleSeekEnd);
    };
  }, [signedUrl, handleMouseMove]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title || "Video",
          text: description,
          url: window.location.href,
        })
        .catch((err) => console.log(err));
    } else alert("Copy the link manually, share not supported.");
  };

  // Scroll related videos
  const scrollRelated = (direction) => {
    if (!relatedVideosRef.current) return;
    const scrollAmount = 220;
    relatedVideosRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col items-center py-20 sm:py-10 md:py-16 bg-white min-h-screen w-full">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 md:px-8 font-sans">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3 py-10 w-full">
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

        {/* Video */}
        <div
          ref={playerContainerRef}
          className={`relative my-6 rounded-2xl overflow-hidden shadow-lg bg-black ${
            isFullScreen ? "fixed inset-0 z-50 rounded-none" : ""
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {signedUrl ? (
            <video
              ref={videoRef}
              src={signedUrl}
              poster={thumbnailUrl}
              playsInline
              className="w-full aspect-video object-contain"
              onClick={handlePlayPause}
            />
          ) : (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full aspect-video object-cover"
            />
          )}

          {/* Controls */}
          {signedUrl && (
            <>
              {!isPlaying && !isSeeking && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity duration-300"
                  onClick={handlePlayPause}
                >
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
                    <Play size={32} fill="white" />
                  </div>
                </div>
              )}
              <div
                className={`absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                  showControls || isPlaying ? "opacity-100" : "opacity-0"
                } ${isFullScreen ? "p-6" : ""}`}
              >
                {/* Progress */}
                <div
                  className="w-full h-1 bg-gray-600 rounded-full mb-2 sm:mb-3 relative group cursor-pointer"
                  onMouseDown={handleSeekStart}
                >
                  <div
                    className="h-1 bg-red-600 rounded-full"
                    style={{ width: `${isSeeking ? seekProgress : progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-red-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                    style={{
                      left: `${isSeeking ? seekProgress : progress}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>

                {/* Controls */}
                <div className="flex flex-wrap justify-between items-center text-white text-sm gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <button
                      onClick={handlePlayPause}
                      className="p-1 hover:text-red-500 transition"
                    >
                      {isPlaying ? (
                        <Pause size={24} fill="white" />
                      ) : (
                        <Play size={24} fill="white" />
                      )}
                    </button>
                    <div className="relative group flex items-center">
                      <button
                        onClick={handleMuteToggle}
                        className="p-1 hover:text-red-500 transition"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-0 opacity-0 group-hover:w-16 group-hover:opacity-100 transition-all duration-300 ml-1 h-1 rounded-full bg-gray-600 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                      />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="p-1 hover:text-red-500 transition"
                      >
                        <Settings size={20} />
                      </button>
                      {showSpeedMenu && (
                        <div className="absolute right-0 bottom-full mb-2 w-32 bg-black/80 text-white rounded-lg shadow-xl overflow-hidden z-20">
                          <p className="p-2 text-xs font-bold border-b border-gray-700">
                            Playback Speed
                          </p>
                          {playbackSpeeds.map((rate) => (
                            <button
                              key={rate}
                              onClick={() => handleRateChange(rate)}
                              className={`w-full text-left p-2 text-sm hover:bg-white/20 transition ${
                                playbackRate === rate
                                  ? "text-red-500 font-bold"
                                  : ""
                              }`}
                            >
                              {rate === 1 ? "Normal" : `${rate}x`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleFullScreenToggle}
                      className="p-1 hover:text-red-500 transition"
                    >
                      <Maximize size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-10 leading-relaxed">
            <span className="font-semibold">Description:</span> {description}
          </p>
        )}

        {/* Views and Upload Date */}
        <div className="text-sm text-gray-600 mb-4">
          <p>
            <strong>Views:</strong> {views}
          </p>
          <p>
            <strong>Uploaded on:</strong> {new Date(uploadDate).toLocaleDateString()}
          </p>
        </div>

        {/* Transcription */}
        {transcription && (
          <div className="text-sm text-gray-700">
            <h3 className="font-semibold">Transcription:</h3>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificVideo;
