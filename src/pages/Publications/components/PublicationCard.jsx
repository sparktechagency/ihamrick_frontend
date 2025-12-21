import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const PublicationCard = ({
  id,
  imageUrl,
  headline,
  author,
  publishedDate,
  description,
  pdfLink,
}) => {
  useEffect(() => {
  }, [id]); // Empty dependency array ensures it runs once after the first render

  return (
    <div
      className="bg-[#F7F6FA] w-full max-w-[380px] h-[380px] rounded-2xl 
                 overflow-hidden shadow-2xl flex flex-col transition-all 
                 duration-300 hover:shadow-red-500/50"
    >
      <Link
        to={`/publications/${id}`}
        state={{
          id,
          imageUrl,
          headline,
          author,
          publishedDate,
          description,
          pdfLink,
        }}
        className="flex flex-col h-full group"
        aria-label={`Read more about ${headline}`}
      >
        {/* Image Section */}
        <div className="w-full h-[60%]">
          <img
            src={imageUrl}
            alt={`Visual for ${headline}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/000000/777777?text=Image+Load+Failed";
            }}
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-between p-4 h-[40%]">
          <p
            className="text-lg md:text-xl font-semibold text-center leading-snug 
                       truncate overflow-hidden "
            title={headline}
          >
            {headline}
          </p>

          <div className="text-[#A8A6AC]">{publishedDate}</div>
        </div>
      </Link>
    </div>
  );
};

export default PublicationCard;
