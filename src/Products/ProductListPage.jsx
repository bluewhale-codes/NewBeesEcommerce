import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';

const ProductListingPage = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedClothingTypes, setSelectedClothingTypes] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    { id: 'women', label: 'Women' },
    { id: 'men', label: 'Men' },
    { id: 'girls', label: 'Girls' },
    { id: 'boys', label: 'Boys' }
  ];

  const clothingTypes = [
    { id: 'tshirt', label: 'Tshirt' },
    { id: 'jeans', label: 'Jeans' },
    { id: 'jackets', label: 'Jackets' },
    { id: 'shirt', label: 'Shirt' }
  ];

  const handleClothingTypeChange = (typeId) => {
    if (selectedClothingTypes.includes(typeId)) {
      setSelectedClothingTypes(selectedClothingTypes.filter(t => t !== typeId));
    } else {
      setSelectedClothingTypes([...selectedClothingTypes, typeId]);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedClothingTypes([]);
  };

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <div className="bg-white rounded-lg p-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
          Filter
        </h2>
        <button
          onClick={clearFilters}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => setSelectedCategory(category.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900 text-sm">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clothing Type Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Clothing Type
        </h3>
        <div className="space-y-3">
          {clothingTypes.map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedClothingTypes.includes(type.id)}
                onChange={() => handleClothingTypeChange(type.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 group-hover:text-gray-900 text-sm">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </button>

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="absolute top-4 right-4"
                >
                  <X className="w-6 h-6" />
                </button>
                <FilterSidebar />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Brand Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">LACOSTE</span>
              </div>
              <h1 className="text-3xl font-light tracking-[0.3em] text-gray-900">
                Lacoste
              </h1>
            </div>

            {/* Products Grid - Using Your ProductCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products && products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
