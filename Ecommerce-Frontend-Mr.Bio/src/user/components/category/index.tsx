import { Baby, Cookie, CupSoda, Sparkles, Nut, Salad, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";

// Icon mapping type
export type IconMap = {
  [key: string]: React.ComponentType<{ size: number; className: string }>;
};

const defaultIconMap: IconMap = {
  baby: Baby,
  cookie: Cookie,
  "cup-soda": CupSoda,
  sparkles: Sparkles,
  nut: Nut,
  salad: Salad,
};

export interface CategoryData {
  id?: string;
  name?: string;
  code?: string;
  description?: string;
  icon?: keyof typeof defaultIconMap;
}

interface CategoryGridProps {
  categories: CategoryData[] | null;
  onCategoryClick?: (category: CategoryData) => void;
  iconMap?: IconMap;
  title?: string;
  itemsPerPage?: number;
}

const ShimmerSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-300 p-6 flex flex-col items-center justify-center space-y-4 animate-pulse w-[180px] flex-shrink-0">
      <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
      <div className="w-24 h-4 bg-gray-200 rounded"></div>
    </div>
  );
};

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategoryClick,
  iconMap = defaultIconMap,
  title = "Popular Category",
  itemsPerPage = 6,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedCategories, setDisplayedCategories] = useState<CategoryData[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Calculate total pages
  const totalPages = categories ? Math.ceil(categories.length / itemsPerPage) : 0;
  
  // Update displayed categories when page or categories change
  useEffect(() => {
    if (categories && categories.length > 0) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayedCategories(categories.slice(startIndex, endIndex));
    } else {
      setDisplayedCategories([]);
    }
  }, [categories, currentPage, itemsPerPage]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const CategoryCard = ({ category }: { category: CategoryData }) => {
    const IconComponent = iconMap[category.icon || "sparkles"] || Sparkles;

    return (
      <div
        className="bg-white rounded-lg border border-gray-300 p-6 cursor-pointer transition-all duration-300 hover:border-[#77b831] group flex flex-col items-center text-center w-[180px] flex-shrink-0"
        onClick={() => onCategoryClick?.(category)}
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
          <IconComponent size={32} className="text-[#77b831]" />
        </div>
        <h3 className="text-base font-bold text-gray-900 line-clamp-1 w-full">
          {category?.name}
        </h3>
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div>
        {/* Header Section */}
        <div className="text-left mb-8">
          <p className="text-xs uppercase tracking-wider text-[#77b831] font-semibold mb-2">
            EXPLORE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {title || "Shop by Category"}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl">
            Discover our curated selection of premium organic products across all categories
          </p>
        </div>

        {/* Navigation and Cards Section */}
        <div className="relative">
          {categories && categories.length > itemsPerPage && (
            <div className="flex justify-end gap-2 mb-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0 || isTransitioning}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  currentPage === 0 || isTransitioning
                    ? "border-gray-200 text-gray-400 cursor-not-allowed" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                } bg-white`}
                aria-label="Previous categories"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1 || isTransitioning}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  currentPage === totalPages - 1 || isTransitioning
                    ? "border-gray-200 text-gray-400 cursor-not-allowed" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                } bg-white`}
                aria-label="Next categories"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          
          <div className="flex justify-start">
            <div className={`flex gap-4 overflow-x-auto pb-2 transition-opacity duration-300 ${
              isTransitioning ? "opacity-50" : "opacity-100"
            }`}>
              {/* Show shimmer skeleton when categories are loading or empty */}
              {categories === null || (categories && categories.length === 0)
                ? Array(6)
                    .fill(null)
                    .map((_, index) => <ShimmerSkeleton key={index} />)
                : displayedCategories.map((category) => (
                    <CategoryCard key={category?.id} category={category} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;