import React,{useState,useEffect} from 'react'
import ProductDetailPage from './ProductDetailPage'

const Product = () => {
 const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product from API
    const sampleProduct = {
      id: 101,
      name: "Nike Air Zoom Pegasus 40",
      description: "A lightweight running shoe built for comfort and speed.",
      price: 8999.0,
      discount_percent: 10.0,
      category: "Shoes",
      brand: "Nike",
      stock: 25,
      rating: 4.6,
      reviews_count: 152,
      tags: ["running", "men", "sports", "lightweight"],
      color: "Blue",
      size: "10",
      weight: 0.75,
      dimensions: { length: 30, width: 20, height: 10 },
      image_url: "https://example.com/images/pegasus40.jpg",
      images: [
        "https://example.com/images/pegasus40-1.jpg",
        "https://example.com/images/pegasus40-2.jpg"
      ],
      is_active: true
    };
    
    setProduct(sampleProduct);
  }, []);

  if (!product) return <div>Loading...</div>;

  return <ProductDetailPage product={product} />;
}

export default Product