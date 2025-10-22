import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    'https://images-eu.ssl-images-amazon.com/images/G/31/img23/boat/Enigma/upGW_tallhero_1500x600._CB578180206_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img22/WLA/Launches23/Realme_T300_revision/D95787821-_DesktopTallHero_3000x1200._CB577898096_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Beauty/GW/MFD_GW_PC-1-2zv._CB577804219_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img21/VGSW/2023/Q3/Hero_1500x600_PS5._CB596419683_.jpg',
    'https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/OnePlus/Nord/NordCE2Lite/22Sept/D42850095_WLD_OnePlus_OSCAR_NewLaunch_DesktopHero_3000x1200._CB578813241_.jpg'
  ];

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
      {/* Carousel Images */}
      <div className="relative w-full h-full">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
