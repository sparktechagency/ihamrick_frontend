import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const SpecificLive = () => {
  const [socket, setSocket] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [currentVolume, setCurrentVolume] = useState(1.0);
  const [podcastId, setPodcastId] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("Not Connected");
  const [audioStatus, setAudioStatus] = useState("Waiting for audio...");
  const [listeners, setListeners] = useState(0);
  const [peakListeners, setPeakListeners] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioQueueRef = useRef([]); // Using a ref for the audio queue

  useEffect(() => {
    initAudioContext(); // Initialize AudioContext when the component mounts
  }, []);

  // Initialize AudioContext and GainNode when the component mounts
  const initAudioContext = () => {
    if (!audioContext) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const node = context.createGain();
      node.gain.value = currentVolume;
      node.connect(context.destination); // Connect the gain node to the speakers
      setAudioContext(context);
      setGainNode(node);
      console.log("AudioContext Initialized");
    }
  };

  const updateStatus = (message, type = "info") => {
    setStatus(message);
  };

  const updateAudioStatus = (message, isPlaying = false) => {
    setAudioStatus(message);
    if (isPlaying) {
      setAudioStatus((prev) => `${prev} (Playing)`);
    }
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value / 100;
    setCurrentVolume(volume);
    if (gainNode) {
      gainNode.gain.value = volume;
    }
  };

  const joinPodcast = async () => {
    try {
      const serverUrl = "http://10.10.20.73:5005"; // Replace with your server URL
      if (!podcastId) {
        alert("Please enter Podcast ID");
        return;
      }

      updateStatus("Connecting to server...", "info");

      const socketInstance = io(`${serverUrl}/podcast`, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        updateStatus("Connected. Joining podcast room...", "success");
        socketInstance.emit("join-podcast", {
          podcastId,
          userId: userId || undefined,
        });
      });

      socketInstance.on("joined-podcast", (data) => {
        updateStatus("✅ Joined podcast room", "success");
        setListeners(data.currentListeners);
        updateAudioStatus("Waiting for admin to broadcast...");
      });

      socketInstance.on("listener-update", (data) => {
        setListeners(data.currentListeners);
        setPeakListeners(data.peakListeners);
      });

      socketInstance.on("audio-stream", async (data) => {
        try {
          // Ensure audioContext is initialized before proceeding
          if (!audioContext) {
            console.error("AudioContext not initialized. Initializing now...");
            initAudioContext(); // Initialize audio context if not already done
          }

          if (!audioContext) {
            throw new Error("AudioContext is still null, cannot process audio.");
          }

          // Decode base64 to binary string
          let binaryString = atob(data.audioChunk);
          const byteLength = binaryString.length;

          // Ensure the byte length is a multiple of 2 (Int16 requires 2 bytes per sample)
          if (byteLength % 2 !== 0) {
            console.error(
              "Audio chunk length is not a multiple of 2, trimming extra byte"
            );
            binaryString = binaryString.slice(0, byteLength - 1); // Remove the last byte if it's not aligned
          }

          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Create Int16Array from the bytes (each sample is 2 bytes)
          const int16Array = new Int16Array(bytes.buffer);

          // Convert Int16 PCM to Float32 for Web Audio API
          const float32Array = new Float32Array(int16Array.length);
          for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] =
              int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7fff);
          }

          const sampleRate = data.sampleRate || 48000;
          const channels = data.channels || 1;
          const audioBuffer = audioContext.createBuffer(
            channels,
            float32Array.length,
            sampleRate
          );
          audioBuffer.getChannelData(0).set(float32Array);

          // Add the audioBuffer to the queue
          audioQueueRef.current.push(audioBuffer);

          // Update UI status
          updateAudioStatus(
            `🎵 Receiving audio • Queue: ${audioQueueRef.current.length}`,
            true
          );

          // Play the audio if not already playing
          if (!isPlaying) {
            playNextBuffer();
          }
        } catch (error) {
          console.error("Error processing audio:", error);
          updateAudioStatus("❌ Error: " + error.message);
        }
      });

      socketInstance.on("podcast-started", () => {
        updateAudioStatus("📡 Broadcast started, waiting for audio...");
      });

      socketInstance.on("disconnect", (reason) => {
        updateStatus("Disconnected: " + reason, "error");
        updateAudioStatus("Disconnected from server");
      });

      setIsPlaying(false);
    } catch (error) {
      updateStatus("Error: " + error.message, "error");
    }
  };

  const leavePodcast = () => {
    if (socket) {
      socket.emit("leave-podcast", { podcastId });
      socket.disconnect();
    }

    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
      setGainNode(null);
    }

    setIsPlaying(false);
    setListeners(0);
    setPeakListeners(0);
    updateStatus("Left podcast", "info");
    updateAudioStatus("Not listening");
  };

  // Function to process and play the next audio buffer
  const playNextBuffer = () => {
    if (audioQueueRef.current.length === 0) {
      setIsPlaying(false);
      updateAudioStatus("⏸️ Waiting for more audio...", false);
      return;
    }

    setIsPlaying(true);
    const audioBuffer = audioQueueRef.current.shift(); // Get the next audio buffer from the ref

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);

    source.onended = () => {
      playNextBuffer(); // Keep playing audio buffers when the current one ends
    };

    const now = audioContext.currentTime;
    source.start(now); // Start playing the audio
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "50px auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", fontSize: "2em" }}>
        🎧 Live Audio Listener
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="podcastId" style={{ fontWeight: "bold", color: "#444" }}>
          Podcast ID:
        </label>
        <input
          type="text"
          id="podcastId"
          value={podcastId}
          onChange={(e) => setPodcastId(e.target.value)}
          placeholder="Enter podcast ID"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "1em",
            marginTop: "5px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            backgroundColor: "#f5f5f5",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
        <button
          onClick={joinPodcast}
          style={{
            padding: "15px",
            fontSize: "16px",
            color: "white",
            backgroundColor: "#2196F3",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "48%",
          }}
        >
          🎧 Join Podcast
        </button>
        <button
          onClick={leavePodcast}
          disabled={!socket}
          style={{
            padding: "15px",
            fontSize: "16px",
            color: "white",
            backgroundColor: "#9E9E9E",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "48%",
            opacity: !socket ? 0.5 : 1,
          }}
        >
          👋 Leave Podcast
        </button>
      </div>

      {/* Display Statuses */}
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            marginTop: "20px",
            borderLeft: "4px solid #2196F3",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontWeight: "bold", color: "#444" }}>
            Connection Status
          </div>
          <div style={{ color: "#888" }}>{status}</div>
        </div>

        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "20px",
            borderLeft: "4px solid #ffc107",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <div style={{ fontWeight: "bold", color: "#444" }}>Audio Status</div>
          <div style={{ color: "#888" }}>{audioStatus}</div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label htmlFor="volumeSlider" style={{ fontWeight: "bold", color: "#444" }}>
            Volume:
          </label>
          <input
            type="range"
            id="volumeSlider"
            min="0"
            max="100"
            value={currentVolume * 100}
            onChange={handleVolumeChange}
            style={{ width: "100%", marginTop: "5px" }}
          />
          <span>{Math.round(currentVolume * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SpecificLive;
