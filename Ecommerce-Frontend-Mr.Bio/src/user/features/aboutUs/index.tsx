/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, Star, Leaf, Heart, Shield, Flower } from "lucide-react";
import PageHeader from "../../../shared/components/pageHeader";
import { useNavigate } from "react-router-dom";

// Mock PageHeader component
const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "100% Organic Certified",
      icon: <CheckCircle className="w-6 h-6" />,
      description: "Certified organic with no compromises",
    },
    {
      title: "Free from Chemicals",
      icon: <Shield className="w-6 h-6" />,
      description: "Pure, natural ingredients only",
    },
    {
      title: "Locally Sourced",
      icon: <Flower className="w-6 h-6" />,
      description: "Supporting local farming communities",
    },
    {
      title: "Sustainable Farming",
      icon: <Leaf className="w-6 h-6" />,
      description: "Environmentally responsible production",
    },
    {
      title: "Quality Crafted",
      icon: <Star className="w-6 h-6" />,
      description: "Attention to detail in every product",
    },
    {
      title: "Wellness Focused",
      icon: <Heart className="w-6 h-6" />,
      description: "Your health is our priority",
    },
  ];

  return (
    <>
      <PageHeader
        title="About Us"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "About Us" }]}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-green-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Leaf className="w-4 h-4 mr-2" />
                100% Organic Products
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Go <span className="text-green-600">Bio</span>,
                <br />
                Live <span className="text-green-600">Better</span>!
              </h1>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                At{" "}
                <span className="font-semibold text-green-700">
                  Mr. Bio Nepal
                </span>
                , we believe that a healthier life begins with natural choices.
                We offer 100% organic products like oats, vinegar, and
                cornflakes—free from harmful chemicals and full of goodness.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/home/our-products")}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Discover Our Products
                </button>
                {/* <button
                  onClick={() => navigate("/contact")}
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Learn More
                </button> */}
              </div>
            </div>

            {/* Visual Element */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-12 text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800">
                      Organic
                    </h3>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800">
                      Natural
                    </h3>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800">
                      Wholesome
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-green-600">Mr. Bio Nepal</span>
                ?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're committed to delivering the highest quality organic
                products while supporting sustainable practices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Flower className="w-4 h-4 mr-2" />
              Our Mission
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Revolutionizing How{" "}
              <span className="text-green-600">Nepal Eats</span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              To revolutionize the way Nepal eats by providing accessible,
              certified organic products that nourish the body while respecting
              the earth. We're committed to building a sustainable food
              ecosystem that supports local farmers and delivers genuine health
              benefits to our community.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  100%
                </div>
                <div className="text-gray-600">Organic Certified</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  50+
                </div>
                <div className="text-gray-600">Organic Products</div>
              </div>
            </div>

            {/* CTA Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/contact")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate("/blog")}
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Read Our Blog
            </button>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
