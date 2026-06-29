import { Award, CheckCircle, Heart, Leaf, Star } from 'lucide-react';

const ProductShowcase = () => {
  const features = [
    { icon: <Leaf className="w-5 h-5" />, text: "100% Organic" },
    { icon: <Award className="w-5 h-5" />, text: "Premium Quality" },
    { icon: <Heart className="w-5 h-5" />, text: "Heart Healthy" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "No Added Sugar" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Pure <span className="text-orange-500">Organic</span> Goodness
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the rich, creamy taste of our premium organic peanut butter, 
            made with love and the finest ingredients nature has to offer.
          </p>
        </div>

        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Product Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full opacity-20 blur-3xl transform scale-110"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
              <img 
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" 
                alt="Mr. Bio Organic Peanut Butter" 
                className="w-full h-auto"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f9fa'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='16' fill='%23666' text-anchor='middle' dominant-baseline='middle'%3EPeanut Butter Product%3C/text%3E%3C/svg%3E")`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  minHeight: '400px'
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Mr. Bio Organic Peanut Butter
              </h2>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8/5 from 2,847 reviews)</span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Experience the perfect blend of taste and nutrition with our crunchy organic peanut butter. 
                Made from carefully selected organic peanuts, each jar delivers exceptional flavor and wholesome goodness.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm">
                  <div className="text-green-600">{feature.icon}</div>
                  <span className="font-semibold text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Price and CTA */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-orange-600">$12.99</span>
                <span className="text-xl text-gray-500 line-through">$15.99</span>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Save 19%
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Add to Cart
                </button>
                <button className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Organic Certified</h3>
            <p className="text-gray-600">
              Our peanuts are grown without synthetic pesticides or fertilizers, ensuring pure, 
              natural flavor in every jar.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Nutritious Choice</h3>
            <p className="text-gray-600">
              Packed with protein, healthy fats, and essential nutrients to fuel your active lifestyle 
              and support your wellbeing.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
            <p className="text-gray-600">
              Carefully crafted in small batches using traditional methods to preserve the rich, 
              authentic taste you'll love.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductShowcase;