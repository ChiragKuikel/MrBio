import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name?: string;
  description?: string;
  categoryId?: string[];
  images?: string[];
  price?: number;
  discount?: string;
  finalPrice?: number;
  stock?: number;
  brand?: string;
  tags?: string[];
  status?: string;
  rating?: number;
}

interface VerProductCardProps {
  product?: Product;
  onAddToCart?: (productId: string) => void;
}

const VerProductCard = ({ product, onAddToCart }: VerProductCardProps) => {
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-xs w-full cursor-pointer animate-pulse">
        {/* Shimmer effect for VerProductCard */}
        <div className="w-full h-4 bg-gray-300 mb-2"></div>
        <div className="w-28 h-28 bg-gray-300 mx-auto mb-4"></div>
        <div className="w-24 h-4 bg-gray-300 mb-2"></div>
        <div className="w-16 h-4 bg-gray-300 mb-2"></div>
        <div className="w-16 h-4 bg-gray-300 mb-4"></div>
        <div className="w-full h-8 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onAddToCart && product?.id) onAddToCart(product.id);
    navigate(`/home/our-products/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/home/our-products/${product.id}`);
  };

  const rating = product?.rating ?? 0;
  const name = product?.name ?? "No product name";
  const description = product?.description ?? "";
  const finalPrice = product?.finalPrice ?? 0;
  const originalPrice = product?.price ?? finalPrice;
  const imagesProduct =
    `${import.meta.env.VITE_BASE_URL}${product?.images}`.split(",")[0];
  const stock = product?.stock ?? 0;
  // const discount = product?.discount ?? "-30%";
  // Get the first image from the array, or use a fallback
  const primaryImage =
    imagesProduct && imagesProduct.length > 0 ? imagesProduct[0] : null;
  const slicedDescription =
    description.length > 35
      ? description.substring(0, 35) + "..."
      : description;
console.log("PD IMG", imagesProduct)
  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 w-full cursor-pointer relative flex flex-col h-full group hover:-translate-y-1"
    >
      {/* Discount badge */}
      {/* <div className="absolute top-3 left-4 text-green-600 text-sm font-semibold">
        Nrs. {discount} Off
      </div> */}

      {/* Product Image */}
      <div className="w-full flex items-center justify-center mb-4 pt-2 overflow-hidden rounded-lg bg-gray-50">
        {primaryImage ? (
          <img
            src={imagesProduct}
            alt={name}
            className="h-56 w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-56 w-full flex items-center justify-center text-gray-400 text-sm bg-gray-100 rounded-lg">
            No image
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center justify-start mb-3">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={
              index < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1.5 text-sm text-gray-600 font-medium">
          ({rating?.toFixed(1)})
        </span>
      </div>

      {/* Product Info */}
      <div className="mb-3 flex-grow">
        <h3 className="text-gray-900 font-bold text-base mb-1.5 leading-tight line-clamp-2">
          {name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
          {slicedDescription}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-lg font-bold text-gray-900">
          Nrs. {finalPrice.toFixed(2)}
        </span>
        {originalPrice !== finalPrice && (
          <span className="text-sm text-gray-400 line-through">
            Nrs. {originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* View Product Details Button */}
      <button
        onClick={handleAddToCart}
        disabled={stock <= 0}
        className={`w-full border-2 border-green-600 text-green-600 rounded-full py-2.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-auto ${
          stock > 0
            ? "hover:bg-green-600 hover:text-white hover:shadow-md"
            : "cursor-not-allowed text-gray-400 border-gray-300 bg-gray-50"
        }`}
      >
        View Product Details
      </button>
    </div>
  );
};

export default VerProductCard;
