import React, { useState, useEffect, useRef } from "react";
import bgImage from "./assets/Home_Background.png";
import LifeCycleImage from "./assets/LifeCycleImage.svg";
import Blog from "../Blog/Blog";
import Videos from "../Videos/Videos";
import Podcasts from "../Podcasts/Podcasts";
import Publications from "../Publications/Publications";
import Contact from "../Contact/Contact";
import Motivation from "../../components/Motivation";
import {
  useGetLifeSuggestionsQuery,
  useGetAllVideosQuery,
  useGetAllBlogsQuery,
  useGetAllPublicationsQuery,
  useGetRecordedPodcastsQuery,
  useAddRssUserMutation,
} from "../../services/allApi";
import { Link } from "react-router-dom";
import { setCookie, getCookie } from "../../services/cookies";
import { useNavigate } from "react-router-dom";

function Home() {
  const [headerBg, setHeaderBg] = useState("bg-transparent");
  const heroRef = useRef(null);
  const [showRssModal, setShowRssModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [others, setOthers] = useState(""); // Optional field
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // To display success or error messages
  const [isSubscribed, setIsSubscribed] = useState(false); // Track if user is subscribed
  const navigate = useNavigate();

  // API Calls
  const {
    data: lifeData,
    isLoading,
    error: lifeError,
  } = useGetLifeSuggestionsQuery();
  const { data: videosData } = useGetAllVideosQuery();
  const { data: blogsData } = useGetAllBlogsQuery();
  const { data: publicationsData } = useGetAllPublicationsQuery();
  const { data: podcastData } = useGetRecordedPodcastsQuery();

  // RSS Mutation Hook for Subscription
  const [addRssUser, { isLoading: isSubmitting, isError, isSuccess }] =
    useAddRssUserMutation();

  // Latest Content
  const latestContent = {
    video: videosData?.data?.[0] || null,
    podcast: podcastData?.data?.podcasts?.[0] || null,
    blog: blogsData?.data?.[0] || null,
    publication: publicationsData?.data?.[0] || null,
  };

  // Prepare Life Suggestions
  const tableData = [];
  if (lifeData?.data) {
    const maxLength = Math.max(
      lifeData.data.decrease.length,
      lifeData.data.increase.length
    );
    for (let i = 0; i < maxLength; i++) {
      tableData.push([
        lifeData.data.decrease[i]?.content || "",
        lifeData.data.increase[i]?.content || "",
      ]);
    }
  }

  // Header Background Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setHeaderBg(heroBottom <= 0 ? "bg-white shadow-lg" : "bg-transparent");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is already subscribed (using cookies)
  useEffect(() => {
    const token = getCookie("rssUserToken");
    if (token) {
      setShowRssModal(false); // If token exists, don't show modal
      setIsSubscribed(true); // User is already subscribed
    } else {
      setShowRssModal(true); // Show the modal if no token
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      setError("Please fill out all required fields.");
      return;
    }

    const userData = {
      name,
      email,
      phone,
      others,
    };

    try {
      // Make the API call using the useAddRssUserMutation hook
      const result = await addRssUser(userData).unwrap();

      if (result.success) {
        const token = btoa(JSON.stringify({ name, email, phone }));
        setCookie("rssUserToken", token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        }); // 30 days
        setMessage("Thank you for subscribing!");
        setIsSubscribed(true);
        setShowRssModal(false);
      }
    } catch (err) {
      // Handle the error if the user is already subscribed
      if (
        err?.statusCode === 409 &&
        err?.message === "Your Data is Already Stored"
      ) {
        setMessage("Thank you! You are already subscribed.");
        setIsSubscribed(true);
        setShowRssModal(false);
      } else {
        setError("Failed to submit data. Please try again later.");
      }
    }
  };

  const handleCancelSubscription = () => {
    // Set cookie even if user cancels, but do not call API
    setCookie("rssUserToken", "cancelled", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }); // 30 days
    setShowRssModal(false); // Close the modal if user cancels
  };

  return (
    <>
      {/* Apply global blur and pointer events disable when RSS Modal is open */}
      <div className={showRssModal ? "blur-sm pointer-events-none" : ""}>
        {/* Sticky Header */}
        <header
          className={`fixed top-0 left-0 w-full z-50 h-16 sm:h-20 lg:h-20 transition-colors duration-300 ${headerBg}`}
        />

        {/* HERO SECTION */}
        <div
          ref={heroRef}
          className={`w-full min-h-screen flex flex-col items-start justify-center px-4 sm:px-10 lg:px-20 pt-24 md:pt-8 lg:pt-0 ${
            showRssModal ? "blur-sm pointer-events-none" : ""
          }`} // Add blur and disable interaction
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-center">
            <div className="w-full lg:w-2/3 flex justify-center items-start mb-6 lg:mb-0 lg:mr-6 pt-6 lg:pt-0">
              <img
                src={LifeCycleImage}
                alt="Life Cycle"
                className="w-full h-auto"
              />
            </div>

            <div className="w-full lg:w-1/3 flex justify-center px-2 sm:px-6 lg:px-10 py-2">
              <div className="overflow-x-auto w-full">
                <div className="max-h-[400px] overflow-y-auto w-full scrollbar-hide">
                  <table className="w-full min-w-[250px] text-center border border-white border-opacity-30 backdrop-blur-md bg-transparent">
                    <tbody>
                      <tr>
                        <td
                          colSpan={2}
                          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold py-3 sm:py-4 text-black"
                        >
                          To Increase Quality of Life
                        </td>
                      </tr>
                      <tr className="h-10 sm:h-12 font-bold text-black">
                        <td className="border-b border-white border-opacity-30 px-4">
                          Decrease
                        </td>
                        <td className="border-b border-white border-opacity-30 px-4">
                          Increase
                        </td>
                      </tr>

                      {isLoading && (
                        <tr>
                          <td colSpan="2" className="py-4">
                            Loading...
                          </td>
                        </tr>
                      )}

                      {lifeError && (
                        <tr>
                          <td colSpan="2" className="py-4 text-red-600">
                            Failed to load suggestions
                          </td>
                        </tr>
                      )}

                      {!isLoading &&
                        !lifeError &&
                        tableData.map((row, i) => (
                          <tr key={i} className="hover:bg-white/20 transition">
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className="border border-white border-opacity-30 px-4 py-2 text-sm"
                              >
                                {cell || "--"}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* LATEST CONTENT SECTION */}
          <div className="w-full flex justify-center mt-6 px-2 sm:px-6 lg:px-10">
            <table className="w-full max-w-3xl text-center border border-white border-opacity-20 backdrop-blur-md bg-transparent">
              <tbody>
                {latestContent.video && (
                  <tr className="hover:bg-white/10 cursor-pointer">
                    <td className="border-b border-white border-opacity-20 py-3 font-semibold">
                      <Link to={`/videos/${latestContent.video._id}`}>
                        Videos
                      </Link>
                    </td>

                    <td className="border-b border-white border-opacity-20 py-3 text-left">
                      <Link to={`/videos/${latestContent.video._id}`}>
                        {latestContent.video?.title}
                      </Link>
                    </td>
                  </tr>
                )}
                {latestContent.podcast && (
                  <tr className="hover:bg-white/10 cursor-pointer">
                    <td className="border-b border-white border-opacity-20 py-3 font-semibold">
                      <Link to={`/podcasts/${latestContent.podcast._id}`}>
                        Podcasts
                      </Link>
                    </td>
                    <td className="border-b border-white border-opacity-20 py-3 text-left">
                      <Link to={`/podcasts/${latestContent.podcast._id}`}>
                        {latestContent.podcast?.title}
                      </Link>
                    </td>
                  </tr>
                )}
                {latestContent.blog && (
                  <tr className="hover:bg-white/10 cursor-pointer">
                    <td className="border-b border-white border-opacity-20 py-3 font-semibold">
                      <Link to={`/blog/${latestContent.blog._id}`}>Blog</Link>
                    </td>
                    <td className="border-b border-white border-opacity-20 py-3 text-left">
                      <Link to={`/blog/${latestContent.blog._id}`}>
                        {latestContent.blog?.title}
                      </Link>
                    </td>
                  </tr>
                )}
                {latestContent.publication && (
                  <tr className="hover:bg-white/10 cursor-pointer">
                    <td className="border-b border-white border-opacity-20 py-3 font-semibold">
                      <Link
                        to={`/publications/${latestContent.publication._id}`}
                      >
                        Publications
                      </Link>
                    </td>
                    <td className="border-b border-white border-opacity-20 py-3 text-left">
                      <Link
                        to={`/publications/${latestContent.publication._id}`}
                      >
                        {latestContent.publication?.title}
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RSS Subscription Modal */}
      {showRssModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gradient-to-r from-red-500 via-white-400 to-black-900 p-4 sm:p-6 md:p-8 rounded-lg w-11/12 sm:w-96 max-w-lg max-h-[80vh] overflow-y-auto shadow-lg transition-all duration-300 ease-in-out transform scale-100 hover:scale-105">
            <h2 className="sm:text-3xl font-extrabold text-white mb-4 sm:mb-6 text-center">
              Subscribe to Our RSS Feed
            </h2>
            {message && <p className="text-green-600 text-center">{message}</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3 sm:mb-4">
                <label className="block text-sm sm:text-lg font-semibold text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <label className="block text-sm sm:text-lg font-semibold text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  required
                />
              </div>

              <div className="mb-3 sm:mb-4">
                <label className="block text-sm sm:text-lg font-semibold text-white mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  required
                />
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-sm sm:text-lg font-semibold text-white mb-2">
                  Other Details (Optional)
                </label>
                <textarea
                  value={others}
                  onChange={(e) => setOthers(e.target.value)}
                  className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  placeholder="Optional details"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all"
              >
                Subscribe Now
              </button>

              <button
                type="button"
                onClick={handleCancelSubscription}
                className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mt-4"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <Motivation />
      <Videos />
      <Podcasts />
      <Blog />
      <Publications />
      <Contact />
    </>
  );
}

export default Home;
