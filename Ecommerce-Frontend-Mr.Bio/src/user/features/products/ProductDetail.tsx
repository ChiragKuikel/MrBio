/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useGetProductById from "../../../shared/hooks/products/get/useGetProductById";
import usePostAddToCartById from "../../../shared/hooks/user/addToCart/post/usePostAddToCartById";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // New state to track selected image
  const { data: product, isLoading, error } = useGetProductById(id);
  const userId = localStorage.getItem("userId");

  //API FOR POST ADD TO CART
  const { mutate: addToCart } = usePostAddToCartById();

  const handleAddToCart = (
    productId: string,
    quantity: number,
    userId: any
  ) => {
    // Check if user is authenticated
    if (!userId) {
      toast.warn("Please login to continue");
      navigate("/home/login");
      return;
    }

    addToCart(
      { productId, quantity, userId },
      {
        onSuccess: () => {
          navigate("/home/our-products");
        },
        onError: () => {
          toast.error("Failed to add product to cart.");
        },
      }
    );
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  useEffect(() => {
    if (product?.data?.categoryId) {
      localStorage.setItem(
        "categoryIds",
        JSON.stringify(product.data.categoryId)
      );
    }
  }, [product?.data?.categoryId]);
  // Calculate total price
  const totalPrice = product?.data?.finalPrice
    ? (product.data.finalPrice * quantity).toFixed(2)
    : 0;
  const totalOriginalPrice = product?.data?.price
    ? (product.data.price * quantity).toFixed(2)
    : null;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-700">
        Loading product details...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-red-600">
        Error loading product details.
      </div>
    );
  if (!product)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-700">
        Product not found.
      </div>
    );

  // Set the first image as the default selected image if none is selected
  const defaultImage = product?.data?.images?.[0] || "/placeholder.png";
  const imageToShow = selectedImage || defaultImage;

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image); // Update the main image on thumbnail click
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left: Product Image */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center relative overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${imageToShow}`}
                  alt={product?.data?.name}
                  className="max-h-96 w-full object-contain transition-transform duration-500 ease-in-out hover:scale-125"
                />
              </div>

              {/* Thumbnail images */}
              <div className="flex space-x-2 overflow-x-auto">
                {product?.data?.images?.map((image: any, index: number) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg border-2 border-transparent hover:border-orange-500 cursor-pointer"
                    onClick={() => handleThumbnailClick(image)} // Handle thumbnail click
                  >
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}${image}`}
                      alt={`${product?.data?.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">
                  In Stock
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                {product?.data?.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 fill-current text-orange-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product?.data?.rating || 5} Reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  Nrs. {totalPrice}
                </span>
                {totalOriginalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    Nrs. {totalOriginalPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              {/* <p className="text-gray-600 leading-relaxed">
                {product?.data?.description}
              </p> */}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={handleDecrement}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 text-gray-900 font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
                  type="button"
                  onClick={() =>
                    handleAddToCart(product?.data?.id, quantity, userId)
                  }
                >
                  <ShoppingCart size={18} />
                  <span>Add To Cart</span>
                </button>
              </div>

              {/* Shipping Info */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Estimated Delivery:</span>
                  <span className="ml-2">Up to 7 business days</span>
                </div>
                {/* <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Guarantee:</span>
                  <span className="ml-2">100% money back Guarantee</span>
                </div> */}
              </div>

              {/* Product Details */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span>{" "}
                  {product?.data?.brand || "Vegetables"}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Stock:</span>{" "}
                  {product?.data?.stock}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm mt-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 text-orange-600 border-b-2 border-orange-600 font-medium text-sm">
                Description
              </button>
            </nav>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              {product?.data?.description}
            </p>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
