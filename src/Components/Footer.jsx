import React from 'react';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  const onlineShopping = [
    { name: 'Men', link: '/men' },
    { name: 'Women', link: '/women' },
    { name: 'Kids', link: '/kids' },
    { name: 'Home', link: '/home' },
    { name: 'Beauty', link: '/beauty' },
    { name: 'Genz', link: '/genz' },
    { name: 'Gift Cards', link: '/gift-cards' },
    { name: 'Myntra Insider', link: '/insider' }
  ];

  const customerPolicies = [
    { name: 'Contact Us', link: '/contact' },
    { name: 'FAQ', link: '/faq' },
    { name: 'T&C', link: '/terms' },
    { name: 'Terms Of Use', link: '/terms-of-use' },
    { name: 'Track Orders', link: '/track' },
    { name: 'Shipping', link: '/shipping' },
    { name: 'Cancellation', link: '/cancellation' },
    { name: 'Returns', link: '/returns' },
    { name: 'Privacy policy', link: '/privacy' },
    { name: 'Grievance Redressal', link: '/grievance' }
  ];

  const usefulLinks = [
    { name: 'Blog', link: '/blog' },
    { name: 'Careers', link: '/careers' },
    { name: 'Site Map', link: '/sitemap' },
    { name: 'Corporate Information', link: '/corporate' },
    { name: 'Whitehat', link: '/whitehat' },
    { name: 'Cleartrip', link: '/cleartrip' },
    { name: 'Myntra Global', link: '/global' }
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Online Shopping Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">
              Online Shopping
            </h3>
            <ul className="space-y-2">
              {onlineShopping.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Policies Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">
              Customer Policies
            </h3>
            <ul className="space-y-2">
              {customerPolicies.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            
          </div>

          {/* Experience App Column */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">
              Experience Myntra App on Mobile
            </h3>
            <div className="flex flex-col gap-3 mb-6">
              <a href="#" className="block">
                <img
                  src="https://constant.myntassets.com/web/assets/img/80cc455a-92d2-4b5c-a038-7da0d92af33f1539674178924-google_play.png"
                  alt="Get it on Google Play"
                  className="h-10 w-auto"
                />
              </a>
              <a href="#" className="block">
                <img
                  src="https://constant.myntassets.com/web/assets/img/bc5e11ad-0250-420a-ac71-115a57ca35d51539674178941-apple_store.png"
                  alt="Download on the App Store"
                  className="h-10 w-auto"
                />
              </a>
            </div>

            {/* Keep in Touch */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">
                Keep in Touch
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Guarantees Column */}
          <div>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-12 h-12 flex-shrink-0">
                <svg className="w-full h-full text-gray-700" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M24 4L4 14v10c0 12.15 8.61 23.5 20 26 11.39-2.5 20-13.85 20-26V14L24 4zm0 6.18l16 8.91v7.41c0 9.83-6.74 19.03-16 21.5-9.26-2.47-16-11.67-16-21.5v-7.41l16-8.91z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  100% ORIGINAL
                </h4>
                <p className="text-xs text-gray-600">
                  guarantee for all products at myntra.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 flex-shrink-0">
                <svg className="w-full h-full text-gray-700" viewBox="0 0 48 48" fill="currentColor">
                  <rect x="8" y="16" width="32" height="4" rx="2"/>
                  <path d="M10 12h28a2 2 0 012 2v20a2 2 0 01-2 2H10a2 2 0 01-2-2V14a2 2 0 012-2z"/>
                  <text x="24" y="30" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">14</text>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  Return within 14days
                </h4>
                <p className="text-xs text-gray-600">
                  of receiving your order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-gray-600 text-center">
            © 2025 www.myntra.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
