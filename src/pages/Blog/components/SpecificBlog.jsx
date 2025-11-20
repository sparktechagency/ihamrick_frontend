import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Share2 } from "lucide-react";
import { useGetBlogByIdQuery } from "../../../services/allApi";

const SpecificBlog = () => {
  const { blogId } = useParams();
  const { state } = useLocation();
  const { data, error, isLoading } = useGetBlogByIdQuery(blogId);
  const [showAlert, setShowAlert] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading blog</div>;
  }

  const blog = data?.data || {};
  const { title, description, coverImage } = blog;

  const handleShare = () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title,
          text: description,
          url: shareUrl,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error));
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => setShowAlert(true))
        .catch((error) => console.log("Error copying link:", error));
    } else {
      alert(shareUrl);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
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

          <button
            onClick={handleShare}
            className="text-black hover:text-gray-700 transition"
          >
            <Share2 size={24} />
          </button>
        </header>

        <div className="my-5 overflow-hidden rounded-lg shadow-md">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-auto block object-cover max-w-full"
          />
        </div>

        <div className="text-gray-700">
          <div className="mt-8 pt-3">
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">
              Description:
            </h3>
            <p className="m-0 text-sm sm:text-base md:text-lg">{description}</p>
          </div>
        </div>
      </div>

      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex items-center justify-center mb-4">
              <span className="text-green-500 text-2xl">✔</span>
            </div>
            <p className="text-center font-bold text-lg mb-4">
              Link copied to clipboard
            </p>
            <p className="text-center text-sm text-gray-600 mb-4">
              The URL has been successfully copied to your clipboard.
            </p>
            <button
              onClick={closeAlert}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificBlog;
