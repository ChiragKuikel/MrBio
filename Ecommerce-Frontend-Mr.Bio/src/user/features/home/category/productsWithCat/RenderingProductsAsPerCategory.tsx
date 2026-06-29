import { useParams } from "react-router-dom";
import useGetProductList from "../../../../../shared/hooks/products/get/useGetProductList";
import { IProduct } from "../../../../../shared/types/Types";
import { VerticalProductShowCase } from "../../../../components/card/verticalProductCard.tsx/VerticalCartProducts";
import PageHeader from "../../../../../shared/components/pageHeader";

// Simple spinner component
const Spinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// No products message component
const NoProductsMessage = () => (
  <>
    <PageHeader
      title="Product"
      breadcrumbs={[{ label: "Home", path: "/" }, { label: "Product" }]}
    />
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No products available
      </h3>
      <p className="text-gray-500 max-w-md">
        No products are available for this category at the moment. Please check
        back later or browse other categories.
      </p>
    </div>
  </>
);

const RenderingProductsAsPerCategory = () => {
  const { id: categoryId } = useParams();
  const { data, isLoading } = useGetProductList(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    categoryId
  );

  const filteredProducts = data?.data?.rows?.map((items: IProduct) => {
    return { ...items };
  });

  // Show spinner while loading
  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  // Show no products message if no data or empty array
  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div>
        <NoProductsMessage />
      </div>
    );
  }

  // Show products if data is available
  return (
    <div>
      <PageHeader
        title="Product"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Product" }]}
      />
      <VerticalProductShowCase
        products={filteredProducts}
        onAddToCart={undefined}
        title="Products"
      />
    </div>
  );
};

export default RenderingProductsAsPerCategory;
