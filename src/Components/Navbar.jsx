import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCartIcon, UserIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Navbar = ({ searchSubmitHandler }) => {
  const [keyword, setKeyword] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  // Define comprehensive categories with subcategories
  const categories = [
    {
      name: "Men",
      path: "/products/men",
      subcategories: [
        "T-Shirts",
        "Shirts",
        "Jeans",
        "Jackets",
        "Shoes",
        "Accessories"
      ]
    },
    {
      name: "Women",
      path: "/products/women",
      subcategories: [
        "Dresses",
        "Tops",
        "Sarees",
        "Jeans",
        "Shoes",
        "Handbags"
      ]
    },
    {
      name: "Kids",
      path: "/products/kids",
      subcategories: [
        "Boys Clothing",
        "Girls Clothing",
        "Baby Clothing",
        "Kids Shoes",
        "Toys"
      ]
    },
    {
      name: "Electronics",
      path: "/products/electronics",
      subcategories: [
        "Mobiles",
        "Laptops",
        "Tablets",
        "Cameras",
        "Headphones",
        "Smart Watches"
      ]
    },
    {
      name: "Home & Kitchen",
      path: "/products/home",
      subcategories: [
        "Home Decor",
        "Kitchen Appliances",
        "Furniture",
        "Bedding",
        "Storage"
      ]
    },
    {
      name: "Beauty",
      path: "/products/beauty",
      subcategories: [
        "Makeup",
        "Skincare",
        "Haircare",
        "Fragrances",
        "Bath & Body"
      ]
    },
    {
      name: "Sports",
      path: "/products/sports",
      subcategories: [
        "Gym Equipment",
        "Sports Shoes",
        "Yoga",
        "Cycling",
        "Swimming"
      ]
    },
    {
      name: "Accessories",
      path: "/products/accessories",
      subcategories: [
        "Watches",
        "Bags",
        "Sunglasses",
        "Jewelry",
        "Belts"
      ]
    }
  ];

  return (
    <nav className="sticky top-0 z-20 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">BlueWhale</span>
          </Link>

          {/* Center: Links */}
          <div className="hidden md:flex space-x-4 relative">
            <Link
              to="/home"
              className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition-colors"
            >
              Home
            </Link>

            {/* Products Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 focus:outline-none flex items-center gap-1 transition-colors">
                Products
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
              </button>

              {showCategories && (
                <div className="absolute left-0 mt-2 w-[800px] bg-white border border-gray-200 rounded-lg shadow-2xl p-6">
                  <div className="grid grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                      <div key={index} className="space-y-3">
                        <Link
                          to={category.path}
                          className="block font-bold text-gray-900 hover:text-blue-600 text-sm mb-3"
                        >
                          {category.name}
                        </Link>
                        <ul className="space-y-2">
                          {category.subcategories.map((sub, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={`${category.path}/${sub.toLowerCase().replace(/ /g, "-")}`}
                                className="block text-sm text-gray-600 hover:text-blue-600 hover:pl-2 transition-all"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Right: Search & Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            <form
              className="flex items-center"
              onSubmit={(e) => {
                e.preventDefault();
                searchSubmitHandler(keyword);
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-r-md font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            <Link
              to="/cart"
              className="flex items-center space-x-1 text-gray-800 hover:text-blue-600 transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="font-medium">Cart</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-1 text-gray-800 hover:text-blue-600 transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              <span className="font-medium">Account</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Blue Bottom Border */}
      <div className="h-1 bg-blue-600"></div>
    </nav>
  );
};

export default Navbar;
