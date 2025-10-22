import React from 'react';
import { Link } from 'react-router-dom';
const Brands = [
    {
      id: 1,
      name: 'Allen Solly',
      logo: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694978474/Brand/froeq171cfc8x94wbc1f.png',
    },
    {
      id: 2,
      name: 'US Polo',
      logo: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694977762/Brand/jzzezwm81wx16pevragt.png',
    },
    {
      id: 3,
      name: 'Nike',
      logo: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694978732/Brand/czirvinhpudwbkgggfrr.webp',
    },
    {
      id: 4,
      name: 'MI',
      logo: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1695040415/Brand/qd5o9telavnwjkognr9h.svg',
    },
    {
      id: 5,
      name: 'Samsung',
      logo: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1695039979/Brand/rdqfeow344f99jtd4ang.avif',
    },
    {
      id: 6,
      name: 'Apple',
      logo: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1695038323/Brand/skvmglezgnjoj46vrifv.webp',
    },
    {
      id: 7,
      name: 'OnePlus',
      logo: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1695057461/Brand/a8xoypclj1ujcxp6olkm.avif',
    },
    {
      id: 8,
      name: 'Lacoste',
      logo: 'https://res.cloudinary.com/dycjjaxsk/image/upload/v1694979067/Brand/rvleozin5gzyvxlb7jq3.png',
    }
]
const BrandCard = ({ logo, name }) => {
  return (
    <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
      <div className="w-full aspect-square flex items-center justify-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow">
        <img
          src={logo}
          alt={name || 'Brand'}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

const TopBrandsSection = ({ Brands }) => {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Top Clothing Brands
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Brands && Brands.map((brand) => (
            <Link 
              key={brand._id}
              
            >
              <BrandCard logo={brand.logo} name={brand.name} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBrandsSection;

