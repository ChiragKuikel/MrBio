import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PromotionalBannerProps {
  discountBadge?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  imageUrl: string;
  onButtonClick?: () => void;
}

const PromotionalBanner = ({

  title,
  subtitle,
  buttonText = "BUY NOW",
  imageUrl,
  onButtonClick,
}: PromotionalBannerProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate("/home/our-products");
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl my-8">
      <div className="relative flex flex-col lg:flex-row items-stretch min-h-[400px] lg:min-h-[600px]">
        {/* Left Section - Text Content */}
        <div className="relative lg:w-[55%] bg-[#1e4d2b] flex flex-col justify-center p-8 lg:p-12">
          {/* Smooth curved divider */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-20 overflow-visible pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 0 0 Q 30 25, 35 50 Q 30 75, 0 100 L 0 0 Z"
                fill="#1e4d2b"
              />
            </svg>
          </div>

          <div className="relative z-10 space-y-6 max-w-2xl">
            <h1 className="text-xl md:text-xl lg:text-4xl font-bold text-white leading-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-lg md:text-xl text-white/90 font-normal">
                {subtitle}
              </p>
            )}
               <div className="mt-8 pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2 p-2  rounded-xl border border-gray-200">
                  <div className="text-2xl font-light text-white">7</div>
                  <div className="text-xs text-white uppercase tracking-wide font-medium">
                    Premium Cereals
                  </div>
                </div>
                <div className="space-y-2 p-2  rounded-xl border border-gray-200">
                  <div className="text-2xl font-light text-white">100%</div>
                  <div className="text-xs text-white uppercase tracking-wide font-medium">
                    Natural
                  </div>
                </div>
                <div className="space-y-2 p-2  rounded-xl border border-gray-200">
                  <div className="text-2xl font-light text-white">15g</div>
                  <div className="text-xs text-white uppercase tracking-wide font-medium">
                    Protein
                  </div>
                </div>
                <div className="space-y-2 p-2  rounded-xl border border-gray-200">
                  <div className="text-2xl font-light text-white">12g</div>
                  <div className="text-xs text-white uppercase tracking-wide font-medium">
                    Fiber
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleClick}
              className="mt-6 bg-white text-gray-800 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 group"
            >
              <span>{buttonText}</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Right Section - Product Image */}
        <div className="relative lg:w-[45%] bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 overflow-visible">


          <div className="relative flex items-center justify-center lg:p-12 min-h-[400px] lg:min-h-[600px] w-full h-full">
            <img
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-full w-auto h-auto object-cover"
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;

