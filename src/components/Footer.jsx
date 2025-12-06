import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { FaLinkedin, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { BsSubstack } from "react-icons/bs";
import LogoIcon from "../assets/Footer/logo.svg";
import { Link } from "react-router-dom";
import { useGetAllSocialMediaLinksQuery } from "../services/allApi";
function Footer() {
  const { data: socialLinks, error } = useGetAllSocialMediaLinksQuery();
  const quickLinks = [
    { name: "Blog", path: "/blog" },
    { name: "Videos", path: "/videos" },
    { name: "Podcasts", path: "/podcasts" },
    { name: "Publications", path: "/publications" },
  ];

  const socialMediaIcons = {
    Facebook: <Facebook className="w-5 h-5" fill="white" />,
    X: <Twitter className="w-5 h-5" fill="white" />,
    Instagram: <Instagram className="w-5 h-5" />,
    Youtube: <Youtube className="w-5 h-5" />,
    WhatsApp: <FaWhatsapp className="w-5 h-5 text-white" />,
    TikTok: <FaTiktok className="w-5 h-5 text-white" />,
    LinkedIn: <FaLinkedin className="w-5 h-5 text-white" />,
    Substack: <BsSubstack className="w-5 h-5 text-white"></BsSubstack>,
  };

  if (error) {
    return <div>Error loading social media links</div>;
  }
  return (
    <footer className="relative">
      {/* Wavy gradient background */}
      <div
        className="absolute inset-0 w-full h-full items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom, #ffb3ba 0%, #ff8a8a 15%, #ff6b6b 30%, #ff4d4d 45%, #e63946 60%, #b91e2a 75%, #6b1419 90%, #2d0a0f 100%)",
          clipPath:
            "polygon(0% 0%, 1% 2%, 2% 3.5%, 3% 4.5%, 4% 5%, 5% 5.5%, 6% 6%, 7% 6.2%, 8% 6%, 9% 5.5%, 10% 5%, 11% 4.2%, 12% 3.5%, 13% 3%, 14% 2.5%, 15% 2.2%, 16% 2%, 17% 2.2%, 18% 2.5%, 19% 3%, 20% 3.5%, 21% 4%, 22% 4.5%, 23% 5%, 24% 5.5%, 25% 6%, 26% 6.5%, 27% 7%, 28% 7.2%, 29% 7.5%, 30% 7.8%, 31% 8%, 32% 8%, 33% 7.8%, 34% 7.5%, 35% 7.2%, 36% 7%, 37% 6.5%, 38% 6%, 39% 5.5%, 40% 5%, 41% 4.8%, 42% 4.5%, 43% 4.2%, 44% 4%, 45% 4%, 46% 4%, 47% 4.2%, 48% 4.5%, 49% 4.8%, 50% 5%, 51% 5.5%, 52% 6%, 53% 6.5%, 54% 7%, 55% 7.2%, 56% 7.5%, 57% 7.8%, 58% 8%, 59% 8%, 60% 7.8%, 61% 7.5%, 62% 7.2%, 63% 7%, 64% 6.5%, 65% 6%, 66% 5.5%, 67% 5%, 68% 4.8%, 69% 4.5%, 70% 4.2%, 71% 4%, 72% 4%, 73% 4%, 74% 4.2%, 75% 4.5%, 76% 4.8%, 77% 5%, 78% 5.5%, 79% 6%, 80% 6.5%, 81% 7%, 82% 7.2%, 83% 7.5%, 84% 7.8%, 85% 8%, 86% 8%, 87% 7.5%, 88% 7%, 89% 6.5%, 90% 6%, 91% 5.5%, 92% 5%, 93% 4.5%, 94% 4%, 95% 3.5%, 96% 3%, 97% 2.5%, 98% 2.2%, 99% 2%, 100% 2%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Footer content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-[2%] py-[5%]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div>
              <img
                src={LogoIcon}
                alt="PCIG Logo"
                className="h-8 w-auto my-10"
              />
            </div>
            <p className="text-sm leading-relaxed">
              We are dedicated to helping you live a healthier, happier life.
              Our mission is to provide reliable, research-backed information,
              practical tips, and resources that support your physical, mental,
              and emotional well-being.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-black">
              Quick Links
            </h3>
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="flex items-center gap-2 text-sm  hover:text-black transition-colors"
              >
                <br />
                <span>{link.name}</span>
                <br />
                <br />
              </a>
            ))}
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-black">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">(406) 555-0120</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">thamrick65@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  2972 Westheimer Rd.
                  <br />
                  Santa Ana, Illinois 85486
                </span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-black">
              Social Media
            </h3>
            <div className="flex gap-4">
              {socialLinks?.data.map((socialLink) => (
                <a
                  key={socialLink._id}
                  href={socialLink.url}
                  className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label={socialLink.name}
                >
                  {socialMediaIcons[socialLink.name]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="text-white text-center text-sm px-4 py-4">
          &copy; {new Date().getFullYear()} DrHamrickMd, a product of HMD
          Productions, LLC. All rights reserved. DrHamrickMD does not provide
          medical advice, diagnosis, or treatment. See{" "}
          <Link
            to="/disclaimer"
            className="underline text-white hover:text-blue-700 transition-colors"
          >
            additional information
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
