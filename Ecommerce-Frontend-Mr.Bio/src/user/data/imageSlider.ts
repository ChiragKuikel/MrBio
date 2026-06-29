import newproductt from "../../assets/bannerImages/newproductt.png";
import peanutButterBanner from "../../assets/bannerImages/peanutButterBanner.jpg";
import riceNcornBanner from "../../assets/bannerImages/riceNcornBanner.jpg";

export const slidesData = [
  {
    id: 1,
    badge: "100% ORGANIC",
    title:
      "Organic Oats Meal – Wholesome, Pure, and Naturally Nutritious",
    description:
      "Perfect for health-conscious individuals and families seeking clean, sustainable food choices.",
    buttonText: "SHOP NOW",
    backgroundImage: `${newproductt}`,
    imageType: "bannerImg",
    buttonAction: "shop_now",
  },
  {
    id: 2,
    badge: "PREMIUM QUALITY",
    title: "Organic Bio Products",
    description:
      " Products that are organic (free from synthetic pesticides/fertilizers) and packaged using biodegradable, compostable, or eco-friendly materials.",
    buttonText: "EXPLORE",
    backgroundImage: `${peanutButterBanner}`,
    imageType: "mr.bio",
    buttonAction: "explore",
  },
  // {
  //   id: 3,
  //   badge: "100% ORGANIC",
  //   title:
  //     "Mr. Bio Organic Oats Meal – Wholesome, Pure, and Naturally Nutritious",
  //   description:
  //     "Perfect for health-conscious individuals and families seeking clean, sustainable food choices. Taste the difference of truly organic living with every spoonful.",
  //   buttonText: "SHOP NOW",
  //   backgroundImage: `${oatmealBanner}`,
  //   imageType: "bannerImg",
  //   buttonAction: "shop_now",
  // },
  {
    id: 3,
    badge: "100% ORGANIC",
    title:
      "Mr. Bio Organic Rice and Corn Cereals with Banana 200g",
    description:
      "Nutritious organic baby cereal made with rice, corn, and natural banana – gentle, tasty, and perfect from 4 months+.",
    buttonText: "SHOP NOW",
    backgroundImage: `${riceNcornBanner}`,
    imageType: "tropical_fruits",
    buttonAction: "order_now",
  },
];
