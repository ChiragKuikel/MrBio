import { Droplet, Shield, Zap } from "lucide-react";
import { useState } from "react";
import appleVideo from "../../../../assets/productImgs/appleVideo.gif";

const GifProductShowcase = () => {
  const [selectedSize, setSelectedSize] = useState("500ml");

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 mt-16 sm:mt-18">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
        {/* Product GIF */}
        <div className="relative flex items-center justify-center order-2 lg:order-1">
          <div className="relative w-full max-w-md lg:max-w-lg">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-lime-200 rounded-full blur-3xl opacity-60 scale-110"></div>

            {/* GIF container */}
            <div className="relative rounded-2xl sm:rounded-3xl shadow-2xl">
              <img
                src={appleVideo}
                alt="Mr. Bio Apple Cider Vinegar"
                className="w-full h-auto object-contain rounded-2xl sm:rounded-3xl"
              />

              {/* Floating badges */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-green-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                BESTSELLER
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-yellow-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                GRAB YOURS NOW
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
          {/* Header */}
          <div className="space-y-3 sm:space-y-4 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                Mr. <span className="text-green-500">Bio</span>
              </h1>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-800">
              Apple Cider Vinegar
            </h2>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm sm:text-base">Raw Power</div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Unfiltered & Natural
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm sm:text-base">Organic</div>
                <div className="text-xs sm:text-sm text-gray-600">Certified Quality</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm sm:col-span-2 lg:col-span-1">
              <Droplet className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm sm:text-base">With Mother</div>
                <div className="text-xs sm:text-sm text-gray-600">Live Probiotics</div>
              </div>
            </div>
          </div>

          {/* Size + Action row */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-6">
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Size</label>
                <div className="flex gap-3">
                  {["500ml"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${
                        selectedSize === size
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto flex justify-center sm:justify-end">
              <button
                onClick={() => {
                  const appBaseUrl =
                    (import.meta as any).env?.VITE_APP_BASE_URL || window.location.origin;
                  window.location.href = `${appBaseUrl}/home/our-products/355f6936-1776-4346-8e84-a578b9883551`;
                }}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow min-w-[140px]"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Benefits */}

          {/* Benefits */}
          <div className="space-y-3 p-3 sm:p-4 bg-green-50 rounded-lg text-center lg:text-left">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Health Benefits:</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span>Supports healthy digestion</span>
              </li>
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span>May help maintain healthy weight</span>
              </li>
              <li className="flex items-center gap-2 justify-center lg:justify-start">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span>Rich in beneficial probiotics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifProductShowcase;
