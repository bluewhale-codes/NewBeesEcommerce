import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

const DiscountProducts = ({ product }) => {
  return (
    <div className="w-52 relative mx-3 my-10">
      <Link target="_blank" to={`/${product._id}/`}>
        <div className="relative">
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-52 h-52 object-cover"
          />
          <div className="absolute top-0 left-[90%]">
            <FavoriteIcon className="text-red-500 hover:text-red-600 cursor-pointer" />
          </div>
        </div>
      </Link>
      
      <div>
        <div className="inline-block">
          <span className="px-2.5 py-2 bg-[rgb(178,6,6)] text-white text-sm font-medium">
            up to {product.dpercentage}% Off
          </span>
        </div>
        <div className="mt-2.5">
          <h3 className="text-sm">
            {product.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default DiscountProducts;
