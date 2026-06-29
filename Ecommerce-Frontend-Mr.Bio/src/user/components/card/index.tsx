import { ShoppingCart, Star } from "lucide-react";
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

interface ProductCardProps {
  product?: Product;
  onAddToCart?: (productId: string) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  if (!product) return null;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onAddToCart && product?.id) onAddToCart(product.id);
  };

  const handleCardClick = () => {
    navigate(`/home/our-products/${product.id}`);
  };

  const rating = product?.rating ?? 0;
  const name = product?.name ?? "No product name";
  const description = product?.description ?? ""; // Added description
  const finalPrice = product?.finalPrice ?? 0;
  const originalPrice = product?.price ?? finalPrice;
  const image = product?.images?.[0];
  const stock = product?.stock ?? 0;

  // Slice the description to 30 characters and add "..." if it's longer
  const slicedDescription =
    description.length > 30
      ? description.substring(0, 30) + "..."
      : description;

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 max-w-sm mx-auto overflow-hidden  cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-green-500 group h-full"
      onClick={handleCardClick}
    >
      <div className="w-full bg-white overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full object-contain aspect-[1/1]"
          />
        ) : (
          <div className="text-gray-400 flex items-center justify-center h-48">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={18}
              className={
                index < Math.floor(rating)
                  ? "text-orange-400 fill-orange-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-1 text-sm text-gray-600 font-medium">
            ({rating?.toFixed(1)})
          </span>
        </div>

        {/* Product Name and Sliced Description */}
        <h3 className="text-gray-500 font-semibold text-xl mb-2 leading-snug">
          {name}
          {slicedDescription && ( // Display sliced description if available
            <span className="block text-gray-600 text-base font-normal">
              {slicedDescription}
            </span>
          )}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            Nrs. {finalPrice.toFixed(2)}
          </span>
          {originalPrice !== finalPrice && (
            <span className="text-base text-gray-500 line-through">
              Nrs. {originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className={`w-full border border-green-700 text-green-400 py-2 px-4 rounded-full font-medium text-base flex items-center justify-center gap-2 transition-colors duration-200 ${
            stock > 0
              ? "hover:bg-green-700 hover:text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
          }`}
        >
          {stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
          <ShoppingCart size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
