import React, { useState } from 'react';
import { Trash2, Tag } from 'lucide-react';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'ADRO T Shirts Pack of 2 Mens Tshirts Cotton T Shirts for Men Tshirt T-Shirts',
      image: 'https://via.placeholder.com/120x120/000000/FFFFFF?text=T-Shirt',
      price: 699,
      originalPrice: 1999,
      quantity: 1,
      inStock: false
    },
    {
      id: 2,
      name: 'Lacoste Movement Polo Shirt Ultra Light Pique',
      image: 'https://via.placeholder.com/120x120/40E0D0/FFFFFF?text=Polo',
      price: 5599,
      originalPrice: 7899,
      quantity: 1,
      inStock: true
    }
  ]);

  const [deliveryAddress, setDeliveryAddress] = useState('Vishal Shakya');
  const [couponApplied, setCouponApplied] = useState(1);

  // Calculate totals
  const totalMRP = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const discountOnMRP = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const couponDiscount = 0;
  const percentOff = 0;
  const shippingCharges = 40;
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingCharges;

  const handleQuantityChange = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-between border border-gray-200">
              <div className="text-sm text-gray-700">
                Deliver to: <span className="font-semibold">{deliveryAddress}</span>
              </div>
              <button className="px-4 py-2 border-2 border-gray-800 text-gray-800 font-semibold text-sm rounded hover:bg-gray-800 hover:text-white transition-colors">
                CHANGE ADDRESS
              </button>
            </div>

            {/* Cart Items */}
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 object-contain bg-gray-50 rounded"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <div className="flex-grow pr-4">
                        <h3 className="text-gray-800 font-medium mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{item.price}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.originalPrice}
                          </span>
                          {item.inStock ? (
                            <span className="text-sm text-green-600 font-semibold">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-sm text-red-600 font-semibold">
                              Out Of Stock
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="px-3 py-1 hover:bg-gray-100 font-bold text-gray-600"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 border-x border-gray-300 font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="px-3 py-1 hover:bg-gray-100 font-bold text-gray-600"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex flex-col items-end justify-between">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{item.price}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-4">
              {/* Delivery Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery</h2>
                <p className="text-sm text-gray-700 mb-4">
                  Your order is eligible for <span className="font-semibold text-green-600">FREE Delivery</span>.
                </p>
                
                <div className="flex items-start gap-2 bg-gray-50 p-3 rounded mb-4">
                  <Tag className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">{couponApplied} coupon applied</span>
                    </p>
                    <p className="text-gray-600">You saved additionally ₹0</p>
                  </div>
                  <button className="ml-auto px-3 py-1 border border-red-400 text-red-600 text-xs font-semibold rounded hover:bg-red-50">
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Total MRP</span>
                  <span className="font-semibold text-gray-900">₹{totalMRP}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Discount on MRP</span>
                  <span className="font-semibold text-green-600">-₹{discountOnMRP}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Coupon Discount</span>
                  <span className="font-semibold text-green-600">-₹{couponDiscount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">%OFF</span>
                  <span className="font-semibold text-green-600">-₹{percentOff}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Shipping charges</span>
                  <span className="font-semibold text-gray-900">₹{shippingCharges}</span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="border-t-2 border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₹{totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-3 bg-teal-800 text-white font-semibold rounded hover:bg-teal-900 transition-colors">
                  Proceed to Checkout
                </button>
                <button className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition-colors">
                  Continue shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
