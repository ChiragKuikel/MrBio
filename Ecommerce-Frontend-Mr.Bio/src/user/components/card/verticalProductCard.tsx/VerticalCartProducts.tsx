import { Link } from "react-router-dom";
import VerProductCard from "./cardWrappper";
// Define the Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string[];
  images: string[];
  price: number;
  discount: string;
  finalPrice: number;
  stock: number;
  brand: string;
  tags: string[];
  status: string;
  rating: number;
}

// Define the props for the VerticalProductShowCase component
interface VerticalProductShowCaseProps {
  products: Product[];
  onAddToCart?: (productId: string) => void;
  title?: string;
  showViewMore?: boolean;
  // Pagination controls
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
}

export const VerticalProductShowCase = ({
  products,
  onAddToCart,
  title,
  showViewMore = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  // currentPage,
  // totalPages,
  totalCount,
}: VerticalProductShowCaseProps) => {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h6 className="text-2xl font-bold text-gray-900">{title}</h6>
            {totalCount && (
              <p className="text-sm text-gray-500 mt-1">
                Showing {products.length} of {totalCount} products
              </p>
            )}
          </div>
          {showViewMore && (
            <Link
              to="/home/our-products"
              className="text-green-600 hover:text-green-800 transition duration-200 text-sm font-medium relative group"
            >
              View More
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-800 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <VerProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart?.(product.id)}
            />
          ))}
        </div>

        {/* Load More Button Section */}
        {hasNextPage && (
          <div className="flex justify-center mt-12">
            <button
              onClick={fetchNextPage}
              disabled={isFetchingNextPage}
              className={`
                px-8 py-3 rounded-lg font-medium transition-all duration-200
                ${isFetchingNextPage 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                }
              `}
            >
              {isFetchingNextPage ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading more products...
                </span>
              ) : (
                'Load More Products'
              )}
            </button>
          </div>
        )}

        {/* Loading More Products Indicator (when no more pages but still loading) */}
        {isFetchingNextPage && !hasNextPage && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading products...</span>
            </div>
          </div>
        )}

        {/* No More Products Message */}
        {/* {!hasNextPage && products.length > 0 && !isFetchingNextPage && (
          <p className="text-center py-8 text-gray-400 text-sm">
            You've reached the end of the product list. Check back later for more amazing products!
          </p>
        )} */}

        {/* Empty State */}
        {products.length === 0 && !isFetchingNextPage && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No products found.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};