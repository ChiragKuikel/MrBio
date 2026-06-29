/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ArrowRight } from "lucide-react"; // Using lucide-react for consistency

// Define the props interface
interface HorizontalPromoBannerProps {
  discountBadge?: string;
  title?: string;
  subtitle?: string;
  tagline?: string;
  buttonText?: string;
  backgroundColor?: string; // Will primarily use Tailwind bg classes or custom gradient string
  backgroundImage?: string;
  onButtonClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // sx?: any; // No direct equivalent for MUI's SxProps in Tailwind
}

export const HorizontalPromoBanner: React.FC<HorizontalPromoBannerProps> = ({
  discountBadge,
  title,
  subtitle,
  tagline,
  buttonText = "BUY NOW",
  backgroundColor,
  backgroundImage,
  onButtonClick,
}) => {
  const backgroundClasses = backgroundColor
    ? `bg-[${backgroundColor}]`
    : "bg-gradient-to-r from-green-700 to-green-600";

  // Handle container click (only if clicking the background, not children)
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onButtonClick?.(event as any); // Type assertion for event is okay here
    }
  };

  return (
    <div
      className={`relative overflow-hidden  min-h-64 cursor-pointer transition-all duration-300 hover:shadow-2xl ${backgroundClasses} py-8 px-4`} // Added py-8 px-4 for spacing
      onClick={handleContainerClick}
      style={
        // Direct style for a custom background if it's a specific gradient not covered by Tailwind classes
        backgroundColor && backgroundColor.includes("gradient")
          ? { background: backgroundColor }
          : {}
      }
    >
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-90"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-green-700 via-green-700/80 to-transparent z-10" // Adjusted colors
          ></div>
        </>
      )}

      {/* Content Container */}
      <div className="relative z-20 h-full flex items-center">
        <div
          className="p-6 md:p-8 max-w-full md:max-w-md" // Equivalent to p: { xs: 3, md: 4 } (24px, 32px) and maxWidth: { xs: '100%', md: 400 }
        >
          {/* Discount Badge */}
          {discountBadge && (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-600 text-white mb-4" // Equivalent to StyledChip
            >
              {discountBadge}
            </span>
          )}

          {/* Title */}
          {title && (
            <h3
              className="text-white text-base opacity-90 font-normal mb-2" // Equivalent to Typography variant="h6" (font-size 1rem), opacity, mb: 1
            >
              {title}
            </h3>
          )}

          {/* Subtitle */}
          {subtitle && (
            <h2
              className="text-white font-bold mb-4 leading-tight text-4xl md:text-5xl" // Equivalent to Typography variant={isMobile ? 'h3' : 'h2'} and custom fontSize
            >
              {subtitle}
            </h2>
          )}

          {/* Tagline */}
          {tagline && (
            <p
              className="text-white opacity-80 mb-6 text-base md:text-lg" // Equivalent to Typography variant="body1" and custom fontSize, mb: 3
            >
              {tagline}
            </p>
          )}

          {/* CTA Button */}
          <button
            className="bg-white text-gray-700 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-200 ease-in-out
                       hover:bg-gray-50 hover:shadow-xl hover:scale-105 inline-flex items-center justify-center space-x-2" // Equivalent to StyledButton
            onClick={(e) => {
              e.stopPropagation(); // Prevent container click from firing
              onButtonClick?.(e);
            }}
          >
            <span>{buttonText}</span>
            <ArrowRight size={20} /> {/* ArrowForwardIcon equivalent */}
          </button>
        </div>
      </div>
    </div>
  );
};
