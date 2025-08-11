import React from 'react';
import { motion } from 'framer-motion';
import { X, Palette, Check } from 'lucide-react';
import { useRestaurant } from '../../contexts/RestaurantContext';

interface ThemeSelectorProps {
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onClose }) => {
  const { theme, setTheme } = useRestaurant();

  const themes = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and minimalist design',
      colors: ['#1E40AF', '#059669', '#DC2626'],
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and elegant',
      colors: ['#7C2D12', '#CA8A04', '#166534'],
    },
    {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated and premium',
      colors: ['#581C87', '#BE185D', '#0F172A'],
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      description: 'Colorful and energetic',
      colors: ['#DC2626', '#EA580C', '#7C3AED'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Theme Selection</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Choose your preferred theme</p>
        </div>

        {/* Theme Options */}
        <div className="p-6 space-y-4">
          {themes.map((themeOption) => (
            <motion.div
              key={themeOption.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                theme === themeOption.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTheme(themeOption.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{themeOption.name}</h3>
                    {theme === themeOption.id && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{themeOption.description}</p>
                  
                  {/* Color Preview */}
                  <div className="flex space-x-2">
                    {themeOption.colors.map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-600 text-center">
            Theme changes are applied instantly and saved automatically
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSelector;