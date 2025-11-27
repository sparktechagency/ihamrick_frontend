import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// ✅ All icons renamed clearly
import BlogIcon from "../assets/Header/blog.svg";
import HomeIcon from "../assets/Header/home.svg";
import ContactIcon from "../assets/Header/contact.svg";
import LogoIcon from "../assets/Header/logo.svg";
import PodcastsIcon from "../assets/Header/podcasts.svg";
import PublicationsIcon from "../assets/Header/publications.svg";
import SearchIcon from "../assets/Header/search.svg";
import VideosIcon from "../assets/Header/videos.svg";

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const menuItems = [
    { name: "Home", icon: HomeIcon, path: "/home" },
    { name: "Blog", icon: BlogIcon, path: "/blog" },
    { name: "Videos", icon: VideosIcon, path: "/videos" },
    { name: "Podcasts", icon: PodcastsIcon, path: "/podcasts" },
    { name: "Publications", icon: PublicationsIcon, path: "/publications" },
    { name: "Contact", icon: ContactIcon, path: "/contact" },
  ];

  const getActiveTab = () => {
    if (location.pathname === "/" || location.pathname === "/home") return "Home";
    const found = menuItems.find((item) => location.pathname === item.path);
    return found ? found.name : "nothing";
  };

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const headerBg =
    location.pathname === "/" || location.pathname === "/home"
      ? "bg-transparent"
      : "bg-white";

  return (
    <header className={`fixed top-0 left-0 w-full z-[9999] px-4 py-6 transition-colors duration-300 ${headerBg}`}>
      <div className="flex items-center justify-between w-full">
        <div className="w-24 h-8 flex-shrink-0">
          <Link to="/home">
            <img src={LogoIcon} alt="Logo" className="w-full h-full object-contain" />
          </Link>
        </div>
        <div className="hidden lg:flex ml-auto mr-10 rounded-lg border h-8 p-1 items-center w-40 md:w-56 lg:w-64 flex-shrink-0">
          <input type="text" placeholder="Search..." className="w-full outline-none px-2 text-sm bg-transparent" aria-label="Search" />
          <img src={SearchIcon} alt="Search Icon" className="w-5 h-5 opacity-60 flex-shrink-0" />
        </div>

        <nav className="hidden lg:flex items-center">
          <div className="flex space-x-4 lg:space-x-6 xl:space-x-8">
            {menuItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <Link key={item.name} to={item.path} className="flex flex-col items-center cursor-pointer pb-1 group">
                  <div className={`flex items-center space-x-1 relative w-full transition-colors duration-200 ${isActive ? "text-red-600" : "text-black hover:text-red-500"}`}>
                    <span className="font-medium text-sm lg:text-base whitespace-nowrap">{item.name}</span>
                    <img
                      src={item.icon}
                      alt={`${item.name} Icon`}
                      className={`w-4 h-4 md:w-5 md:h-5 transition-filter duration-200 ${isActive ? "filter brightness-100 contrast-200 sepia saturate-200 hue-rotate-330" : "filter brightness-0 opacity-70 group-hover:filter group-hover:brightness-100 group-hover:contrast-200 group-hover:sepia group-hover:saturate-200 group-hover:hue-rotate-330"}`}
                    />
                    {isActive && <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-red-600 transition-all duration-300 ease-in-out"></span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2" aria-label="Toggle Menu">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} mt-4 backdrop-blur-sm p-4 rounded-lg shadow-xl`}>
        <div className="flex rounded-lg border border-gray-300 h-10 p-2 items-center w-full mb-4">
          <input type="text" placeholder="Search..." className="w-full outline-none text-sm bg-transparent" aria-label="Search" />
          <img src={SearchIcon} alt="Search Icon" className="w-5 h-5 opacity-60 flex-shrink-0" />
        </div>
        <div className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 p-2 rounded-md ${isActive ? "bg-red-100 text-red-600" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <img
                  src={item.icon}
                  alt={`${item.name} Icon`}
                  className={`w-5 h-5 ${isActive ? "filter brightness-100 contrast-200 sepia saturate-200 hue-rotate-330" : "filter brightness-0 opacity-70"}`}
                />
                <span className="font-medium text-base">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Glowing Floating "Live" Button */}
      <Link
        to="/live" // Replace with the actual path for the live page
        className="fixed bottom-8 right-8 bg-red-600 text-white py-3 px-6 rounded-full shadow-lg text-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Live
      </Link>

      {/* Glowing Effect using Tailwind */}
      <style jsx >{`
        .glowing-button {
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255, 0, 0, 0.4);
          animation: glow-animation 1.5s infinite alternate;
        }

        @keyframes glow-animation {
          0% {
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255, 0, 0, 0.4);
          }
          100% {
            box-shadow: 0 0 25px rgba(255, 0, 0, 1), 0 0 45px rgba(255, 0, 0, 0.6);
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
