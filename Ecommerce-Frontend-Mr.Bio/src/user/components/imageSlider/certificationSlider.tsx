/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import c1 from "../../../assets/certificationImgs/c1.png";
import c2 from "../../../assets/certificationImgs/c2.jpg";
import c3 from "../../../assets/certificationImgs/c3.png";
import c33 from "../../../assets/certificationImgs/c33.jpg";
import c4 from "../../../assets/certificationImgs/c4.png";

const LogoSlider = ({ title }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleLogos, setVisibleLogos] = useState(2);

  // Import logos
  const logos = [c1, c2, c3, c33, c4];

  // Update visible logos based on screen size - show 2 certifications per frame
  useEffect(() => {
    const updateVisibleLogos = () => {
      // Always show 2 logos per frame
      setVisibleLogos(2);
    };

    // Set initial value
    updateVisibleLogos();

    // Add event listener
    window.addEventListener('resize', updateVisibleLogos);

    // Cleanup
    return () => window.removeEventListener('resize', updateVisibleLogos);
  }, []);

  // Reset currentIndex when visibleLogos changes to prevent out-of-bounds
  useEffect(() => {
    const maxIndex = Math.max(0, logos.length - visibleLogos);
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [visibleLogos, currentIndex, logos.length]);

  // Max index calculation is based on the total logos count minus the visible ones
  const maxIndex = Math.max(0, logos.length - visibleLogos);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 > maxIndex ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? maxIndex : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full bg-white py-8 mt-8">
      {/* Title */}
      {title && (
        <h2 className="text-center text-xl md:text-2xl font-semibold mb-6 px-4">{title}</h2>
      )}

      <div className="relative flex items-center justify-center px-4 md:px-0 max-w-7xl mx-auto">
        {/* Previous Button */}
        <button
          className="absolute left-2 md:left-4 z-10 p-2 md:p-3 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
          onClick={goToPrev}
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Logo Container */}
        <div className="overflow-hidden w-full mx-8 md:mx-12">
          <div
            className="flex transition-transform duration-500 ease-in-out items-center"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleLogos}%)`,
              width: `${(logos.length * 100) / visibleLogos}%`,
            }}
          >
            {logos?.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center px-2 md:px-4"
                style={{ width: `${100 / visibleLogos}%` }}
              >
                <div className="flex items-center justify-center w-full h-24 md:h-32 opacity-80 hover:opacity-100 transition-opacity duration-300">
                  <img
                    src={logo}
                    className="max-h-full max-w-full h-auto w-auto object-contain block hover:grayscale-0 transition-all duration-300"
                    alt="Certification"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          className="absolute right-2 md:right-4 z-10 p-2 md:p-3 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
          onClick={goToNext}
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      {logos.length > visibleLogos && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-gray-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoSlider;