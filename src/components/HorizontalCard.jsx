import React from "react";
import { Link } from "react-router-dom";

export default function HorizontalCard({
  id,
  imageUrl,
  title,
  rightIcon,
  videoUrl,
  from,
  author,
  publishedDate,
  headline,
  description,
  pdfLink,
  podcastUrl,
  linkText,
  blogContent,
}) {
  return (
    <Link
      to={`/${from}/${id}`}
      state={{
        id,
        imageUrl,
        title,
        videoUrl,
        headline,
        author,
        publishedDate,
        description,
        pdfLink,
        podcastUrl,
        linkText,
        blogContent,
      }}
      className="flex items-center w-full max-w-md bg-black rounded-xl overflow-hidden shadow-md hover:scale-[1.02] transition-transform"
    >
      {/* Left Image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-20 h-20 object-cover rounded-l-xl flex-shrink-0"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/80x80/000000/777777?text=No+Image";
        }}
      />

      <div className="flex-1 px-4 py-3 text-white font-semibold text-sm sm:text-base truncate">
        {from === "publications" || from === "blog" ? headline : title}
      </div>


      <div className="bg-[#D75757] w-16 h-full flex items-center justify-center">
        {typeof rightIcon === "string" ? (
          <img src={rightIcon} alt="icon" className="w-6 h-6" />
        ) : (
          rightIcon || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          )
        )}
      </div>
    </Link>
  );
}
