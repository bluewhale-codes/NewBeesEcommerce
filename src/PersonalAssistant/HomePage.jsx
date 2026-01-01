import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  PlayCircleIcon, 
  ShieldCheckIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <>
      {/* Full screen background with gradient overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black-900/50 to-blue-900/70" />
        <img 
          src="https://media.istockphoto.com/id/1646708089/photo/business-chatting-a-smart-ai-using-an-artificial-intelligence-chatbot-developed-with-ai-robot.jpg?s=612x612&w=0&k=20&c=vjfW6FbZG4wSTxwil78FFW10UIg4UHxuqPGR4AtE8mA=" 
          alt="AI Neural Network Background" 
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Floating particles - mobile optimized */}
      <div className="fixed inset-0 z-5 pointer-events-none hidden sm:block">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce [animation-delay:1s]" />
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-full animate-pulse [animation-delay:0.5s]" />
      </div>

      {/* Main content - shorter & narrower */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center text-white py-12 max-w-md sm:max-w-lg mx-auto">
        
        {/* Profile section - compact */}
        <div className="mb-6 sm:mb-8 flex flex-col items-center">
          <div className="relative">
            <img 
              src="https://res.cloudinary.com/dycjjaxsk/image/upload/v1761127039/products/aymupxrotvirulwrvbfv.png" 
              alt="Vishal Shakya" 
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-white/20 shadow-2xl ring-4 ring-white/10 hover:scale-105 transition-all duration-500"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-white/50">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-ping" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xs sm:text-sm text-blue-100 font-medium opacity-80 tracking-wide">
              Vishal Shakya [memory:1]
            </p>
            <p className="text-xs text-white/60">MCA | Panjab University</p>
          </div>
        </div>

        {/* Compact heading */}
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex items-center px-2.5 sm:px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full mb-3 sm:mb-4 border border-white/20">
            <SparklesIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-blue-300 flex-shrink-0" />
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Personal AI Assistant</span>
          </div>
          <h1 className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
            Vishal AI
          </h1>
        </div>

        {/* Shorter subheading */}
        <div className="mb-8 sm:mb-12 max-w-xs sm:max-w-sm">
          <p className="text-sm sm:text-base md:text-lg font-light leading-relaxed opacity-95 mb-3 px-1">
            Advanced AI for <span className="font-semibold text-blue-300">smart conversations</span> 
            & real-time assistance.
          </p>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            Privacy first • Lightning fast
          </p>
        </div>

        {/* Compact features - 2 columns only */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-10 sm:mb-12 w-full max-w-xs sm:max-w-sm px-1">
          <div className="flex flex-col items-center p-2.5 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <PlayCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mb-1 flex-shrink-0" />
            <span className="text-xs font-semibold text-white leading-tight">Live Chat</span>
          </div>
          <div className="flex flex-col items-center p-2.5 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mb-1 flex-shrink-0" />
            <span className="text-xs font-semibold text-white leading-tight">Private</span>
          </div>
          <div className="flex flex-col items-center p-2.5 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-1 flex-shrink-0" />
            <span className="text-xs font-semibold text-white leading-tight">Smart</span>
          </div>
          <div className="flex flex-col items-center p-2.5 sm:p-3 bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mb-1 flex-shrink-0" />
            <span className="text-xs font-semibold text-white leading-tight">24/7</span>
          </div>
        </div>

        {/* Compact CTA */}
        <div className="relative group">
  <Link
    to="/Assistant"
    className="relative flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-white via-blue-50/90 to-purple-50/90 text-gray-900 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 ring-2 sm:ring-4 ring-white/20 backdrop-blur-xl border border-white/30 hover:border-white/50 focus:outline-none focus:ring-4 focus:ring-blue-200/50 no-underline inline-flex"
    aria-label="Go to Assistant chat"
  >
    <span>🚀 Start Chat</span>
    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:animate-ping flex-shrink-0" />
  </Link>
  {/* Shine effect */}
  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-2 sm:-translate-x-3 group-hover:translate-x-2 sm:group-hover:translate-x-3 pointer-events-none" />
</div>

        {/* Compact scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1 opacity-60 hover:opacity-100 transition-opacity pointer-events-none sm:pointer-events-auto">
          <div className="w-4 h-7 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-0.5 h-2 bg-white rounded-full mt-1.5 animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
