// ------------------------------------

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Gift, Users, Calendar, Camera,  Menu, X, Filter, Search,Eye, ShoppingCart, RotateCcw, ZoomIn, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { MenuItem } from '../types';
import Header from '../components/Layout/Header';
import FilterBar from '../components/Features/FilterBar';
import MenuItemCard from '../components/Features/MenuItemCard';
import CallWaiter from '../components/Features/CallWaiter';
import LoyaltyProgram from '../components/Features/LoyaltyProgram';
import toast from 'react-hot-toast';


// Declare model-viewer element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const MenuPage: React.FC = () => {
  const { menuItems, loading } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'veg' | 'non-veg' | 'vegan'>('all');
  const [showCallWaiter, setShowCallWaiter] = useState(false);
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);
  const [selectedARItem, setSelectedARItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<MenuItem[]>([]);


  // Mobile-specific states
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // AR Viewer specific states
  const [isARLoading, setIsARLoading] = useState(true);
  const [arError, setArError] = useState(false);
  const [showARInfo, setShowARInfo] = useState(false);
  const [current, setCurrent] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const cards = [
    {
      type:"img",
      title: "Easy Dinner Offer Upto 50%",
      description: "Buy 1 Get 1 on Mocktails",
      img:"/logo.72441b04.svg",
      url: "https://www.eazydiner.com/delhi-ncr/matchis-resto-bar-city-centre-mall-dwarka-692750?utm_source=Android%20App&utm_campaign=Restaurant%20Detail%20Share&utm_medium=Restaurant%20Detail%20Referral",
    },
    {
      type:"img",
      title: "Special Weekend Offer!",
      description: "Flat 30% off on total bill",
      img:"/dish/images/Zomato_Logo.svg.png",
      url: "https://www.zomato.com/ncr/matchis-resto-bar-rohini-new-delhi",
    },
    {
      type:"img",
      title: "Happy Hours Deal!",
      description: "Buy 1 Get 1 on Mocktails",
      img:"/dish/images/Swiggy_Logo.svg.png",
      url: "https://www.swiggy.com/restaurants/matchis-resto-bar-city-centre-mall-rohini-delhi-786927/dineout?is_retargeting=true&media_source=GoogleReserve&utm_campaign=GoogleMap&utm_source=GoogleReserve",
    },
  ];

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load Google Model Viewer script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Prevent body scroll when AR viewer is open
  useEffect(() => {
    if (showARViewer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showARViewer]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 0); // 300ms delay
  
    return () => {
      clearTimeout(handler); // Cleanup if user keeps typing
    };
  }, [searchQuery]);

  const categories = useMemo(() => {
    const cats = [...new Set(menuItems.map(item => item.category))];
    return cats;
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    let items = menuItems;

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }

    if (activeFilter !== 'all') {
      items = items.filter(item => item.dietary_type === activeFilter);
    }

    return items;
  }, [menuItems, searchQuery, activeCategory, activeFilter]);

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => [...prev, item]);
    toast.success(`${item.name} added to order!`);
  };

  const handleViewInAR = (item: MenuItem) => {
    setSelectedARItem(item);
    setShowARViewer(true);
    setIsARLoading(true);
    setArError(false);
    toast.success('Loading AR view...');
  };

  const handleCloseAR = () => {
    setShowARViewer(false);
    setSelectedARItem(null);
    setIsARLoading(true);
    setArError(false);
    setShowARInfo(false);
  };
  const nextCard = () => {
    setCurrent((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrent((prev) => (prev - 1 + cards.length) % cards.length);
  };


  // Get 3D model URL from public/models folder based on item data
  const getModelUrl = (item: MenuItem) => {
    // First, check if the item has a specific model path
    if (item.modelPath) {
      return `/models/${item.modelPath}`;
    }

    // Fallback to mapping based on item name or category
    const itemNameLower = item.name.toLowerCase();
    const categoryLower = item.category.toLowerCase();

    // Define model mappings for different food items
    const modelMappings: { [key: string]: string } = {
      // Burgers
      'burger': 'burgers/classic-burger.glb',
      'cheeseburger': 'burgers/cheeseburger.glb',
      'veggie burger': 'burgers/veggie-burger.glb',

      // Pizza
      'pizza': 'pizza/margherita.glb',
      'margherita': 'pizza/margherita.glb',
      'pepperoni': 'pizza/pepperoni.glb',
      'hawaiian': 'pizza/hawaiian.glb',

      // Drinks
      'coffee': 'drinks/coffee-cup.glb',
      'latte': 'drinks/latte.glb',
      'cappuccino': 'drinks/cappuccino.glb',
      'tea': 'drinks/tea-cup.glb',
      'juice': 'drinks/juice-glass.glb',
      'smoothie': 'drinks/smoothie.glb',

      // Desserts
      'cake': 'desserts/chocolate-cake.glb',
      'chocolate cake': 'desserts/chocolate-cake.glb',
      'cheesecake': 'desserts/cheesecake.glb',
      'ice cream': 'desserts/ice-cream.glb',
      'tiramisu': 'desserts/tiramisu.glb',

      // Pasta
      'pasta': 'pasta/spaghetti.glb',
      'spaghetti': 'pasta/spaghetti.glb',
      'lasagna': 'pasta/lasagna.glb',
      'carbonara': 'pasta/carbonara.glb',

      // Salads
      'salad': 'salads/garden-salad.glb',
      'caesar': 'salads/caesar-salad.glb',
      'greek salad': 'salads/greek-salad.glb',

      // Appetizers
      'nachos': 'appetizers/nachos.glb',
      'wings': 'appetizers/chicken-wings.glb',
      'fries': 'appetizers/french-fries.glb',
      'onion rings': 'appetizers/onion-rings.glb',

      // Main Courses
      'steak': 'mains/grilled-steak.glb',
      'chicken': 'mains/grilled-chicken.glb',
      'fish': 'mains/grilled-fish.glb',
      'salmon': 'mains/salmon.glb',
      'lamb': 'mains/lamb-chops.glb',

      // Sandwiches
      'sandwich': 'sandwiches/club-sandwich.glb',
      'club sandwich': 'sandwiches/club-sandwich.glb',
      'panini': 'sandwiches/panini.glb',
      'wrap': 'sandwiches/wrap.glb',

      // Breakfast
      'pancakes': 'breakfast/pancakes.glb',
      'waffle': 'breakfast/waffle.glb',
      'eggs': 'breakfast/scrambled-eggs.glb',
      'toast': 'breakfast/avocado-toast.glb',

      // Default fallback
      'default': 'general/default-dish.glb'
    };

    // Try to match by specific item name first
    for (const [key, modelPath] of Object.entries(modelMappings)) {
      if (itemNameLower.includes(key)) {
        return `/models/${modelPath}`;
      }
    }

    // Try to match by category
    const categoryMappings: { [key: string]: string } = {
      'appetizers': 'appetizers/mixed-platter.glb',
      'mains': 'mains/mixed-grill.glb',
      'desserts': 'desserts/dessert-platter.glb',
      'drinks': 'drinks/beverage-glass.glb',
      'salads': 'salads/fresh-salad.glb',
      'pizza': '/Users/himanshurawat/Downloads/project/public/dish1.glb',
      'pasta': '/Users/himanshurawat/Downloads/project/public/dish1.glb',
      'burgers': '/Users/himanshurawat/Downloads/project/public/dish1.glb',
      'sandwiches': '/Users/himanshurawat/Downloads/project/public/dish1.glb',
      'breakfast': '/Users/himanshurawat/Downloads/project/public/dish1.glb'
    };

    if (categoryMappings[categoryLower]) {
      return `/models/${categoryMappings[categoryLower]}`;
    }

    // Final fallback
    return `/models/${modelMappings.default}`;
  };

  const handleARModelLoad = () => {
    setIsARLoading(false);
    setArError(false);
  };

  const handleARModelError = () => {
    setIsARLoading(false);
    setArError(true);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Mobile Header Component
  const MobileHeader: React.FC = () => (
    <div className="md:hidden sticky top-0 z-50 bg-white shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg bg-gray-100"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
          <h1 className="text-lg font-bold text-gray-900">Matchis Restaurant</h1>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileFilters(true)}
            className="p-2 rounded-lg bg-gray-100"
          >
            <Filter className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileCart(true)}
            className="relative p-2 rounded-lg bg-blue-600 text-white"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </motion.button>
        </div>
      </div>

     {/* Mobile Search Bar */}
<div className="px-4 pb-4">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Search dishes..."
      value={debouncedSearch}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>
      {/* Category Filter (Horizontal Scroll) */}
    <div className="px-4 pb-4 overflow-x-auto no-scrollbar">
      <div className="flex space-x-2">
        {['all', ...categories].map((category) => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === category
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Recommended' : category}
          </motion.button>
        ))}
      </div>
    </div>
      
    </div>
  );

  // Mobile Menu Overlay
  const MobileMenuOverlay: React.FC = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="md:hidden fixed inset-0 z-50 bg-black/50"
      onClick={() => setShowMobileMenu(false)}
    >
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        className="bg-white h-full w-80 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Menu Options</h2>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.open("https://share.google/2Dr57UE7kv9FyET04", "_blank");
              setShowMobileMenu(false);
            }}
            className="w-full bg-blue-50 text-blue-600 p-4 rounded-xl flex items-center space-x-3 hover:bg-blue-100 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Google Review</span>
          </motion.button>


          {/* <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              
              setShowMobileMenu(false);
            }}
            className="w-full bg-blue-50 text-blue-600 p-4 rounded-xl flex items-center space-x-3 hover:bg-blue-100 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Give Feedback</span>
          </motion.button> */}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowCallWaiter(true);
              setShowMobileMenu(false);
            }}
            className="w-full bg-purple-50 text-purple-600 p-4 rounded-xl flex items-center space-x-3 hover:bg-purple-100 transition-colors"
          >
            <Gift className="w-5 h-5" />
            <span className="font-medium">Loyalty Rewards</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-pink-50 text-pink-600 p-4 rounded-xl flex items-center space-x-3 hover:bg-pink-100 transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span className="font-medium">Ambience View</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Mobile Filters Modal
  const MobileFiltersModal: React.FC = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="md:hidden fixed inset-0 z-50 bg-black/50"
      onClick={() => setShowMobileFilters(false)}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white rounded-t-3xl absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            {/* <h3 className="font-semibold mb-3">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {['all', ...categories].map((category) => (
                <motion.button
                  key={category}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category)}
                  className={`p-3 rounded-xl text-sm font-medium transition-colors ${activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category === 'all' ? 'All Items' : category}
                </motion.button>
              ))}
            </div> */}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Dietary Type</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Types' },
                { value: 'veg', label: 'Vegetarian' },
                { value: 'non-veg', label: 'Non-Vegetarian' },
                { value: 'vegan', label: 'Vegan' }
              ].map((filter) => (
                <motion.button
                  key={filter.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.value as any)}
                  className={`w-full p-3 rounded-xl text-left font-medium transition-colors ${activeFilter === filter.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileFilters(false)}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold"
          >
            Apply Filters
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Mobile Cart Modal
  const MobileCartModal: React.FC = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="md:hidden fixed inset-0 z-50 bg-black/50"
      onClick={() => setShowMobileCart(false)}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white rounded-t-3xl absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Order ({cart.length})</h2>
            <button
              onClick={() => setShowMobileCart(false)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-blue-600 font-bold">Rs. {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-blue-600">Rs. {cartTotal.toFixed(2)}</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-green-600 text-white p-4 rounded-xl font-semibold"
                >
                  Place Order
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  // Enhanced MenuItemCard with mobile optimizations
  const MobileOptimizedMenuItemCard: React.FC<{
    item: MenuItem;
    onAddToCart: (item: MenuItem) => void;
    onViewInAR: (item: MenuItem) => void;
    index: number;
  }> = ({ item, onAddToCart, onViewInAR, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2"
      >
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-40 md:h-48 object-cover"
          />
          <div className="absolute top-3 right-3 flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onViewInAR(item)}
              className="bg-white/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-all"
              title="View in AR"
            >
              {/* <Camera className="w-3 h-3 md:w-4 md:h-4" /> */}
              <img
      src="/7112734.webp" // replace with your actual filename in /public
      alt="AR Icon"
      className="w-4 h-4 "
    />
            </motion.button>
            <div className="bg-black/50 backdrop-blur-md text-white px-2 py-2 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
              Rs. {item.price}
            </div>
          </div>
          {item.isPopular && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold">
              Popular
            </div>
          )}
        </div>

        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <h3 className="font-bold text-lg md:text-xl text-gray-900 leading-tight">{item.name}</h3>
            <div className="flex items-center space-x-1 ml-2">
              <span className="text-yellow-400">★</span>
              <span className="text-xs md:text-sm text-gray-600">{item.rating}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-3 md:mb-4 line-clamp-2 text-sm md:text-base">{item.description}</p>

          <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
            {item.tags.slice(0, isMobile ? 2 : item.tags.length).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {isMobile && item.tags.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                +{item.tags.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${item.dietary_type === 'veg' ? 'bg-green-500' :
                  item.dietary_type === 'vegan' ? 'bg-green-600' :
                    'bg-red-500'
                }`}></span>
              <span className="text-xs md:text-sm text-gray-600 capitalize">{item.dietary_type}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddToCart(item)}
              className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-xl text-sm md:text-base font-semibold hover:bg-blue-700 transition-colors"
            >
              Add to Order
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Integrated AR Viewer Component
  const ARViewerModal: React.FC = () => {
    if (!selectedARItem) return null;

    const modelPath = getModelUrl(selectedARItem);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseAR}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  {/* <Camera className="w-6 h-6 text-purple-600" /> */}
                  <img
      src="/7112734.webp" // replace with your actual filename in /public
      alt="AR Icon"
      className="w-6 h-6"
    />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedARItem.name}</h2>
                  <p className="text-gray-600">AR View Experience</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowARInfo(!showARInfo)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Info className="w-5 h-5 text-gray-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseAR}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* AR Viewer Container */}
            <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100">
              {isARLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading 3D model...</p>
                  </div>
                </div>
              )}

              {arError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load 3D model</h3>
                    <p className="text-gray-600 mb-4">The AR experience is temporarily unavailable for this item.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCloseAR}
                      className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              )}

              {!arError && (
                <model-viewer
                  src={modelPath}
                  alt={`3D model of ${selectedARItem.name}`}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  touch-action="pan-y"
                  auto-rotate
                  auto-rotate-delay="3000"
                  rotation-per-second="30deg"
                  environment-image="neutral"
                  exposure="1"
                  shadow-intensity="1"
                  shadow-softness="0.5"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent'
                  }}
                  onLoad={handleARModelLoad}
                  onError={handleARModelError}
                >
                  {/* AR Button */}
                  <button
                    slot="ar-button"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    {/* <Camera className="w-5 h-5" /> */}
                    <img
      src="/7112734.webp" // replace with your actual filename in /public
      alt="AR Icon"
      className="w-5 h-5"
    />
                    <span>View in AR</span>
                  </button>

                  {/* Loading indicator */}
                  <div slot="poster" className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Loading 3D model...</p>
                    </div>
                  </div>
                </model-viewer>
              )}

              {/* Control Instructions */}
              {!isARLoading && !arError && (
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white p-3 rounded-xl">
                  <p className="text-sm font-medium mb-2">Controls:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="w-3 h-3" />
                      <span>Drag to rotate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ZoomIn className="w-3 h-3" />
                      <span>Scroll to zoom</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Item Information */}
            <AnimatePresence>
              {showARInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 mb-4">{selectedARItem.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedARItem.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-900">Price</span>
                            <span className="text-2xl font-bold text-purple-600">${selectedARItem.price}</span>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-600">Rating</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="font-medium">{selectedARItem.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600">Type</span>
                            <div className="flex items-center space-x-2">
                              <span className={`w-3 h-3 rounded-full ${selectedARItem.dietary_type === 'veg' ? 'bg-green-500' :
                                  selectedARItem.dietary_type === 'vegan' ? 'bg-green-600' :
                                    'bg-red-500'
                                }`}></span>
                              <span className="capitalize font-medium">{selectedARItem.dietary_type}</span>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAddToCart(selectedARItem)}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-colors"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Add to Order</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header onSearch={setSearchQuery} searchQuery={debouncedSearch} />
      </div>

      {/* Mobile Header */}
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
         

        {/* Hero Section - Responsive */}
        <div className="overflow-hidden">
        <AnimatePresence mode="wait">
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="relative bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 md:mb-8 text-white flex flex-col items-center overflow-hidden"
          >
            {/* Arrow Left */}
      <button
        onClick={prevCard}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all md:left-4 z-10"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Arrow Right */}
      <button
        onClick={nextCard}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all md:right-4 z-10"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
  <img
    src={cards[current].img}
    alt="Zomato Logo"
    className="w-32 h-auto  -top-10 bg-white rounded-md p-4 shadow-md"/>
    <div className="h-7" />
      {/* Card Content */}
      {/* <Gift className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4" /> */}
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">
        {cards[current].title}
      </h2>
      <p className="text-orange-100 mb-4 text-sm md:text-base text-center">
        {cards[current].description}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open(cards[current].url, "_blank")}
        className="bg-white text-orange-600 px-6 py-3 md:px-8 md:py-3 rounded-xl font-semibold hover:shadow-lg transition-all block mx-auto"
      >
        Claim Offer
      </motion.button> 
      

          {/* Zomato Logo at Top Center */}
          {/* <img
            src="public/Zomato_Logo.svg.png"
            alt="Zomato Logo"
            className="w-32 h-auto  -top-10 bg-white rounded-md p-4 shadow-md"
            style={{ transform: "translateY(-50%)", top: 0 }}

          /> */}

          {/* Space added for logo to not overlap */}
          {/* <div className="h-7" /> */}

          {/* <Gift className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4" /> */}
          
          {/* <h2 className="text-xl md:text-2xl font-bold mb-2">Special Weekend Offer!</h2>
          <p className="text-orange-100 mb-4 text-sm md:text-base">
            Flat 30% off on total bill
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.open("https://www.zomato.com/ncr/matchis-resto-bar-rohini-new-delhi", "_blank");
            }}
            className="bg-white text-orange-600 px-6 py-3 md:px-8 md:py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Claim Offer
          </motion.button> */}

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCallWaiter(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
            >
              <Users className="w-5 h-5" />
              <span>Call Waiter</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoyalty(true)}
              className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-white/30 transition-all"
            >
              <Gift className="w-5 h-5" />
              <span>Loyalty Rewards</span>
            </motion.button>
          </div>
          {/* </div> */}
          
        </motion.div>
        </AnimatePresence>
        </div>
        
        {/* AR Feature Highlight - Responsive */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 text-white"
        >
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="bg-white/20 p-2 md:p-3 rounded-full flex-shrink-0">
            <img
      src="/7112734.webp" // replace with your actual filename in /public
      alt="AR Icon"
      className="w-5 h-5"
    />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold">View Dishes in Augmented Reality</h3>
              <p className="text-purple-100 text-sm md:text-base">
                {isMobile ? 'Tap camera icon on dishes' : 'See how your food looks before ordering! Tap the camera icon on any dish.'}
              </p>
            </div>
          </div>
        </motion.div> 

        {/* Desktop Filters */}
        <div className="hidden md:block">
          <FilterBar
            activeCategory={activeCategory}
            activeFilter={activeFilter}
            onCategoryChange={setActiveCategory}
            onFilterChange={setActiveFilter}
            categories={categories}
          />
        </div>

        {/* Menu Items Grid */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Utensils className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {activeCategory === 'all' ? 'Recommended' : activeCategory}
              </h2>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                {filteredItems.length}
              </span>
            </div>

            {/* Desktop Cart Summary */}
            {cart.length > 0 && !isMobile && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
              >
                <span className="font-medium">{cart.length} items in order</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                  ${cartTotal.toFixed(2)}
                </span>
              </motion.div>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 md:py-16"
            >
              <Calendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 text-sm md:text-base">Try adjusting your filters or search terms</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {filteredItems.map((item, index) => (
                <MobileOptimizedMenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onViewInAR={handleViewInAR}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Special Offers Section - Responsive */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white text-center"
        >
          <Gift className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4" />
          <h2 className="text-xl md:text-2xl font-bold mb-2">Special Weekend Offer!</h2>
          <p className="text-orange-100 mb-4 text-sm md:text-base">
            Get 20% off on orders above $50. Valid this weekend only!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-orange-600 px-6 py-3 md:px-8 md:py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Claim Offer
          </motion.button>
        </motion.div> */}
      </main>

      {/* Mobile Overlays */}
      {showMobileMenu && <MobileMenuOverlay />}
      {showMobileFilters && <MobileFiltersModal />}
      {showMobileCart && <MobileCartModal />}

      {/* AR Viewer Modal */}
      {showARViewer && <ARViewerModal />}

      {/* Other Modals */}
      {showCallWaiter && (
        <CallWaiter onClose={() => setShowCallWaiter(false)} />
      )}

      {showLoyalty && (
        <LoyaltyProgram onClose={() => setShowLoyalty(false)} />
      )}
    </div>
  );
};

export default MenuPage;