import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Motivation from "../../components/Motivation";
import contact from "./assets/contact.svg";
import successImg from "./assets/success.svg"; // ✅ full image modal background
import {
  useContactUsMutation,
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
} from "../../services/allApi";

const InputField = ({
  placeholder,
  value,
  onChange,
  type = "text",
  multiline = false,
}) => {
  const base =
    "p-3 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500 w-full transition duration-150 ease-in-out";
  return multiline ? (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={5}
      className={`${base} resize-none h-32`}
    />
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${base} h-12`}
    />
  );
};

function Contact() {
  const location = useLocation();
  const currentPath = location.pathname;
  const fromMain = currentPath === "/" || currentPath === "/home";
  const isRootContactRoute = currentPath === "/contact";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalLeaving, setModalLeaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [contactUs, { isLoading, isSuccess, isError, error }] =
    useContactUsMutation();

  // Fetch About Us and Privacy Policy
  const { data: aboutUsData, isLoading: isAboutUsLoading } = useGetAboutUsQuery();
  const { data: privacyPolicyData, isLoading: isPrivacyPolicyLoading } =
    useGetPrivacyPolicyQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const formData = { firstName, lastName, email, phone, message };
    try {
      const response = await contactUs(formData).unwrap();
      setIsSending(false);
      setSuccessMessage(response.message);
      setShowModal(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setIsSending(false);
      console.error("Error submitting form:", err);
    }
  };

  const handleCloseModal = () => {
    setModalLeaving(true);
    setTimeout(() => {
      setShowModal(false);
      setModalLeaving(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center py-16 sm:py-20 min-h-[98vh] relative w-full overflow-hidden">
      {isRootContactRoute && <Motivation />}

      {/* Header */}
      <header className="relative flex justify-center items-center mb-8 sm:mb-10 md:mb-12 w-full px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center w-full">
          Contact
        </h1>
      </header>

      {/* === Main Content === */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-20 gap-10 md:gap-16">
        {/* Left Side (SVG) */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src={contact}
            alt="Contact Illustration"
            className="w-full h-auto max-w-md rounded-xl drop-shadow-2xl"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Reach Out To Us
          </h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            We’d love to hear from you! Fill out the form to connect with our
            team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <InputField
                placeholder="First Name*"
                value={firstName}
                onChange={setFirstName}
              />
              <InputField
                placeholder="Last Name*"
                value={lastName}
                onChange={setLastName}
              />
            </div>

            <InputField
              placeholder="Email*"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <InputField
              placeholder="Phone Number*"
              type="tel"
              value={phone}
              onChange={setPhone}
            />
            <InputField
              placeholder="Your message..."
              value={message}
              onChange={setMessage}
              multiline
            />

            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-3 mt-4 rounded-lg text-lg font-semibold transition duration-150 shadow-lg ${
                isSending
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* === Conditional Rendering of About Us and Privacy Policy === */}
      {isRootContactRoute && !isAboutUsLoading && aboutUsData && (
        <div className="mt-10 w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-20">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About Us</h3>
          <p className="text-gray-700">{aboutUsData.data.content}</p>
        </div>
      )}

      {isRootContactRoute && !isPrivacyPolicyLoading && privacyPolicyData && (
        <div className="mt-10 w-full max-w-6xl px-4 sm:px-8 md:px-12 lg:px-20">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy Policy</h3>
          <p className="text-gray-700">{privacyPolicyData.data.content}</p>
        </div>
      )}

      {/* ✅ Full-Image Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-all duration-500 ${
            modalLeaving ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 w-[90%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[45%] max-h-[80vh] flex flex-col items-center ${
              modalLeaving
                ? "translate-x-full opacity-0"
                : "translate-x-0 opacity-100"
            } shadow-2xl shadow-black bg-[#D9D9D9]`}
          >
            <div className="w-full text-center py-4 px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Message Sent Successfully!
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-2">
                {successMessage
                  ? successMessage
                  : "Thank you for reaching out. We'll get back to you soon."}
              </p>
            </div>

            <img
              src={successImg}
              alt="Success"
              className="w-full object-cover flex-1 rounded-b-3xl"
            />

            <div className="w-full flex justify-center py-4">
              <button
                onClick={handleCloseModal}
                className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-800 transition duration-300 shadow-md"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
