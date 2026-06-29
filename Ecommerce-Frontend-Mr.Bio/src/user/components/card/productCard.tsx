import ProductCard from "./index";

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

interface ProductShowcaseProps {
  products: Product[];
  onAddToCart?: (productId: number) => void;
  title?: string;
}

const ProductShowcase = ({
  products,
  onAddToCart,
  title = "Featured Products",
}: ProductShowcaseProps) => {
  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h6 className="text-2xl font-bold text-gray-900">{title}</h6>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
