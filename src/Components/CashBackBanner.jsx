import React from 'react';

const CashBackBanner = () => {
  const handleLearnMore = () => {
    // Add your navigation or modal logic here
    console.log('Learn More clicked');
    // Or navigate: window.location.href = '/offers';
  };

  return (
    <div className="w-full h-96 flex justify-center items-center mt-12 bg-[#ffe6cc]">
      <div className="text-center text-[#212224]">
        <h1 className="text-5xl font-bold">
          Get 25% Cash Back
        </h1>
        <p className="text-xl my-5">
          On Your First Order
        </p>
        <button 
          onClick={handleLearnMore}
          className="bg-[#003d29] text-white px-8 py-4 text-2xl rounded-full border-none hover:bg-[#010c09] cursor-pointer transition-colors duration-200"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default CashBackBanner;
