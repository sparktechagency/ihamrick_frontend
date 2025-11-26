import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Share2, Eye } from "lucide-react";
import { useGetPublicationByIdQuery } from "../../../services/allApi";
const SpecificPublication = () => {
  const { publicationId } = useParams();
  const { data, error, isLoading } = useGetPublicationByIdQuery(publicationId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const publication = data?.data || {};
  const {title,author,publicationDate,description,coverImage,file}=publication

  if (error) {
    return <div>Error loading blog</div>;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title || "Publication",
          text: description || "",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      alert(
        "Share functionality is not supported in this browser. You can copy the link manually."
      );
    }
  };

  return (
    <div className="flex flex-col items-center py-20 min-h-screen w-full bg-white font-sans">
      <div className="max-w-xl w-full mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between py-10 gap-3 mb-8">
          <button
            onClick={() => window.history.back()} // goes back one step in browser history
            className="bg-black text-white rounded-2xl px-4 py-2 font-semibold text-sm shadow hover:bg-gray-900 transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-center flex-1">
            {title}
          </h1>
          <button
            onClick={handleShare}
            className="text-black hover:text-gray-700 transition"
          >
            <Share2 size={24} />
          </button>
        </header>

        {/* Publication Image */}
        <div className="mb-8 overflow-hidden rounded-lg shadow-md">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-auto block object-cover max-w-full"
          />
        </div>

        {/* Publication Content */}
        <div className="text-gray-900 text-center">
          {/* Author & Date */}
          <div className="flex flex-col items-center text-sm mb-6 space-y-2">
            {publicationDate && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">Published:</span>
                <span>{publicationDate}</span>
              </div>
            )}
            {author && (
              <div className=" w-full max-w-xs mx-auto">
                <span className="font-medium block">Author Name:</span>
                <ul className="">
                  <li>{author}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="text-left mt-6">
              <h3 className="text-base font-bold mb-2">Description:</h3>
              <p className="text-sm">{description}</p>
            </div>
          )}

          {file ? (
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 
               bg-gray-100 border border-gray-300 text-gray-800 
               rounded-md px-4 py-2 text-sm font-semibold 
               shadow-sm hover:bg-gray-200 transition"
            >
              <span>View PDF</span>
              <Eye size={18} />
            </a>
          ) : (
            <p className="mt-8 text-center text-sm text-gray-400">
              PDF not available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificPublication;
