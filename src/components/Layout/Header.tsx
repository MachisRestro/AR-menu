import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, Share2, QrCode, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import QRCodeGenerator from '../Features/QRCodeGenerator';
import ThemeSelector from '../Features/ThemeSelector';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery }) => {
  const { restaurant } = useRestaurant();
  const [showQR, setShowQR] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: restaurant?.name || 'Digital Menu',
        text: 'Check out our digital menu!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Restaurant Name */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {restaurant?.name || 'Premium Menu'}
                </h1>
                <p className="text-xs text-gray-500">Digital Experience</p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQR(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <QrCode className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeGenerator
          url={window.location.href}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <ThemeSelector onClose={() => setShowSettings(false)} />
      )}
    </>
  );
};

export default Header;