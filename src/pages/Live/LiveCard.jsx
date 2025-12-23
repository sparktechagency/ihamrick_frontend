import React from "react";
import { Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";

const LiveCard = ({
  liveId,
  imageUrl,
  title,
  description,
  liveStreamUrl,
  liveStatus,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef(null);

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

  return (
    <div className="relative bg-green-200 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="p-2 mb-2 bg-red-500 text-white rounded-4xl hover:bg-blue-700 ">
        {liveStatus}
      </div>
      <Link
        to={`/live/${liveId}?imageUrl=${encodeURIComponent(
          imageUrl
        )}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(
          description
        )}&liveStreamUrl=${encodeURIComponent(
          liveStreamUrl
        )}&liveStatus=${encodeURIComponent(liveStatus)}`}
        className="w-full text-center"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[200px] object-cover rounded-lg shadow-md"
        />
        <h2 className="text-xl font-semibold text-gray-900 mt-4">{title}</h2>
        <div
          className="m-0 text-sm sm:text-base md:text-lg custom-html-content"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </Link>
      <audio ref={audioRef} src={liveStreamUrl} />
      {/* <div className="flex items-center justify-center gap-4 mt-4 text-gray-900">
        <button
          onClick={togglePlay}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div> */}
    </div>
  );
};

export default LiveCard;
