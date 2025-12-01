import React, { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
} from "lucide-react";
import { useGetVideoByIdQuery } from "../../../services/allApi";

const formatTime = (time) => {
  if (!time || isNaN(time)) return "00:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

const SpecificVideo = () => {
  const { videoId } = useParams();
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [isSeeking, setIsSeeking] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { data } = useGetVideoByIdQuery(videoId);
  const vd = data?.data || {};
  const { title, description, transcription, signedUrl, thumbnailUrl, uploadDate, views } = vd;

  // ---------------------------
  // Video Ready
  // ---------------------------
  const onMetadata = () => {
    const v = videoRef.current;
    setDuration(v.duration);
    setVolume(v.volume);
    setIsMuted(v.muted);
    setIsReady(true);
  };

  // ---------------------------
  // Time Update
  // ---------------------------
  const onTimeUpdate = () => {
    if (!isSeeking) setCurrentTime(videoRef.current.currentTime);
  };

  // ---------------------------
  // Play/Pause
  // ---------------------------
  const togglePlay = () => {
    const v = videoRef.current;
    if (!isReady || !v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  // ---------------------------
  // Volume
  // ---------------------------
  const toggleMute = () => {
    const v = videoRef.current;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const changeVolume = (e) => {
    const v = videoRef.current;
    v.volume = parseFloat(e.target.value);
    v.muted = v.volume === 0;
    setVolume(v.volume);
    setIsMuted(v.muted);
  };

  // ---------------------------
  // Playback Speed
  // ---------------------------
  const changeSpeed = (rate) => {
    const v = videoRef.current;
    v.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  // ---------------------------
  // Fullscreen
  // ---------------------------
  const toggleFullScreen = () => {
    const c = playerContainerRef.current;
    if (!isFullScreen) c.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  useEffect(() => {
    const handler = () =>
      setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () =>
      document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ---------------------------
  // Seeking (Progress Bar Drag)
  // ---------------------------
  const seekFromEvent = (e) => {
    const bar = progressRef.current;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = x / rect.width;
    return percent * duration;
  };

  const startSeek = (e) => {
    if (!isReady) return;
    setIsSeeking(true);
    const time = seekFromEvent(e);
    setCurrentTime(time);
  };

  const doSeek = (e) => {
    if (!isSeeking) return;
    const time = seekFromEvent(e);
    setCurrentTime(time);
  };

  const endSeek = (e) => {
    if (!isSeeking) return;
    const time = seekFromEvent(e);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
    setIsSeeking(false);
  };

  // ---------------------------
  // Hover Preview
  // ---------------------------
  const onHoverMove = (e) => {
    const t = seekFromEvent(e);
    setHoverTime(t);
  };
  const onHoverLeave = () => setHoverTime(null);

  // ---------------------------
  // Attach global drag listeners
  // ---------------------------
  useEffect(() => {
    document.addEventListener("mousemove", doSeek);
    document.addEventListener("mouseup", endSeek);
    return () => {
      document.removeEventListener("mousemove", doSeek);
      document.removeEventListener("mouseup", endSeek);
    };
  }, [isSeeking]);

  return (
    <div className="flex flex-col items-center pt-20 bg-white min-h-screen">
      <div className="max-w-[1200px] w-full px-6">

        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <button
            onClick={() => window.history.back()}
            className="bg-black text-white rounded-xl px-4 py-2 text-sm"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">{title}</h1>
          <button className="text-black">
            <Share2 size={24} />
          </button>
        </header>

        {/* Video Player */}
        <div
          ref={playerContainerRef}
          className={`relative rounded-2xl overflow-hidden shadow bg-black ${
            isFullScreen ? "fixed inset-0 z-50 rounded-none" : ""
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {signedUrl && (
            <>
              <video
                ref={videoRef}
                src={signedUrl}
                poster={thumbnailUrl}
                className="w-full aspect-video object-contain"
                onLoadedMetadata={onMetadata}
                onTimeUpdate={onTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
              />

              {/* Loader */}
              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                  Loading…
                </div>
              )}

              {/* Big Play Button */}
              {!isPlaying && isReady && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <Play size={32} fill="white" />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent
                transition-opacity ${showControls ? "opacity-100" : "opacity-0"}`}
              >
                {/* Custom Progress Bar */}
                <div
                  ref={progressRef}
                  className="relative h-2 bg-gray-600 rounded-full cursor-pointer group"
                  onMouseDown={startSeek}
                  onMouseMove={onHoverMove}
                  onMouseLeave={onHoverLeave}
                >
                  <div
                    className="h-2 bg-red-600 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />

                  {/* Thumb */}
                  <div
                    className="absolute top-1/2 w-4 h-4 bg-red-600 rounded-full -translate-y-1/2 shadow
                    opacity-0 group-hover:opacity-100 transition"
                    style={{
                      left: `${(currentTime / duration) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />

                  {/* Hover Tooltip */}
                  {hoverTime !== null && (
                    <div
                      className="absolute bottom-full mb-1 px-2 py-1 text-xs bg-black text-white rounded"
                      style={{
                        left: `${(hoverTime / duration) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {formatTime(hoverTime)}
                    </div>
                  )}
                </div>

                {/* Buttons Row */}
                <div className="flex justify-between items-center mt-3 text-white text-sm">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay}>
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button onClick={toggleMute}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={changeVolume}
                    />

                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Speed Menu */}
                    <div className="relative">
                      <button onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                        <Settings size={20} />
                      </button>

                      {showSpeedMenu && (
                        <div className="absolute right-0 bottom-full bg-black/90 text-white w-32 rounded p-2">
                          {playbackSpeeds.map((rate) => (
                            <button
                              key={rate}
                              className={`block w-full text-left p-1 ${
                                playbackRate === rate ? "text-red-500" : ""
                              }`}
                              onClick={() => changeSpeed(rate)}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button onClick={toggleFullScreen}>
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <h2 className="text-xl font-bold mt-8 mb-4">Video Details</h2>

        <p><strong>Views:</strong> {views}</p>
        <p><strong>Uploaded:</strong> {new Date(uploadDate).toLocaleDateString()}</p>

        <p className="mt-4">{description}</p>

        {transcription && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Transcription</h3>
            <pre className="whitespace-pre-wrap text-gray-700">
              {transcription}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificVideo;
