/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import PageHeader from "../../../shared/components/pageHeader";
import useGetProductList from "../../../shared/hooks/products/get/useGetProductList";
import { VerticalProductShowCase } from "../../components/card/verticalProductCard.tsx/VerticalCartProducts";

// Enhanced Search Field Component
const SearchField = ({ value, onChange, placeholder = "Search products..." }: any) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <svg
            className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Search Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 text-lg bg-white border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 hover:shadow-md"
          placeholder={placeholder}
        />
        
        {/* Clear Button */}
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center group/clear z-10"
            aria-label="Clear search"
          >
            <div className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <svg
                className="h-4 w-4 text-gray-500 group-hover/clear:text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

// Error Component
const ErrorMessage = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600">Unable to load products. Please try again later.</p>
    </div>
  </div>
);

// Search Results Info
const SearchResultsInfo = ({ searchTerm, productCount, isLoading, totalCount }: any) => {
  if (!searchTerm) return null;
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-green-800 font-medium">
          {isLoading ? (
            <span className="flex items-center">
              <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mr-2"></div>
              Searching...
            </span>
          ) : (
            `Found ${totalCount || productCount} ${(totalCount || productCount) === 1 ? 'product' : 'products'} for "${searchTerm}"`
          )}
        </span>
      </div>
    </div>
  );
};

const Products = () => {
  const [productData, setProductData] = useState<any[]>([]);
  const [keyword, setKeyWord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [allProducts, setAllProducts] = useState<any[]>([]); // Store all loaded products
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setKeyWord(searchTerm);
      // Reset pagination when search changes
      setCurrentPage(0);
      setAllProducts([]);
      setProductData([]);
      setIsSearching(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const limit = 10; // Number of products per page
  
  const { data: productsData, isLoading, error } = useGetProductList(
    limit, 
    currentPage + 1, // API uses 1-based indexing
    undefined, 
    keyword,
    undefined,
    undefined,
    undefined
  );
  
  useEffect(() => {
    if (productsData?.data?.rows) {
      if (currentPage === 0) {
        // First page - replace products
        setAllProducts(productsData.data.rows);
      } else {
        // Subsequent pages - append products
        setAllProducts(prev => [...prev, ...productsData.data.rows]);
      }
      setProductData(productsData.data.rows);
      setIsSearching(false);
      
      // Update pagination info from metaInfo
      if (productsData.data.metaInfo) {
        setTotalPages(productsData.data.metaInfo.totalPage);
        setTotalCount(productsData.data.metaInfo.totalCount);
      }
    }
  }, [productsData, currentPage]);

  const handleLoadMore = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const hasNextPage = currentPage + 1 < totalPages;
  const isFetchingNextPage = isLoading && currentPage > 0;

  // Show initial loading spinner only on first load and no products
  if ((isLoading && currentPage === 0 && allProducts.length === 0) || (isSearching && currentPage === 0 && allProducts.length === 0)) {
    return <LoadingSpinner />;
  }
  if (error && allProducts.length === 0) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Our Products"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Our Products" }]}
      />
      
      {/* Search Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover Our Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for from our extensive collection of quality products.
            </p>
          </div>
          
          <SearchField
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by product name, category, or description..."
          />
          
          <SearchResultsInfo 
            searchTerm={searchTerm}
            productCount={productData.length}
            totalCount={totalCount}
            isLoading={(isLoading || isSearching) && currentPage === 0}
          />
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-12 py-4">
        <VerticalProductShowCase
          products={allProducts}
          title={searchTerm ? `Search Results for "${searchTerm}"` : "All Products"}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={handleLoadMore}
          currentPage={currentPage + 1}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};

export default Products;