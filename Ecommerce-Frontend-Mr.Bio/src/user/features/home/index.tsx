/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
// import { Baby, Cookie, CupSoda, Sparkles, Nut, Salad } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetCategoryLists from "../../../shared/hooks/category/get/useGetCategoryList";
import useGetProductList from "../../../shared/hooks/products/get/useGetProductList";
import { VerticalProductShowCase } from "../../components/card/verticalProductCard.tsx/VerticalCartProducts";
import CategoryGrid from "../../components/category";
import ImageSlider from "../../components/imageSlider";
import FeatureImage from "./featureImage/featureImage";
// import cider from "../../../assets/productImage/cider.jpg";
import pinkcerals from "../../../assets/productImage/pinkcerals.png";
import LogoSlider from "../../components/imageSlider/certificationSlider";
import FeaturedProductDisplay from "./featuredProduct";
import GifProductShowcase from "./videoWithDesc";
type IconMap = {
  [key: string]: React.ComponentType<{ size: number; className: string }>;
};
// D:\ritika\Ecommerce-Frontend-Mr.Bio\src\assets\productImage\sevencerala.png
interface RawCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  status?: string;
}

interface Category extends RawCategory {
  icon: keyof IconMap;
}

const mapIcon = (name: string): keyof IconMap => {
  const lower = name.toLowerCase();
  if (lower.includes("baby")) return "baby";
  if (lower.includes("snack") || lower.includes("breakfast")) return "cookie";
  if (lower.includes("drink") || lower.includes("beverage")) return "cup-soda";
  if (lower.includes("meal")) return "salad";
  if (lower.includes("nut")) return "nut";
  return "sparkles"; // fallback icon
};

const LandingPage = () => {
  const navigate = useNavigate();

  // Get all products for featured section
  const { data: productsData } = useGetProductList();

  // Get best seller products specifically
  const { data: bestSellerData } = useGetProductList(
    undefined, // limit
    undefined, // page
    undefined, // sortBy
    undefined, // keyword
    undefined, // keyword
    "best_seller",
    undefined // status
  );

  const { data: categoryDataList } = useGetCategoryLists();
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<any[]>([]);

  const handleCategoryClick = (category: any) => {
    navigate(`/home/products-by-category/${category.id}`);
  };
  useEffect(() => {
    if (categoryDataList?.data?.rows) {
      const enriched = categoryDataList?.data?.rows
        .filter((cat: RawCategory) => cat.status !== "inactive") // Filter out inactive categories
        .map((cat: RawCategory) => ({
          ...cat,
          icon: mapIcon(cat?.name),
        }));
      setCategoryData(enriched);
    }
  }, [categoryDataList]);

  useEffect(() => {
    if (productsData?.data?.rows) {
      setProductData(productsData?.data?.rows);
    }
  }, [productsData]);

  useEffect(() => {
    if (bestSellerData?.data?.rows) {
      setBestSellerProducts(bestSellerData?.data?.rows);
    }
  }, [bestSellerData]);

  return (
    <Box className="py-8 px-2 sm:px-4 md:px-5 lg:px-8 xl:px-22">
      <Box>
        <ImageSlider />
      </Box>
      <Box>
        <CategoryGrid
          categories={categoryData?.map(({ id, name, description, icon, status }) => ({
            id,
            name,
            description,
            icon,
            status,
          }))}
          onCategoryClick={handleCategoryClick}
        />
      </Box>

      <Box>
        <VerticalProductShowCase
          products={productData || []}
          title="Featured Products"
          // limit={4}
          showViewMore={productData.length > 4}
        />
      </Box>
      <Box>
        <FeaturedProductDisplay />
      </Box>
      {/* <Box className="my-8">
        <PromotionalBanner
          discountBadge="Up to 50% off"
          title="SEVEN CEREALS"
          subtitle="Premium blend of seven nutritious cereals carefully selected for optimal health benefits. Rich in fiber, protein, and essential nutrients to fuel your day with natural energy."
          buttonText="BUY NOW"
          imageUrl={sevenceralss}
          onButtonClick={() => {
            navigate("/home/our-products");
          }}
        />
      </Box> */}
      <Box>
        <VerticalProductShowCase
          products={productData || []}
          title="Featured Products"
          // subtitle="Handpicked selection of our finest organic products for you"
          // showHeader={true}
          // limit={4}
          showViewMore={productData.length > 4}
        />
      </Box>

      <Box>
        <GifProductShowcase />
      </Box>
      <Box>
        <VerticalProductShowCase
          products={bestSellerProducts || []}
          title="Our Best Seller"
          // limit={4}
          showViewMore={bestSellerProducts.length > 4}
        />
      </Box>
      <Box>
        <LogoSlider title="Our Certifications" />
      </Box>
      <Box>
        <FeatureImage
          image={`${pinkcerals}`}
          title="Mr. Bio Organic Oats and Rice Cereals With Milk, Banana and Apple"
          description="A creamy, wholesome blend of organic oats and rice, enriched with real milk powder and naturally sweetened with banana and apple. Designed for babies (4‑6 months +), this gentle, naturally flavored cereal contains no added sugar and is instant‑ready—perfect for easy, nutritious weaning."
          layout="image-right"
          badge="Organic"
          highlights={[
            "100% Natural",
            "No Preservatives",
            "Cold-Pressed",
            "Rich in Nutrients",
          ]}
          buttonText="Shop Now"
          onButtonClick={() => {
            navigate("/home/our-products");
          }}
          showViewMore={true}
          viewMoreLink="/home/our-products"
        />
      </Box>
      {/* <Box>
        <ProductShowcase/>
      </Box> */}
    </Box>
  );
};

export default LandingPage;
