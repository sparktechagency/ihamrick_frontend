import React from "react";

import { Link } from "react-router-dom";


const BlogCard = ({ id, imageUrl, headline, linkText, blogContent }) => {
  const RightArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
  return (
    <div
      className="bg-black w-full max-w-[380px] h-[380px] md:h-[380px] 
                 rounded-2xl overflow-hidden shadow-2xl 
                 transition-all duration-300 hover:shadow-red-500/50 
                 flex flex-col"
    >
      {/* Image Section */}
      <div className="w-full h-[70%] flex-shrink-0 p-2">
        <img
          src={imageUrl}
          alt="Article related visual"
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/000000/777777?text=Image+Load+Failed";
          }}
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-between p-6 h-[120px]">
        <p
          className="text-white text-lg md:text-xl font-semibold text-center leading-snug 
                     truncate overflow-hidden text-ellipsis"
          title={headline} // shows full headline on hover
        >
          {`"${headline}"`}
        </p>

        <div className="flex justify-center">
          {/* 2. Use <Link> and dynamic 'to' prop */}
          <Link
            to={`/blog/${id}`} // <-- Correctedcomponent
            state={{ id, imageUrl, headline, blogContent }}
            className="text-red-600 hover:text-red-500 transition-colors duration-200 
                       text-lg font-bold uppercase tracking-wider flex items-center group"
            aria-label={`Read more about ${headline}`}
          >
            {linkText}
            <RightArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
