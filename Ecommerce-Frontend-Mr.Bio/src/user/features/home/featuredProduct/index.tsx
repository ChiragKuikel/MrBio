import { useState } from "react";
import sevenceralss from "../../../../assets/productImage/sevenceralss.png";

const FeaturedProductDisplay = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-10">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl font-light text-gray-900 tracking-tight leading-tight">
                SEVEN
                <span className="block text-green-500 font-normal">
                  CEREALS
                </span>
              </h1>

              <div className="w-20 h-1 bg-green-500 rounded-full"></div>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Premium blend of seven nutritious cereals carefully selected for
                optimal health benefits. Rich in fiber, protein, and essential
                nutrients to fuel your day with natural energy.
              </p>

              <div className="space-y-5 text-base text-gray-700 max-w-lg">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>100% Natural & Organic</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>High in Protein & Fiber</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No Artificial Preservatives</span>
                </div>
              </div>
            </div>

            {/* Integrated bottom section */}
            <div className="mt-16 pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2 p-4 bg-white/60 rounded-xl border border-gray-200">
                  <div className="text-2xl font-light text-green-500">7</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                    Premium Cereals
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-white/60 rounded-xl border border-gray-200">
                  <div className="text-2xl font-light text-green-500">100%</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                    Natural
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-white/60 rounded-xl border border-gray-200">
                  <div className="text-2xl font-light text-green-500">15g</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                    Protein
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-white/60 rounded-xl border border-gray-200">
                  <div className="text-2xl font-light text-green-500">12g</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                    Fiber
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="relative flex items-center justify-center">
            <div
              className={`relative transition-all duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Enhanced background elements */}
              <div className="absolute inset-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute inset-20 bg-gradient-to-tr from-lime-100 to-green-200 rounded-full blur-2xl opacity-40"></div>
              </div>
              <img
                src={sevenceralss}
                alt="Seven Cereals Product"
                className="w-[800px] h-[600px] object-contain filter drop-shadow-2xl"
              />
              {/* Floating elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-300 to-emerald-300 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-lime-300 to-green-300 rounded-full blur-xl opacity-60 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductDisplay;
