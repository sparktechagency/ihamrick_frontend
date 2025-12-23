import React, { useState } from "react";
import {
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
} from "../services/allApi";
import { Link } from "react-router-dom";
import "../assets/hyperlink.css";
function LegalPage() {
  const [activeTab, setActiveTab] = useState("disclaimer");

  // Fetching data from APIs
  const {
    data: aboutData,
    isLoading: aboutLoading,
    isError: aboutError,
  } = useGetAboutUsQuery();
  const {
    data: privacyData,
    isLoading: privacyLoading,
    isError: privacyError,
  } = useGetPrivacyPolicyQuery();
  console.log(privacyData?.data?.content);
  const renderContent = () => {
    switch (activeTab) {
      case "disclaimer":
        return (
          <div className="tab-fade-in">
            <p className="text-xl text-black mb-6">
              The contents of the PG-65 Site, such as text, graphics, images,
              and other material ("Content") are for informational purposes
              only. The Content is not intended to be a substitute for
              professional medical advice, diagnosis, or treatment. Always seek
              the advice of your physician or other qualified health provider
              with any questions you may have regarding a medical condition.
            </p>
            <p className="text-xl text-black mb-6">
              If you think you may have a medical emergency, call your doctor or
              911 immediately. DrHamrickMD does not recommend or endorse any
              specific tests, physicians, products, procedures, opinions, or
              other information that may be mentioned on the Site.
            </p>
            <p className="text-xl text-black mb-6">
              Artificial intelligence (AI) makes mistakes, and we encourage you
              to verify all information before making any decisions.
            </p>
          </div>
        );

      case "privacy":
        if (privacyLoading)
          return <p className="text-center py-10">Loading Privacy Policy...</p>;
        if (privacyError)
          return (
            <p className="text-center text-red-500 py-10">
              Error loading Privacy Policy.
            </p>
          );
        return (
          <div className="tab-fade-in">
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                Privacy Policy
              </h3>
              <div
                className="prose prose-sm max-w-none leading-relaxed font-normal text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: privacyData?.data?.content || "No content available.",
                }}
              />
            </div>
          </div>
        );

      case "about":
        if (aboutLoading)
          return <p className="text-center py-10">Loading About Us...</p>;
        if (aboutError)
          return (
            <p className="text-center text-red-500 py-10">
              Error loading About Us.
            </p>
          );
        return (
          <div className="tab-fade-in">
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                About Us
              </h3>
              <div
                className="prose prose-sm max-w-none leading-relaxed font-normal text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: aboutData?.data?.content || "No content available.",
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="disclaimer-page">
      <main className="disclaimer-content">
        <header className="disclaimer-header">
          <h1 className="text-5xl font-bold text-center text-black mb-6">
            {activeTab.charAt(0).toUpperCase() +
              activeTab.slice(1).replace("-", " ")}
          </h1>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-8 border-b pb-4 items-center ">
          {["disclaimer", "privacy", "about"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition-all ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="container mx-auto">
          {renderContent()}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="text-blue-500 underline hover:text-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <style>
        {`
          .disclaimer-page { background: #f9fafb; min-height: 100vh; padding: 50px 20px; display: flex; justify-content: center; margin-top:40px; }
          .disclaimer-content { background: white; border-radius: 10px; padding: 3rem; max-width: 850px; width: 100%; color: black; box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.05); }
          .tab-fade-in { animation: fadeIn 0.3s ease-in-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
          .flex { display: flex; }
          .justify-center { justify-content: center; }
          .space-x-4 > * + * { margin-left: 1rem; }
          .border-b { border-bottom: 1px solid #e5e7eb; }
          .pb-4 { padding-bottom: 1rem; }
          .font-semibold { font-weight: 600; }
        `}
      </style>
    </div>
  );
}

export default LegalPage;
