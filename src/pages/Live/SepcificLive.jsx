import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Share2 } from "lucide-react";
import { Play, Pause } from "lucide-react";
import io from "socket.io-client";
import "../../assets/hyperlink.css";
const SpecificPodcast = () => {
  const { liveId } = useParams();
  const { search, state } = useLocation();

  // Parse query parameters or use fallback values
  const queryParams = new URLSearchParams(search);
  const imageUrl =
    queryParams.get("imageUrl") ||
    state?.imageUrl ||
    "https://via.placeholder.com/150";
  const title = queryParams.get("title") || state?.title || "Untitled Podcast";
  const description =
    queryParams.get("description") ||
    state?.description ||
    "No description available";
  const podcastUrl =
    queryParams.get("liveStreamUrl") || state?.liveStreamUrl || "#";

  // Audio and WebSocket-related state and references
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [listenerCount, setListenerCount] = useState(0);

  // WebSocket and MediaSource references
  let socket = useRef(null);
  let mediaSource = useRef(null);
  let sourceBuffer = useRef(null);
  let queue = useRef([]);
  let isBufferUpdating = useRef(false);

  // Join the podcast on component mount (when liveId is available)
  useEffect(() => {
    if (liveId) joinPodcast(); // If liveId is available, join the podcast
  }, [liveId]);

  // Handles connecting to the podcast
  const joinPodcast = () => {
    const serverUrl = "https://api.pg-65.com"; // Replace with your server URL
    const podcastId = liveId;

    if (!podcastId) return setConnectionStatus("Podcast ID is required");

    setConnectionStatus("Connecting...");
    setListenerCount(0);

    queue.current = [];
    mediaSource.current = new MediaSource();
    audioRef.current.src = URL.createObjectURL(mediaSource.current);

    mediaSource.current.addEventListener("sourceopen", () => {
      setConnectionStatus("Connected. Waiting for audio...");
      socket.current.emit("join-podcast", { podcastId });
    });

    socket.current = io(`${serverUrl}/podcast`, {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      setConnectionStatus("Connected");
    });

    socket.current.on("joined-podcast", (data) => {
      setListenerCount(data.currentListeners);
      setConnectionStatus(`Joined! Listeners: ${data.currentListeners}`);
    });

    socket.current.on("listener-update", (data) => {
      setListenerCount(data.currentListeners);
    });

    socket.current.on("audio-stream", async (data) => {
      const binaryString = window.atob(data.audioChunk);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      queue.current.push(bytes.buffer);
      processQueue();
    });

    socket.current.on("podcast-ended", () => {
      setConnectionStatus("Podcast ended");
      leavePodcast();
    });

    socket.current.on("disconnect", () => {
      setConnectionStatus("Disconnected");
    });
  };

  // Initializes the SourceBuffer for the MediaSource
  const initSourceBuffer = (mimeType) => {
    if (sourceBuffer.current || mediaSource.current.readyState !== "open")
      return;

    if (MediaSource.isTypeSupported(mimeType)) {
      try {
        sourceBuffer.current = mediaSource.current.addSourceBuffer(mimeType);
        sourceBuffer.current.mode = "sequence";
        sourceBuffer.current.addEventListener("updateend", () => {
          isBufferUpdating.current = false;
          processQueue();
        });
      } catch (e) {
        setConnectionStatus(`Error initializing audio: ${e.message}`, "error");
      }
    } else {
      setConnectionStatus(`Browser does not support ${mimeType}`, "error");
    }
  };

  // Process the queue of audio chunks
  const processQueue = () => {
    if (mediaSource.current.readyState !== "open") return;
    if (!sourceBuffer.current) {
      initSourceBuffer('audio/webm; codecs="opus"');
      return;
    }

    if (
      queue.current.length > 0 &&
      !isBufferUpdating.current &&
      !sourceBuffer.current.updating
    ) {
      try {
        const chunk = queue.current.shift();
        sourceBuffer.current.appendBuffer(chunk);
        isBufferUpdating.current = true;
      } catch (e) {
        setConnectionStatus(
          "Stream error: MediaSource closed. Please rejoin.",
          "error"
        );
      }
    }
  };

  // Handle the play/pause toggle
  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const leavePodcast = () => {
    if (socket.current) socket.current.disconnect();
    if (mediaSource.current && mediaSource.current.readyState === "open") {
      try {
        mediaSource.current.endOfStream();
      } catch (e) {}
    }

    setConnectionStatus("Disconnected");
    setListenerCount(0);
    queue.current = [];
    sourceBuffer.current = null;
    mediaSource.current = null;
    audioRef.current.src = "";
    // Navigate back to the previous page
    window.history.back();
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  return (
    <div className="flex flex-col items-center py-20 sm:py-12 md:py-16 lg:py-20 min-h-screen w-full bg-white">
      <div className="max-w-full sm:max-w-4xl md:max-w-6xl lg:max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 font-sans leading-relaxed text-sm sm:text-base md:text-lg">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2 w-full">
          <button
            onClick={() => window.history.back()}
            className="bg-black text-white rounded-2xl px-4 py-2 font-semibold text-sm shadow hover:bg-gray-900 transition"
          >
            ← Back
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center flex-1">
            {title}
          </h1>
          <button className="text-black hover:text-gray-700 transition">
            <Share2 size={24} />
          </button>
        </header>

        <div className="my-10 flex flex-col items-center gap-8">
          <div className="w-[90%] sm:w-[500px] md:w-[650px] lg:w-[800px] h-[400px] sm:h-[450px] md:h-[500px] bg-green-200 rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm transition-all duration-300">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-[260px] object-cover rounded-md"
            />
            <h2 className="text-black font-semibold text-sm mt-2">{title}</h2>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              controls
            />
            <div className="flex items-center justify-center gap-3 mt-2 text-black">
              <button
                onClick={togglePlay}
                className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={leavePodcast}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                Leave
              </button>
            </div>

            <div className="stats mt-4 text-sm text-gray-700">
              <span>Listeners: {listenerCount}</span>
              <span>Status: {connectionStatus}</span>
            </div>
          </div>

          <div className="w-[90%] sm:w-[500px] md:w-[650px] lg:w-[800px] text-gray-700">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">
              Description
            </h3>
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
