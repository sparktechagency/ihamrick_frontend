import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import Publications from "./pages/Publications/Publications";
import Videos from "./pages/Videos/Videos";
import Podcasts from "./pages/Podcasts/Podcasts";
import ScrollToTop from "./components/ScrollToTop";
import SpecificBlog from "./pages/Blog/components/SpecificBlog";
import SpecificPodcast from "./pages/Podcasts/components/SepcificPodcast";
import SpecificPublication from "./pages/Publications/components/SepcificPublication";
import AllLives from "./pages/Live/AllLives";
import SepcificLive from "./pages/Live/SepcificLive";
import SpecificVideo from "./pages/Videos/components/SepcificVideo";
function App() {
  return (
    <Router>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/blogs/:blogId" element={<SpecificBlog />} />
        <Route path="/blog/:blogId" element={<SpecificBlog />} />
        <Route path="/podcasts/:podcastId" element={<SpecificPodcast />} />
        <Route
          path="/publications/:publicationId"
          element={<SpecificPublication />}
        />
        <Route path="/videos/:videoId" element={<SpecificVideo />} />
        <Route path="/live" element={<AllLives />} />
        <Route path="/live/:liveId" element={<SepcificLive />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
