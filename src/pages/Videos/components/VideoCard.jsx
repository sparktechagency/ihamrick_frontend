import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ id, imageUrl, title, description, videoUrl }) => {
  return (
    <div
      className="relative bg-black w-full max-w-[380px] h-[300px] rounded-2xl overflow-hidden shadow-2xl 
                 transition-all duration-300 hover:shadow-red-500/50"
    >
      <div className="w-full h-full flex-shrink-0 relative">
        <Link
          to={`/videos/${id}`}
          state={{ id, imageUrl, title, description, videoUrl }} // ✅ send all data as state
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/000000/777777?text=Image+Load+Failed";
            }}
          />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth="0"
                className="w-7 h-7"
              >
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
          </div>

          {/* Transparent Title Section */}
          <div
            className="absolute bottom-0 left-0 w-full p-4 backdrop-blur-sm 
                bg-gradient-to-t from-[#3D3D3D] to-black/30"
          >
            <p
              className="text-white text-lg md:text-xl font-semibold text-center truncate"
              title={title}
            >
              {title}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VideoCard;
