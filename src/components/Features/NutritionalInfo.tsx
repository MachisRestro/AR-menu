import React from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Zap } from 'lucide-react';
import { MenuItem } from '../../types';

interface NutritionalInfoProps {
  item: MenuItem;
  onClose: () => void;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ item, onClose }) => {
  const nutritionData = [
    { label: 'Calories', value: item.nutritional_info.calories, unit: 'kcal', color: 'bg-red-500' },
    { label: 'Protein', value: item.nutritional_info.protein, unit: 'g', color: 'bg-blue-500' },
    { label: 'Carbs', value: item.nutritional_info.carbs, unit: 'g', color: 'bg-yellow-500' },
    { label: 'Fat', value: item.nutritional_info.fat, unit: 'g', color: 'bg-purple-500' },
    { label: 'Fiber', value: item.nutritional_info.fiber, unit: 'g', color: 'bg-green-500' },
    { label: 'Sugar', value: item.nutritional_info.sugar, unit: 'g', color: 'bg-pink-500' },
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
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Nutritional Information</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">{item.name}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Calorie Highlight */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="w-6 h-6 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {item.nutritional_info.calories}
              </span>
              <span className="text-red-600 font-medium">calories</span>
            </div>
            <p className="text-center text-sm text-gray-600">per serving</p>
          </div>

          {/* Nutrition Grid */}
          <div className="grid grid-cols-2 gap-4">
            {nutritionData.slice(1).map((nutrient) => (
              <div key={nutrient.label} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${nutrient.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{nutrient.label}</span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-gray-900">{nutrient.value}</span>
                  <span className="text-sm text-gray-600">{nutrient.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Health Tips */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2">Health Benefits</h3>
            <ul className="text-sm text-green-700 space-y-1">
              {item.nutritional_info.protein > 20 && (
                <li>• High in protein for muscle building</li>
              )}
              {item.nutritional_info.fiber > 5 && (
                <li>• Good source of dietary fiber</li>
              )}
              {item.nutritional_info.calories < 400 && (
                <li>• Lower calorie option</li>
              )}
              {item.dietary_type === 'veg' && (
                <li>• Plant-based nutrition</li>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NutritionalInfo;