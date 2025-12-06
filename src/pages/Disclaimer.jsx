import React from "react";
import { Link } from "react-router-dom";

function Disclaimer() {
  return (
    <div className="disclaimer-page">
      <header className="disclaimer-header">
        <h1 className="text-5xl font-bold text-center text-black mb-6">
          Disclaimer
        </h1>
      </header>

      <main className="disclaimer-content p-8">
        <div className="container mx-auto">
          <p className="text-xl text-black mb-6">
            The contents of the PG-65 Site, such as text, graphics, images, and
            other material ("Content") are for informational purposes only. The
            Content is not intended to be a substitute for professional medical
            advice, diagnosis, or treatment. Always seek the advice of your
            physician or other qualified health provider with any questions you
            may have regarding a medical condition.
          </p>

          <p className="text-xl text-black mb-6">
            If you think you may have a medical emergency, call your doctor or
            911 immediately. DrHamrickMD does not recommend or endorse any
            specific tests, physicians, products, procedures, opinions, or other
            information that may be mentioned on the Site. Reliance on any
            information provided by DrHamrickMD, DrHamrickMD employees, or others
            appearing on the Site is solely at your own risk.
          </p>

          <p className="text-xl text-black mb-6">
            Artificial intelligence (AI) makes mistakes, and we encourage you to
            verify all information before making any decisions. AI-based
            suggestions are not always accurate and should be supplemented with
            other sources of information.
          </p>

          <div className="text-center">
            <Link
              to="/"
              className="text-blue-500 underline hover:text-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* CSS Styles */}
      <style>
        {`
          .disclaimer-page {
            background: white;
            min-height: 100vh;
            padding-top: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .disclaimer-header {
            margin-bottom: 40px;
          }

          .disclaimer-content {
            background: white;
            border-radius: 10px;
            padding: 3rem;
            max-width: 800px;
            margin: auto;
            color: black;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          }

          .container {
            width: 100%;
          }

          .text-center {
            text-align: center;
          }

          .text-blue-500 {
            color: #3b82f6;
          }

          .text-blue-700 {
            color: #1d4ed8;
          }

          .text-blue-500:hover {
            color: #1d4ed8;
          }




          /* Add padding and some margin for spacing */
          .disclaimer-content p {
            margin-bottom: 24px;
          }
        `}
      </style>
    </div>
  );
}

export default Disclaimer;
