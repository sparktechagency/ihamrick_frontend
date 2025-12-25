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
    <div className="w-full bg-[#F7F6FA] border-b-2 border-gray-700 py-4">
      {/* Text Content */}
      <div className="flex justify-between items-center px-6">
        <p
          className="text-black text-lg md:text-xl font-semibold text-left truncate overflow-hidden text-ellipsis"
          title={headline} // shows full headline on hover
        >
          {headline}
        </p>

        <div className="flex justify-end">
          {/* Use <Link> and dynamic 'to' prop */}
          <Link
            to={`/blog/${id}`}
            state={{ id, imageUrl, headline, blogContent }}
            className="text-red-600 hover:text-red-500 transition-colors duration-200 text-lg font-bold uppercase tracking-wider flex items-center group"
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
