import React, { useState } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    if (onAddToCart) {
      await onAddToCart(product);
    }
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 w-full max-w-xs border border-gray-100">
      {/* Image Container */}
      <div className="relative bg-gray-50 aspect-square group">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-blue-600 text-blue-600' : 'text-gray-400 hover:text-blue-600'
            }`}
          />
        </button>

        {/* Quick View on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors min-h-[40px] leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewCount || 0} Review{product.reviewCount !== 1 ? 's' : ''})
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-2.5 px-4 border-2 border-gray-300 rounded-full text-gray-700 text-sm font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add To Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
