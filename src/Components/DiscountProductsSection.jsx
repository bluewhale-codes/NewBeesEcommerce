import React from 'react';
import DiscountProducts from './DiscountProducts';
const dproduct = [
  {
    _id: "prod001",
    name: "Men's Classic Blue Denim Jacket - Premium Quality",
    images: [
      { url: "https://res.cloudinary.com/dycjjaxsk/image/upload/v1695034630/products/v6qeufmulv6kfrifl2ys.jpg" }
    ],
    dpercentage: 60,
    price: 1299,
    originalPrice: 3249,
    category: "Jackets",
    brand: "Denim Co"
  },
  {
    _id: "prod002",
    name: "Women's Floral Print Summer Dress - Light & Comfortable",
    images: [
      { url: "https://res.cloudinary.com/dycjjaxsk/image/upload/v1703961078/Avatars/gdhfnbuf6mr1qu9ovrg0.jpg" }
    ],
    dpercentage: 70,
    price: 799,
    originalPrice: 2665,
    category: "Dresses",
    brand: "FashionVibe"
  },
  {
    _id: "prod003",
    name: "Unisex Sports Running Shoes - Breathable Mesh",
    images: [
      { url: "https://res.cloudinary.com/dycjjaxsk/image/upload/v1703960925/Avatars/mbcxund3rqu6bi0rsmzr.jpg" }
    ],
    dpercentage: 55,
    price: 1599,
    originalPrice: 3553,
    category: "Footwear",
    brand: "SportMax"
  },
  {
    _id: "prod004",
    name: "Men's Formal Checked Shirt - Office Wear",
    images: [
      { url: "https://res.cloudinary.com/dycjjaxsk/image/upload/v1695035781/products/zoe1hre5tjp8qd3eyd6r.jpg" }
    ],
    dpercentage: 50,
    price: 699,
    originalPrice: 1398,
    category: "Shirts",
    brand: "Elegance"
  },
  {
    _id: "prod005",
    name: "Women's Leather Handbag - Designer Collection",
    images: [
      { url: "https://res.cloudinary.com/dycjjaxsk/image/upload/v1695038328/Brand/bwbxwwxjznvoktfugyov.jpg" }
    ],
    dpercentage: 75,
    price: 2499,
    originalPrice: 9996,
    category: "Accessories",
    brand: "LuxeBags"
  },
  {
    _id: "prod006",
    name: "Kids Cotton Cartoon Print T-Shirt - Pack of 3",
    images: [
      { url: "https://res.cloudinary.com/dycjjaxsk/image/upload/v1695036155/products/adpugim3eawyps7622q2.jpg" }
    ],
    dpercentage: 65,
    price: 599,
    originalPrice: 1711,
    category: "Kids Wear",
    brand: "KiddoStyle"
  },
  {
    _id: "prod007",
    name: "Men's Slim Fit Black Jeans - Stretchable Fabric",
    images: [
      { url: "https://res.cloudinary.com/dycjjaxsk/image/upload/v1695035143/products/f4cfmxwzsfbpzq87x9vx.jpg" }
    ],
    dpercentage: 55,
    price: 899,
    originalPrice: 1997,
    category: "Jeans",
    brand: "DenimHub"
  },
  {
    _id: "prod008",
    name: "Women's Yoga Pants - High Waist Active Wear",
    images: [
      { url: "https://res.cloudinary.com/dycjjaxsk/image/upload/v1695035829/products/wgibyglaumwgaokqy5aw.jpg" }
    ],
    dpercentage: 60,
    price: 749,
    originalPrice: 1872,
    category: "Activewear",
    brand: "FitLife"
  }
];

const DiscountProductsSection = ({ dproduct }) => {
  return (
    <div className="w-full py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Heavy Discount Products!!
        </h2>
        
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {dproduct && dproduct.map((product) => (
            <div key={product._id || product.id} className="flex-shrink-0">
              <DiscountProducts product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscountProductsSection;
