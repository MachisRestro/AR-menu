import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Eye, 
  Star, 
  Clock, 
  Flame, 
  Leaf, 
  ShoppingCart,
  Info,
  Heart,
  Share2
} from 'lucide-react';
import { MenuItem } from '../../types';
import { useARSupport, trackARUsage, ARMessages } from '../../utils/arUtils';
import toast from 'react-hot-toast';
import NutritionalInfo from './NutritionalInfo';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onViewInAR: (item: MenuItem) => void;
  index: number;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onViewInAR,
  index
}) => {
  const { isARSupported } = useARSupport();
  const [isLiked, setIsLiked] = useState(false);
  const [showNutrition, setShowNutrition] = useState(true);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleARClick = () => {
    if (!isARSupported) {
      toast.error(ARMessages.notSupported);
      return;
    }
    
    trackARUsage('ar_button_click', item.name, navigator.userAgent);
    onViewInAR(item);
  };

  const handleQuickView = () => {
    setShowQuickView(!showQuickView);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: item.description,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const getDietaryIcon = () => {
    switch (item.dietary_type) {
      case 'veg':
        return <Leaf className="w-3 h-3 text-green-600" />;
      case 'vegan':
        return <Leaf className="w-3 h-3 text-green-700" />;
      default:
        return <Flame className="w-3 h-3 text-red-600" />;
    }
  };

  const getDietaryColor = () => {
    switch (item.dietary_type) {
      case 'veg':
        return 'border-green-500 bg-green-50';
      case 'vegan':
        return 'border-green-600 bg-green-50';
      default:
        return 'border-red-500 bg-red-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Image Container with Overlay Actions */}
      <div className="relative overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          whileHover={{ scale: 1.05 }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white transition-all"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Bottom Action Buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickView}
            className="bg-white/90 backdrop-blur-md text-gray-700 p-2 rounded-full hover:bg-white transition-all"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          
          {isARSupported && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleARClick}
              className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all shadow-lg"
              title="View in AR"
            >
              {/* <Camera className="w-4 h-4" /> */}
              <img
      src="public/7112734.webp" // replace with your actual filename in /public
      alt="AR Icon"
      className="w-3 h-3"
    />
            </motion.button>
          )}
        </div>

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {item.isPopular && (
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Popular</span>
            </div>
          )}
          
          {item.isNew && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              New
            </div>
          )}
          
          {item.isSpicy && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Flame className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full font-bold text-lg">
           Rs.+ {item.price}
          </div>
        </div>

        {/* AR Support Indicator */}
        {isARSupported && (
          <div className="absolute top-4 right-16 bg-purple-600 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            {/* <Camera className="w-3 h-3" /> */}
            <img
      src="public/7112734.webp" // replace with your actual filename in /public
      alt="AR Icon"
      className="w-3 h-3"
    />
            <span>AR</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-gray-900 truncate">{item.name}</h3>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 font-medium">{item.rating}</span>
              </div>
              
              {item.prepTime && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{item.prepTime}min</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border-2 ${getDietaryColor()}`}>
            {getDietaryIcon()}
            <span className="text-xs font-medium capitalize">{item.dietary_type}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {item.description}
        </p>
       
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-gray-400 text-xs">+{item.tags.length - 3} more</span>
          )}
        </div>


     {/* Modals */}
      {showNutrition && (
        <NutritionalInfo
          item={item}
          onClose={() => setShowNutrition(true)}
        />
      )}
         {/* Nutritional Info Preview */}
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center space-x-4 text-sm text-gray-600">
               <span>{item.nutritional_info.calories} cal</span>
               <span>{item.nutritional_info.protein}g protein</span>
            </div>
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowNutrition(true)}
               className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
             >
               <Info className="w-4 h-4" />
               <span>Nutrition</span>
             </motion.button>
           </div>
    
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToCart(item)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Order</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickView}
            className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Info className="w-4 h-4" />
          </motion.button>
        </div>


        {/* Quick View Details */}
        <motion.div
          initial={false}
          animate={{ height: showQuickView ? 'auto' : 0, opacity: showQuickView ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Calories:</span>
                <span className="font-medium ml-2">{item.calories || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Protein:</span>
                <span className="font-medium ml-2">{item.protein || 'N/A'}g</span>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="font-medium ml-2 capitalize">{item.category}</span>
              </div>
              <div>
                <span className="text-gray-500">Prep Time:</span>
                <span className="font-medium ml-2">{item.prepTime || 'N/A'}min</span>
              </div>
            </div>

            
            {item.allergens && item.allergens.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-500 text-sm">Allergens:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.allergens.map((allergen, idx) => (
                    <span
                      key={idx}
                      className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;