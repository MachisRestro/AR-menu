import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Leaf, Coffee, Utensils, Cookie } from 'lucide-react';

interface FilterBarProps {
  activeCategory: string;
  activeFilter: 'all' | 'veg' | 'non-veg' | 'vegan';
  onCategoryChange: (category: string) => void;
  onFilterChange: (filter: 'all' | 'veg' | 'non-veg' | 'vegan') => void;
  categories: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  activeFilter,
  onCategoryChange,
  onFilterChange,
  categories,
}) => {
  const filters = [
    { id: 'all', label: 'All', icon: Utensils },
    { id: 'veg', label: 'Vegetarian', icon: Leaf },
    { id: 'non-veg', label: 'Non-Veg', icon: Coffee },
    { id: 'vegan', label: 'Vegan', icon: Cookie },
  ];

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Appetizer': '🥗',
      'Main Course': '🍽️',
      'Dessert': '🍰',
      'Beverages': '🥤',
      'Specials': '⭐',
    };
    return icons[category] || '🍴';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Dietary Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Dietary Preferences</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFilterChange(filter.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{filter.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
              activeCategory === 'all'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <span>🌟</span>
            <span className="font-medium">All Items</span>
          </motion.button>
          
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                activeCategory === category
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              <span className="font-medium">{category}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;