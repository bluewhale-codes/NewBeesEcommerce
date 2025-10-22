import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const ProductSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [wishlist, setWishlist] = useState([]);

  const categories = ['All', 'Clothes', 'Shoose', 'Electronics', 'Assassories'];

  const products = [
    {
      id: 1,
      name: 'ADRO T Shirts Pack of 2 Mens Tshirts Oversized T Shirts for Men Tshirt T-Shirts',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1695036716/products/pukgc468gfkgzousnjlc.jpg',
      price: 1999,
      originalPrice: 699,
      rating: 4,
      category: 'Clothes'
    },
    {
      id: 2,
      name: 'SPARX Mens Sx0875g Walking',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694704850/products/te5jo9bwoh1awo5ev39w.jpg',
      price: 799,
      originalPrice: 999,
      rating: 0,
      category: 'Shoose'
    },
    {
      id: 3,
      name: 'ColorChakra Mens Waffle Knit Polo Tshirt Collar Knitted Shirt for Men M to 3XL',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694704701/products/wz6d0tlhdhup7lrt8apa.avif',
      price: 889,
      originalPrice: 1299,
      rating: 0,
      category: 'Clothes'
    },
    {
      id: 4,
      name: 'ADRO T-Shirts for Men | Chest Printed Tshirt for Men | Cotton Tshirt for',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694704505/products/l7cyjcv8vqkl8poy2xad.avif',
      price: 2333,
      originalPrice: 5999,
      rating: 0,
      category: 'Clothes'
    },
    {
      id: 5,
      name: 'JVX Men Oversized Tshirt || T Shirt for Men || Men T Shirt Printed (MOT-101)',
      image: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694704592/products/kfaryytlgkv4bp3j0a16.avif',
      price: 788,
      originalPrice: 999,
      rating: 0,
      category: 'Clothes'
    }
  ];

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category === activeCategory);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        Todays Best Deals For You!
      </h2>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-slate-800 hover:text-slate-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
          >
            {/* Product Image Container */}
            <div className="relative bg-gray-50 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  wishlist.includes(product.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-600 hover:text-white'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlist.includes(product.id) ? 'fill-white' : ''
                  }`}
                />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Product Name */}
              <h3 className="text-sm text-gray-800 font-medium line-clamp-2 h-10 mb-2">
                {product.name}
              </h3>

              {/* Price Section */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-3">
                {renderStars(product.rating)}
              </div>

              {/* Add to Cart Button */}
              <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-200">
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
