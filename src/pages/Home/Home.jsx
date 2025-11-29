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
} from "../../services/allApi";

import { Link } from "react-router-dom";

function Home() {
  const [headerBg, setHeaderBg] = useState("bg-transparent");
  const heroRef = useRef(null);

  // ---------------------------------------------
  // LIFE SUGGESTIONS API CALL
  // ---------------------------------------------
  const { data: lifeData, isLoading, error } = useGetLifeSuggestionsQuery();

  // ---------------------------------------------
  // LATEST CONTENT API CALLS
  // ---------------------------------------------
  const { data: videosData } = useGetAllVideosQuery();
  const { data: blogsData } = useGetAllBlogsQuery();
  const { data: publicationsData } = useGetAllPublicationsQuery();
  const { data: podcastData } = useGetRecordedPodcastsQuery();

  // ---------------------------------------------
  // Prepare latest items (first item from each list)
  // ---------------------------------------------
  const latestContent = {
    video: videosData?.data?.[0] || null,
    podcast: podcastData?.data?.podcasts?.[0] || null,
    blog: blogsData?.data?.[0] || null,
    publication: publicationsData?.data?.[0] || null,
  };

  // ---------------------------------------------
  // Build LIFE SUGGESTIONS Table
  // ---------------------------------------------
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

  // ---------------------------------------------
  // HEADER BG SCROLL EFFECT
  // ---------------------------------------------
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

  return (
    <>
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 h-16 sm:h-20 lg:h-20 transition-colors duration-300 ${headerBg}`}
      ></header>

      {/* HERO SECTION */}
      <div
        ref={heroRef}
        className="w-full min-h-screen flex flex-col items-start justify-center px-4 sm:px-10 lg:px-20 pt-24 md:pt-8 lg:pt-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-center">
          {/* LEFT IMAGE */}
          <div className="w-full lg:w-2/3 flex justify-center items-start mb-6 lg:mb-0 lg:mr-6 pt-6 lg:pt-0">
            <img src={LifeCycleImage} alt="Life Cycle" className="w-full h-auto" />
          </div>

          {/* RIGHT TABLE — LIFE SUGGESTIONS */}
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
                      <td className="border-b border-white border-opacity-30 px-4">Decrease</td>
                      <td className="border-b border-white border-opacity-30 px-4">Increase</td>
                    </tr>

                    {isLoading && (
                      <tr>
                        <td colSpan="2" className="py-4">Loading...</td>
                      </tr>
                    )}

                    {error && (
                      <tr>
                        <td colSpan="2" className="py-4 text-red-600">
                          Failed to load suggestions
                        </td>
                      </tr>
                    )}

                    {!isLoading &&
                      !error &&
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

        {/* --------------------------------------------- */}
        {/* LATEST CONTENT SECTION — NOW DYNAMIC */}
        {/* --------------------------------------------- */}
        <div className="w-full flex justify-center mt-6 px-2 sm:px-6 lg:px-10">
          <table className="w-full max-w-3xl text-center border border-white border-opacity-20 backdrop-blur-md bg-transparent">
            <tbody>
              {/* Latest Video */}
              {latestContent.video && (
                <tr className="hover:bg-white/10 cursor-pointer">
                  <td className="border-b border-white border-opacity-20 py-3 font-semibold">
                    Videos
                  </td>
                  <td className="border-b border-white border-opacity-20 py-3 text-left">
                    <Link to={`/videos/${latestContent.video._id}`}>
                      {latestContent.video?.title}
                    </Link>
                  </td>
                </tr>
              )}

              {/* Latest Podcast */}
              {latestContent.podcast && (
                <tr className="hover:bg-white/10 cursor-pointer">
                  <td className="border-b border-white border-opacity-20 py-3 font-semibold">
                    Podcasts
                  </td>
                  <td className="border-b border-white border-opacity-20 py-3 text-left">
                    <Link to={`/podcasts/${latestContent.podcast._id}`}>
                      {latestContent.podcast?.title}
                    </Link>
                  </td>
                </tr>
              )}

              {/* Latest Blog */}
              {latestContent.blog && (
                <tr className="hover:bg-white/10 cursor-pointer">
                  <td className="border-b border-white border-opacity-20 py-3 font-semibold">
                    Blog
                  </td>
                  <td className="border-b border-white border-opacity-20 py-3 text-left">
                    <Link to={`/blog/${latestContent.blog._id}`}>
                      {latestContent.blog?.title}
                    </Link>
                  </td>
                </tr>
              )}

              {/* Latest Publication */}
              {latestContent.publication && (
                <tr className="hover:bg-white/10 cursor-pointer">
                  <td className="border-b border-white border-opacity-20 py-3 font-semibold">
                    Publications
                  </td>
                  <td className="border-b border-white border-opacity-20 py-3 text-left">
                    <Link to={`/publications/${latestContent.publication._id}`}>
                      {latestContent.publication?.title}
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Sections */}
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
