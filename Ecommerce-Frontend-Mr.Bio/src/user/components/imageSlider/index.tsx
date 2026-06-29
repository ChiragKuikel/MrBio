import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { slidesData } from "../../data/imageSlider";
import { CustomButton } from "../../../shared/components/button/CustomButton";

// Define proper types
interface SlideData {
  id: number;
  badge?: string;
  title: string;
  description?: string;
  buttonText?: string;
  backgroundImage?: string;
  image?: string;
  imageComponent?: React.ReactNode;
  onButtonClick?: () => void;
}

interface SliderProps {
  slides?: SlideData[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  slides = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = "",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (!slides.length) return null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Slider Container */}
      <div className="relative h-80 sm:h-96 md:h-120 lg:h-150 overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
        {slides?.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                  ? "-translate-x-full"
                  : "translate-x-full"
            }`}
            style={{
              backgroundImage: slide.backgroundImage?.startsWith(
                "linear-gradient"
              )
                ? slide?.backgroundImage
                : slide?.backgroundImage
                  ? `url(${slide.backgroundImage})`
                  : "linear-gradient(135deg, #e8f5e8 0%, #f0f8e8 100%)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundClip: "content-box",
            }}
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Content Section */}
              <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-16 py-6 md:py-0 order-2 md:order-1">
                {slide.badge && (
                  <div className="text-xs sm:text-sm font-medium text-white mb-2 sm:mb-4 uppercase tracking-wide">
                    {slide.badge}
                  </div>
                )}
                <h2 className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                  {slide.title}
                </h2>
                {slide.description && (
                  <p className="text-white mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg max-w-md">
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && (
                  <CustomButton
                    variant="primary"
                    className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold transition-colors duration-200 flex items-center gap-2 w-fit text-sm sm:text-base"
                    onClick={slide.onButtonClick}
                  >
                    {slide.buttonText}
                    <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                  </CustomButton>
                )}
              </div>

              {/* Image Section */}
              <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 order-1 md:order-2">
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain max-h-32 sm:max-h-40 md:max-h-48 lg:max-h-none"
                  />
                )}
                {slide.imageComponent && slide.imageComponent}
              </div>
            </div>
          </div>
        ))}
        
        {/* Dot Indicators - Positioned inside carousel at bottom-left */}
        {showDots && slides.length > 1 && (
          <div className="absolute bottom-2 left-2 sm:left-4 z-10 flex items-center space-x-1.5 sm:space-x-2 backdrop-blur-sm px-2 py-1 rounded-full">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-white/70  w-6 sm:w-8"
                    : "bg-white/70 hover:bg-white/90 w-2 sm:w-3"
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Slide Counter - Hidden on very small screens */}
        {/* <div className="absolute bottom-2 left-2 sm:left-6 text-white/80 text-xs font-medium backdrop-blur-sm bg-black/20 px-2 py-1 rounded z-20 hidden sm:block">
          {currentSlide + 1} / {slides.length}
        </div> */}
      </div>

      {/* Navigation Arrows - Adjusted for mobile */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <ChevronRight size={20} className="sm:w-6 sm:w-6" />
          </button>
        </>
      )}

      
    </div>
  );
};

// Demo component showing usage
const ImageSlider: React.FC = () => {
  const navigate = useNavigate();

  // Action handlers mapping with navigation
  const actionHandlers: Record<string, (slideTitle: string) => void> = {
    shop_now: () => {
      navigate("/home/our-products");
    },
    explore: () => {
      navigate("/home/our-products");
    },
    order_now: () => {
      navigate("/home/our-products");
    },
  };

  const handleButtonAction = (
    action: string,
    slideTitle: string
  ): (() => void) => {
    const handler = actionHandlers[action];
    return handler ? () => handler(slideTitle) : () => {};
  };

  const slides: SlideData[] = slidesData?.map((slide) => ({
    ...slide,
    onButtonClick: handleButtonAction(slide.buttonAction, slide.title),
  }));

  return (
    <div>
      <div>
        <Slider
          slides={slides}
          autoPlay={true}
          autoPlayInterval={5000}
          showDots={true}
          showArrows={true}
          className="mb-6 sm:mb-8"
        />
      </div>
    </div>
  );
};

export default ImageSlider;
