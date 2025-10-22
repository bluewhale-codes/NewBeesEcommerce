import React, { useState } from 'react';
import { Package, Lock, MapPin, Camera } from 'lucide-react';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: 'vishal shakya',
    email: 'vishalshakya2255@gmail.com',
    profileImage: 'https://via.placeholder.com/150', // Replace with actual image URL
  });

  const handleEditProfile = () => {
    // Handle edit profile logic
    console.log('Edit Profile clicked');
  };

  const profileSections = [
    {
      id: 1,
      icon: Package,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Your Orders',
      description: 'Track,return or buy thing Again',
      link: '/orders'
    },
    {
      id: 2,
      icon: Lock,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Login & security',
      description: 'Edit login,mobile no.,name',
      link: '/security'
    },
    {
      id: 3,
      icon: MapPin,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      title: 'Your Address',
      description: 'Edit Address for orders and gift',
      link: '/address'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                <img
                  src="https://res.cloudinary.com/dycjjaxsk/image/upload/v1707149964/Avatars/dru7oakwplnaw7poowtx.jpg"
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Camera Icon Overlay */}
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">
                {profileData.name}
              </h1>
              <p className="text-gray-600 mb-4">{profileData.email}</p>
              <button
                onClick={handleEditProfile}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <a
                key={section.id}
                href={section.link}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`${section.iconBgColor} p-3 rounded-full group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`w-6 h-6 ${section.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
