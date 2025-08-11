// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Restaurant, MenuItem } from '../types';
// import { supabase } from '../lib/supabase';

// interface RestaurantContextType {
//   restaurant: Restaurant | null;
//   menuItems: MenuItem[];
//   loading: boolean;
//   theme: string;
//   setTheme: (theme: string) => void;
//   refreshMenu: () => Promise<void>;
// }

// const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// export const useRestaurant = () => {
//   const context = useContext(RestaurantContext);
//   if (!context) {
//     throw new Error('useRestaurant must be used within a RestaurantProvider');
//   }
//   return context;
// };

// export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [theme, setThemeState] = useState('modern');

//   const setTheme = (newTheme: string) => {
//     setThemeState(newTheme);
//     localStorage.setItem('restaurant-theme', newTheme);
//   };

//   const refreshMenu = async () => {
//     if (!restaurant) return;
    
//     try {
//       const { data, error } = await supabase
//         .from('menu_items')
//         .select('*')
//         .eq('restaurant_id', restaurant.id)
//         .eq('is_available', true)
//         .order('category', { ascending: true });

//       if (error) throw error;
//       setMenuItems(data || []);
//     } catch (error) {
//       console.error('Error fetching menu items:', error);
//     }
//   };

//   useEffect(() => {
//     const loadRestaurant = async () => {
//       try {
//         // For demo purposes, we'll create a default restaurant
//         const defaultRestaurant: Restaurant = {
//           id: 'default-restaurant',
//           name: 'Premium Bistro',
//           theme: 'modern',
//           primary_color: '#1E40AF',
//           secondary_color: '#059669',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         };

//         setRestaurant(defaultRestaurant);
        
//         // Load sample menu items
//         const sampleMenuItems: MenuItem[] = [
//           {
//             id: '1',
//             restaurant_id: 'default-restaurant',
//             name: 'Truffle Pasta',
//             description: 'Handmade pasta with truffle oil, parmesan, and fresh herbs',
//             price: 28.99,
//             image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
//             category: 'Main Course',
//             dietary_type: 'veg',
//             nutritional_info: { calories: 650, protein: 18, carbs: 75, fat: 28, fiber: 4, sugar: 8 },
//             is_available: true,
//             is_featured: true,
//             tags: ['truffle', 'pasta', 'premium'],
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           },
//           {
//             id: '2',
//             restaurant_id: 'default-restaurant',
//             name: 'Grilled Salmon',
//             description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
//             price: 32.99,
//             image: 'https://images.pexels.com/photos/3563625/pexels-photo-3563625.jpeg',
//             category: 'Main Course',
//             dietary_type: 'non-veg',
//             nutritional_info: { calories: 520, protein: 45, carbs: 12, fat: 32, fiber: 6, sugar: 5 },
//             is_available: true,
//             is_featured: true,
//             tags: ['salmon', 'grilled', 'healthy'],
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           },
//           {
//             id: '3',
//             restaurant_id: 'default-restaurant',
//             name: 'Chocolate Soufflé',
//             description: 'Decadent dark chocolate soufflé with vanilla ice cream',
//             price: 14.99,
//             image: 'https://images.pexels.com/photos/5945757/pexels-photo-5945757.jpeg',
//             category: 'Dessert',
//             dietary_type: 'veg',
//             nutritional_info: { calories: 420, protein: 8, carbs: 52, fat: 18, fiber: 3, sugar: 45 },
//             is_available: true,
//             is_featured: false,
//             tags: ['chocolate', 'dessert', 'premium'],
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           },
//         ];

//         setMenuItems(sampleMenuItems);
//       } catch (error) {
//         console.error('Error loading restaurant:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadRestaurant();

//     // Load saved theme
//     const savedTheme = localStorage.getItem('restaurant-theme');
//     if (savedTheme) {
//       setThemeState(savedTheme);
//     }
//   }, []);

//   return (
//     <RestaurantContext.Provider value={{
//       restaurant,
//       menuItems,
//       loading,
//       theme,
//       setTheme,
//       refreshMenu,
//     }}>
//       {children}
//     </RestaurantContext.Provider>
//   );
// };


// ------------------------------------

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Restaurant, MenuItem, ARModel, ARSession, CartItem, CustomizationChoice } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import {sampleMenuItems} from './menuItem';

interface RestaurantContextType {
  // Core restaurant data
  restaurant: Restaurant | null;
  menuItems: MenuItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  
  // Theme management
  theme: string;
  setTheme: (theme: string) => void;
  
  // AR functionality
  getARModel: (itemId: string) => Promise<ARModel | null>;
  trackARUsage: (session: Partial<ARSession>) => void;
  
  // Search and filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredItems: MenuItem[];
  
  // Cart functionality
  cart: CartItem[];
  addToCart: (item: MenuItem, customizations?: CustomizationChoice[], specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  
  // Recent views
  recentlyViewed: string[];
  addToRecentlyViewed: (itemId: string) => void;
  
  // Menu management
  refreshMenu: () => Promise<void>;
  getItemsByCategory: (category: string) => MenuItem[];
  getFeaturedItems: () => MenuItem[];
  getPopularItems: () => MenuItem[];
  
  // Analytics
  trackItemView: (itemId: string) => void;
  trackAddToCart: (itemId: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core state
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setThemeState] = useState('modern');
  
  // Search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // User preferences
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Computed values
  const categories = useMemo(() => {
    return [...new Set(menuItems.map(item => item.category))];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    
    const query = searchQuery.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      item.category.toLowerCase().includes(query)
    );
  }, [menuItems, searchQuery]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Theme management
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('restaurant-theme', newTheme);
  };

  // AR functionality - Updated to use direct modelPath from menu item
  const getARModel = async (itemId: string): Promise<ARModel | null> => {
    try {
      const item = menuItems.find(i => i.id === itemId);
      if (!item) return null;

      // Check if item has AR support and model path
      if (!item.arEnabled || !item.has3DModel || !item.modelPath) {
        return null;
      }

      // Create AR model using the direct modelPath from the menu item
      const arModel: ARModel = {
        id: `ar-${itemId}`,
        itemId: itemId,
        glbUrl: item.modelPath, // Use direct model path
        usdzUrl: item.modelPath.replace('.glb', '.usdz'), // Assume USDZ version exists
        thumbnailUrl: item.image_url || item.image || '',
        fileSize: 2048000, // 2MB mock size
        lastUpdated: new Date(),
        version: '1.0'
      };

      return arModel;
    } catch (error) {
      console.error('Error fetching AR model:', error);
      return null;
    }
  };

  const trackARUsageSession = (session: Partial<ARSession>) => {
    // Track AR usage for analytics
    const fullSession: ARSession = {
      id: `ar-session-${Date.now()}`,
      itemId: session.itemId || '',
      userId: session.userId,
      startTime: session.startTime || new Date(),
      endTime: session.endTime,
      deviceType: session.deviceType || 'desktop',
      arMode: session.arMode || 'webxr',
      success: session.success || false,
      interactionCount: session.interactionCount || 0
    };

    // In a real app, you'd send this to your analytics service
    console.log('AR Session Tracked:', fullSession);
    
    // You could also store it in localStorage for offline analytics
    const existingSessions = JSON.parse(localStorage.getItem('ar-sessions') || '[]');
    existingSessions.push(fullSession);
    localStorage.setItem('ar-sessions', JSON.stringify(existingSessions.slice(-100))); // Keep last 100
  };

  // Cart functionality
  const addToCart = (item: MenuItem, customizations: CustomizationChoice[] = [], specialInstructions?: string) => {
    const customizationCost = customizations.reduce((sum, c) => sum + c.additionalCost, 0);
    const totalPrice = item.price + customizationCost;
    
    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.menuItem.id === item.id && 
      JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
        totalPrice: updatedCart[existingItemIndex].totalPrice + totalPrice
      };
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        menuItem: item,
        quantity: 1,
        customizations,
        totalPrice,
        specialInstructions,
        addedAt: new Date()
      };
      setCart([...cart, newCartItem]);
    }
    
    trackAddToCart(item.id);
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    toast.success('Item removed from cart');
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const unitPrice = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity,
          totalPrice: unitPrice * quantity
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  // Favorites functionality
  const toggleFavorite = (itemId: string) => {
    const updatedFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('restaurant-favorites', JSON.stringify(updatedFavorites));
    
    const action = favorites.includes(itemId) ? 'removed from' : 'added to';
    toast.success(`Item ${action} favorites!`);
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  // Recently viewed functionality
  const addToRecentlyViewed = (itemId: string) => {
    const updatedRecentlyViewed = [itemId, ...recentlyViewed.filter(id => id !== itemId)].slice(0, 10);
    setRecentlyViewed(updatedRecentlyViewed);
    localStorage.setItem('restaurant-recently-viewed', JSON.stringify(updatedRecentlyViewed));
  };

  // Menu utilities
  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  const getFeaturedItems = () => {
    return menuItems.filter(item => item.is_featured || item.isPopular);
  };

  const getPopularItems = () => {
    return menuItems
      .filter(item => item.salesCount || item.averageRating >= 4.5)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 6);
  };

  // Analytics
  const trackItemView = (itemId: string) => {
    // Track item views for analytics
    console.log('Item viewed:', itemId);
    addToRecentlyViewed(itemId);
  };

  const trackAddToCart = (itemId: string) => {
    // Track add to cart events
    console.log('Item added to cart:', itemId);
  };

  // Menu refresh functionality
  const refreshMenu = async () => {
    if (!restaurant) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('is_available', true)
        .order('category', { ascending: true });

      if (fetchError) throw fetchError;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items');
      toast.error('Failed to refresh menu');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For demo purposes, we'll create a default restaurant with enhanced data
        const defaultRestaurant: Restaurant = {
          id: 'default-restaurant',
          name: 'Matchis Restaurant',
          theme: 'modern',
          primary_color: '#1E40AF',
          secondary_color: '#059669',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setRestaurant(defaultRestaurant);
        
        // Load enhanced sample menu items with direct model paths
      
        setMenuItems(sampleMenuItems);
      } catch (error) {
        console.error('Error loading restaurant:', error);
        setError('Failed to load restaurant data');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();

    // Load saved data from localStorage
    const savedTheme = localStorage.getItem('restaurant-theme');
    if (savedTheme) {
      setThemeState(savedTheme);
    }

    const savedFavorites = localStorage.getItem('restaurant-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedRecentlyViewed = localStorage.getItem('restaurant-recently-viewed');
    if (savedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(savedRecentlyViewed));
    }

    const savedCart = localStorage.getItem('restaurant-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('restaurant-cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <RestaurantContext.Provider value={{
      // Core data
      restaurant,
      menuItems,
      categories,
      loading,
      error,
      
      // Theme
      theme,
      setTheme,
      
      // AR functionality
      getARModel,
      trackARUsage: trackARUsageSession,
      
      // Search and filtering
      searchQuery,
      setSearchQuery,
      filteredItems,
      
      // Cart functionality
      cart,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      cartTotal,
      cartItemCount,
      
      // Favorites
      favorites,
      toggleFavorite,
      isFavorite,
      
      // Recent views
      recentlyViewed,
      addToRecentlyViewed,
      
      // Menu utilities
      refreshMenu,
      getItemsByCategory,
      getFeaturedItems,
      getPopularItems,
      
      // Analytics
      trackItemView,
      trackAddToCart,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};


// ------------------------


// import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
// import { Restaurant, MenuItem, ARModel, ARSession, CartItem, CustomizationChoice } from '../types';
// import { supabase } from '../lib/supabase';
// import { getModelUrl, trackARUsage, createARSession, isARAvailable, handleARError } from '../utils/arUtils';
// import toast from 'react-hot-toast';

// interface RestaurantContextType {
//   // Core restaurant data
//   restaurant: Restaurant | null;
//   menuItems: MenuItem[];
//   categories: string[];
//   loading: boolean;
//   error: string | null;
  
//   // Theme management
//   theme: string;
//   setTheme: (theme: string) => void;
  
//   // AR functionality
//   getARModel: (itemId: string) => Promise<ARModel | null>;
//   trackARUsage: (session: Partial<ARSession>) => void;
//   createARSession: (itemId: string) => any;
//   isARAvailableForItem: (itemId: string) => boolean;
//   preloadARModel: (itemId: string) => Promise<void>;
  
//   // Search and filtering
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   filteredItems: MenuItem[];
//   activeCategory: string;
//   setActiveCategory: (category: string) => void;
//   activeFilter: 'all' | 'veg' | 'non-veg' | 'vegan';
//   setActiveFilter: (filter: 'all' | 'veg' | 'non-veg' | 'vegan') => void;
  
//   // Cart functionality
//   cart: CartItem[];
//   addToCart: (item: MenuItem, customizations?: CustomizationChoice[], specialInstructions?: string) => void;
//   removeFromCart: (itemId: string) => void;
//   updateCartItemQuantity: (itemId: string, quantity: number) => void;
//   clearCart: () => void;
//   cartTotal: number;
//   cartItemCount: number;
  
//   // Favorites
//   favorites: string[];
//   toggleFavorite: (itemId: string) => void;
//   isFavorite: (itemId: string) => boolean;
  
//   // Recent views
//   recentlyViewed: string[];
//   addToRecentlyViewed: (itemId: string) => void;
  
//   // Menu management
//   refreshMenu: () => Promise<void>;
//   getItemsByCategory: (category: string) => MenuItem[];
//   getFeaturedItems: () => MenuItem[];
//   getPopularItems: () => MenuItem[];
//   getItemById: (itemId: string) => MenuItem | undefined;
  
//   // Analytics
//   trackItemView: (itemId: string) => void;
//   trackAddToCart: (itemId: string) => void;
  
//   // Enhanced features
//   getRecommendations: (itemId?: string) => MenuItem[];
//   getNutritionalInfo: (itemId: string) => any;
//   checkItemAvailability: (itemId: string) => boolean;
// }

// const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// // Custom hook - this must be stable for Fast Refresh
// export function useRestaurant(): RestaurantContextType {
//   const context = useContext(RestaurantContext);
//   if (!context) {
//     throw new Error('useRestaurant must be used within a RestaurantProvider');
//   }
//   return context;
// }

// export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // Core state
//   const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [theme, setThemeState] = useState('modern');
  
//   // Search and filtering
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [activeFilter, setActiveFilter] = useState<'all' | 'veg' | 'non-veg' | 'vegan'>('all');
  
//   // Cart state
//   const [cart, setCart] = useState<CartItem[]>([]);
  
//   // User preferences
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

//   // Computed values
//   const categories = useMemo(() => {
//     return [...new Set(menuItems.map(item => item.category))];
//   }, [menuItems]);

//   const filteredItems = useMemo(() => {
//     let items = menuItems;

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       items = items.filter(item => 
//         item.name.toLowerCase().includes(query) ||
//         item.description.toLowerCase().includes(query) ||
//         item.tags?.some(tag => tag.toLowerCase().includes(query)) ||
//         item.category.toLowerCase().includes(query)
//       );
//     }

//     // Apply category filter
//     if (activeCategory !== 'all') {
//       items = items.filter(item => item.category === activeCategory);
//     }

//     // Apply dietary filter
//     if (activeFilter !== 'all') {
//       items = items.filter(item => item.dietary_type === activeFilter);
//     }

//     return items;
//   }, [menuItems, searchQuery, activeCategory, activeFilter]);

//   const cartTotal = useMemo(() => {
//     return cart.reduce((total, item) => total + item.totalPrice, 0);
//   }, [cart]);

//   const cartItemCount = useMemo(() => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   }, [cart]);

//   // Theme management
//   const setTheme = useCallback((newTheme: string) => {
//     setThemeState(newTheme);
//     localStorage.setItem('restaurant-theme', newTheme);
//   }, []);

//   // Enhanced AR functionality
//   const getARModel = useCallback(async (itemId: string): Promise<ARModel | null> => {
//     try {
//       const item = menuItems.find(i => i.id === itemId);
//       if (!item) {
//         console.warn('Item not found for AR model:', itemId);
//         return null;
//       }

//       if (!isARAvailable(item)) {
//         console.warn('AR not available for item:', item.name);
//         return null;
//       }

//       // Get model URLs using the enhanced utility
//       const glbUrl = getModelUrl(item, false);
//       const usdzUrl = getModelUrl(item, true);

//       const arModel: ARModel = {
//         id: `ar-${itemId}`,
//         itemId: itemId,
//         glbUrl,
//         usdzUrl,
//         thumbnailUrl: item.image_url || item.image || '',
//         fileSize: 2048000, // 2MB mock size
//         lastUpdated: new Date(),
//         version: '1.0',
//         // metadata: {
//         //   name: item.name,
//         //   category: item.category,
//         //   description: item.description,
//         //   tags: item.tags || []
//         // }
//       };

//       // Track AR model request
//       trackARUsage('ar_model_request', item.name, 'web', { itemId, modelUrl: glbUrl });

//       return arModel;
//     } catch (error) {
//       console.error('Error fetching AR model:', error);
//       const errorMessage = handleARError(error, itemId);
//       toast.error(errorMessage);
//       return null;
//     }
//   }, [menuItems]);

//   const trackARUsageSession = useCallback((session: Partial<ARSession>) => {
//     const item = menuItems.find(i => i.id === session.itemId);
//     const itemName = item?.name || 'Unknown Item';
    
//     const fullSession: ARSession = {
//       id: session.id || `ar-session-${Date.now()}`,
//       itemId: session.itemId || '',
//       userId: session.userId,
//       startTime: session.startTime || new Date(),
//       endTime: session.endTime,
//       deviceType: session.deviceType || 'desktop',
//       arMode: session.arMode || 'webxr',
//       success: session.success || false,
//       interactionCount: session.interactionCount || 0,
//       duration: session.endTime && session.startTime ? 
//         session.endTime.getTime() - session.startTime.getTime() : undefined
//     };

//     // Track using the enhanced AR utility
//     trackARUsage('ar_session_complete', itemName, fullSession.deviceType, fullSession);
    
//     // Store session data locally
//     try {
//       const existingSessions = JSON.parse(localStorage.getItem('ar-sessions') || '[]');
//       existingSessions.push(fullSession);
//       localStorage.setItem('ar-sessions', JSON.stringify(existingSessions.slice(-100)));
//     } catch (error) {
//       console.error('Failed to store AR session:', error);
//     }
//   }, [menuItems]);

//   const createARSessionForItem = useCallback((itemId: string) => {
//     const item = menuItems.find(i => i.id === itemId);
//     if (!item) return null;

//     return createARSession(itemId);
//   }, [menuItems]);

//   const isARAvailableForItem = useCallback((itemId: string): boolean => {
//     const item = menuItems.find(i => i.id === itemId);
//     return item ? isARAvailable(item) : false;
//   }, [menuItems]);

//   const preloadARModel = useCallback(async (itemId: string): Promise<void> => {
//     try {
//       const item = menuItems.find(i => i.id === itemId);
//       if (!item || !isARAvailable(item)) return;

//       const modelUrl = getModelUrl(item, false);
      
//       // Preload the model
//       const link = document.createElement('link');
//       link.rel = 'preload';
//       link.as = 'fetch';
//       link.href = modelUrl;
//       link.crossOrigin = 'anonymous';
//       document.head.appendChild(link);
      
//       trackARUsage('ar_model_preload', item.name, 'web', { itemId, modelUrl });
//     } catch (error) {
//       console.error('Failed to preload AR model:', error);
//     }
//   }, [menuItems]);

//   // Cart functionality
//   const addToCart = useCallback((item: MenuItem, customizations: CustomizationChoice[] = [], specialInstructions?: string) => {
//     const customizationCost = customizations.reduce((sum, c) => sum + c.additionalCost, 0);
//     const totalPrice = item.price + customizationCost;
    
//     const existingItemIndex = cart.findIndex(cartItem => 
//       cartItem.menuItem.id === item.id && 
//       JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
//     );

//     if (existingItemIndex >= 0) {
//       // Update existing item quantity
//       const updatedCart = [...cart];
//       updatedCart[existingItemIndex] = {
//         ...updatedCart[existingItemIndex],
//         quantity: updatedCart[existingItemIndex].quantity + 1,
//         totalPrice: updatedCart[existingItemIndex].totalPrice + totalPrice
//       };
//       setCart(updatedCart);
//     } else {
//       // Add new item to cart
//       const newCartItem: CartItem = {
//         id: `cart-${Date.now()}-${Math.random()}`,
//         menuItem: item,
//         quantity: 1,
//         customizations,
//         totalPrice,
//         specialInstructions,
//         addedAt: new Date()
//       };
//       setCart([...cart, newCartItem]);
//     }
    
//     trackAddToCart(item.id);
//     toast.success(`${item.name} added to cart!`);
//   }, [cart]);

//   const removeFromCart = useCallback((itemId: string) => {
//     const updatedCart = cart.filter(item => item.id !== itemId);
//     setCart(updatedCart);
//     toast.success('Item removed from cart');
//   }, [cart]);

//   const updateCartItemQuantity = useCallback((itemId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(itemId);
//       return;
//     }

//     const updatedCart = cart.map(item => {
//       if (item.id === itemId) {
//         const unitPrice = item.totalPrice / item.quantity;
//         return {
//           ...item,
//           quantity,
//           totalPrice: unitPrice * quantity
//         };
//       }
//       return item;
//     });
//     setCart(updatedCart);
//   }, [cart, removeFromCart]);

//   const clearCart = useCallback(() => {
//     setCart([]);
//     toast.success('Cart cleared');
//   }, []);

//   // Favorites functionality
//   const toggleFavorite = useCallback((itemId: string) => {
//     const updatedFavorites = favorites.includes(itemId)
//       ? favorites.filter(id => id !== itemId)
//       : [...favorites, itemId];
    
//     setFavorites(updatedFavorites);
//     localStorage.setItem('restaurant-favorites', JSON.stringify(updatedFavorites));
    
//     const action = favorites.includes(itemId) ? 'removed from' : 'added to';
//     toast.success(`Item ${action} favorites!`);
//   }, [favorites]);

//   const isFavorite = useCallback((itemId: string) => favorites.includes(itemId), [favorites]);

//   // Recently viewed functionality
//   const addToRecentlyViewed = useCallback((itemId: string) => {
//     const updatedRecentlyViewed = [itemId, ...recentlyViewed.filter(id => id !== itemId)].slice(0, 10);
//     setRecentlyViewed(updatedRecentlyViewed);
//     localStorage.setItem('restaurant-recently-viewed', JSON.stringify(updatedRecentlyViewed));
//   }, [recentlyViewed]);

//   // Menu utilities
//   const getItemsByCategory = useCallback((category: string) => {
//     return menuItems.filter(item => item.category === category);
//   }, [menuItems]);

//   const getFeaturedItems = useCallback(() => {
//     return menuItems.filter(item => item.is_featured || item.isPopular);
//   }, [menuItems]);

//   const getPopularItems = useCallback(() => {
//     return menuItems
//       .filter(item => item.salesCount || item.averageRating >= 4.5)
//       .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
//       .slice(0, 6);
//   }, [menuItems]);

//   const getItemById = useCallback((itemId: string) => {
//     return menuItems.find(item => item.id === itemId);
//   }, [menuItems]);

//   // Enhanced features
//   const getRecommendations = useCallback((itemId?: string): MenuItem[] => {
//     if (itemId) {
//       const currentItem = menuItems.find(item => item.id === itemId);
//       if (currentItem) {
//         // Recommend items from same category or with similar tags
//         return menuItems
//           .filter(item => 
//             item.id !== itemId && (
//               item.category === currentItem.category ||
//               item.tags?.some(tag => currentItem.tags?.includes(tag))
//             )
//           )
//           .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
//           .slice(0, 4);
//       }
//     }
    
//     // General recommendations based on popularity and rating
//     return menuItems
//       .filter(item => item.averageRating >= 4.3)
//       .sort((a, b) => {
//         const aScore = (a.averageRating || 0) * 0.7 + (a.salesCount || 0) * 0.3;
//         const bScore = (b.averageRating || 0) * 0.7 + (b.salesCount || 0) * 0.3;
//         return bScore - aScore;
//       })
//       .slice(0, 6);
//   }, [menuItems]);

//   const getNutritionalInfo = useCallback((itemId: string) => {
//     const item = menuItems.find(i => i.id === itemId);
//     return item?.nutritional_info || null;
//   }, [menuItems]);

//   const checkItemAvailability = useCallback((itemId: string): boolean => {
//     const item = menuItems.find(i => i.id === itemId);
//     return item?.is_available || false;
//   }, [menuItems]);

//   // Analytics
//   const trackItemView = useCallback((itemId: string) => {
//     const item = menuItems.find(i => i.id === itemId);
//     if (item) {
//       console.log('Item viewed:', item.name);
//       addToRecentlyViewed(itemId);
      
//       // Track view analytics
//       trackARUsage('item_view', item.name, 'web', { 
//         itemId, 
//         category: item.category,
//         price: item.price 
//       });
//     }
//   }, [menuItems, addToRecentlyViewed]);

//   const trackAddToCart = useCallback((itemId: string) => {
//     const item = menuItems.find(i => i.id === itemId);
//     if (item) {
//       console.log('Item added to cart:', item.name);
      
//       // Track add to cart analytics
//       trackARUsage('add_to_cart', item.name, 'web', { 
//         itemId, 
//         category: item.category,
//         price: item.price,
//         cartTotal: cartTotal + item.price
//       });
//     }
//   }, [menuItems, cartTotal]);

//   // Menu refresh functionality
//   const refreshMenu = useCallback(async () => {
//     if (!restaurant) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       const { data, error: fetchError } = await supabase
//         .from('menu_items')
//         .select('*')
//         .eq('restaurant_id', restaurant.id)
//         .eq('is_available', true)
//         .order('category', { ascending: true });

//       if (fetchError) throw fetchError;
//       setMenuItems(data || []);
//     } catch (error) {
//       console.error('Error fetching menu items:', error);
//       setError('Failed to load menu items');
//       toast.error('Failed to refresh menu');
//     } finally {
//       setLoading(false);
//     }
//   }, [restaurant]);

//   // Initialize data
//   useEffect(() => {
//     const loadRestaurant = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // For demo purposes, we'll create a default restaurant with enhanced data
//         const defaultRestaurant: Restaurant = {
//           id: 'default-restaurant',
//           name: 'Premium Bistro',
//           theme: 'modern',
//           primary_color: '#1E40AF',
//           secondary_color: '#059669',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         };

//         setRestaurant(defaultRestaurant);
        
//         // Load enhanced sample menu items with AR support
//         const sampleMenuItems: MenuItem[] = [
//           {
//             id: '1',
//             restaurant_id: 'default-restaurant',
//             name: 'Truffle Pasta',
//             description: 'Handmade pasta with truffle oil, parmesan, and fresh herbs. A signature dish crafted with premium black truffles.',
//             price: 28.99,
//             image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
//             image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
//             category: 'Main Course',
//             dietary_type: 'veg',
//             rating: 4.8,
//             nutritional_info: { calories: 650, protein: 18, carbs: 75, fat: 28, fiber: 4, sugar: 8 },
//             calories: 650,
//             protein: 18,
//             carbs: 75,
//             fat: 28,
//             is_available: true,
//             is_featured: true,
//             isPopular: true,
//             prepTime: 25,
//             tags: ['truffle', 'pasta', 'premium', 'signature'],
//             allergens: ['gluten', 'dairy'],
//             spiceLevel: 'mild',
//             has3DModel: true,
//             arEnabled: true,
//             salesCount: 156,
//             averageRating: 4.8,
//             reviewCount: 89,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           },
//           {
//             id: '2',
//             restaurant_id: 'default-restaurant',
//             name: 'Grilled Salmon',
//             description: 'Atlantic salmon with lemon herb butter and seasonal vegetables. Fresh, sustainably sourced fish grilled to perfection.',
//             price: 32.99,
//             image_url: 'https://images.pexels.com/photos/3563625/pexels-photo-3563625.jpeg',
//             image: 'https://images.pexels.com/photos/3563625/pexels-photo-3563625.jpeg',
//             category: 'Main Course',
//             dietary_type: 'non-veg',
//             rating: 4.7,
//             nutritional_info: { calories: 520, protein: 45, carbs: 12, fat: 32, fiber: 6, sugar: 5 },
//             calories: 520,
//             protein: 45,
//             carbs: 12,
//             fat: 32,
//             is_available: true,
//             is_featured: true,
//             prepTime: 20,
//             tags: ['salmon', 'grilled', 'healthy', 'omega-3'],
//             allergens: ['fish'],
//             spiceLevel: 'mild',
//             has3DModel: true,
//             arEnabled: true,
//             salesCount: 134,
//             averageRating: 4.7,
//             reviewCount: 76,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           },
//           {
//             id: '3',
//             restaurant_id: 'default-restaurant',
//             name: 'Chocolate Soufflé',
//             description: 'Decadent dark chocolate soufflé with vanilla ice cream. Made with Belgian chocolate and served warm.',
//             price: 14.99,
//             image_url: 'https://images.pexels.com/photos/5945757/pexels-photo-5945757.jpeg',
//             image: 'https://images.pexels.com/photos/5945757/pexels-photo-5945757.jpeg',
//             category: 'Dessert',
//             dietary_type: 'veg',
//             rating: 4.9,
//             nutritional_info: { calories: 420, protein: 8, carbs: 52, fat: 18, fiber: 3, sugar: 45 },
//             calories: 420,
//             protein: 8,
//             carbs: 52,
//             fat: 18,
//             is_available: true,
//             is_featured: false,
//             isNew: true,
//             prepTime: 30,
//             tags: ['chocolate', 'dessert', 'premium', 'belgian'],
//             allergens: ['dairy', 'eggs'],
//             spiceLevel: 'mild',
//             has3DModel: true,
//             arEnabled: true,
//             salesCount: 98,
//             averageRating: 4.9,
//             reviewCount: 52,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           },
//           {
//             id: '4',
//             restaurant_id: 'default-restaurant',
//             name: 'Spicy Thai Curry',
//             description: 'Authentic red curry with coconut milk, vegetables, and jasmine rice. Made with traditional Thai spices.',
//             price: 24.99,
//             image_url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
//             image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
//             category: 'Main Course',
//             dietary_type: 'vegan',
//             rating: 4.6,
//             nutritional_info: { calories: 580, protein: 15, carbs: 65, fat: 25, fiber: 8, sugar: 12 },
//             calories: 580,
//             protein: 15,
//             carbs: 65,
//             fat: 25,
//             is_available: true,
//             is_featured: false,
//             isSpicy: true,
//             prepTime: 18,
//             tags: ['thai', 'curry', 'vegan', 'spicy'],
//             allergens: ['coconut'],
//             spiceLevel: 'hot',
//             has3DModel: true,
//             arEnabled: true,
//             salesCount: 87,
//             averageRating: 4.6,
//             reviewCount: 43,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           },
//           {
//             id: '5',
//             restaurant_id: 'default-restaurant',
//             name: 'Classic Cheeseburger',
//             description: 'Juicy beef patty with aged cheddar, lettuce, tomato, and our signature sauce on a brioche bun.',
//             price: 16.99,
//             image_url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
//             image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
//             category: 'Burgers',
//             dietary_type: 'non-veg',
//             rating: 4.5,
//             nutritional_info: { calories: 720, protein: 35, carbs: 45, fat: 42, fiber: 3, sugar: 8 },
//             calories: 720,
//             protein: 35,
//             carbs: 45,
//             fat: 42,
//             is_available: true,
//             is_featured: true,
//             isPopular: true,
//             prepTime: 15,
//             tags: ['burger', 'beef', 'cheese', 'classic'],
//             allergens: ['gluten', 'dairy'],
//             spiceLevel: 'mild',
//             has3DModel: true,
//             arEnabled: true,
//             salesCount: 245,
//             averageRating: 4.5,
//             reviewCount: 128,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           },
//           {
//             id: '6',
//             restaurant_id: 'default-restaurant',
//             name: 'Margherita Pizza',
//             description: 'Traditional Italian pizza with fresh mozzarella, basil, and san marzano tomatoes on thin crust.',
//             price: 19.99,
//             image_url: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
//             image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
//             category: 'Pizza',
//             dietary_type: 'veg',
//             rating: 4.7,
//             nutritional_info: { calories: 680, protein: 28, carbs: 85, fat: 24, fiber: 4, sugar: 12 },
//             calories: 680,
//             protein: 28,
//             carbs: 85,
//             fat: 24,
//             is_available: true,
//             is_featured: true,
//             prepTime: 12,
//             tags: ['pizza', 'italian', 'margherita', 'mozzarella'],
//             allergens: ['gluten', 'dairy'],
//             spiceLevel: 'mild',
//             has3DModel: true,
//             arEnabled: true,
//             salesCount: 189,
//             averageRating: 4.7,
//             reviewCount: 94,
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           }
//         ];

//         setMenuItems(sampleMenuItems);
        
//         // Preload AR models for featured items
//         const featuredItems = sampleMenuItems.filter(item => item.is_featured);
//         featuredItems.forEach(item => {
//           if (item.has3DModel && item.arEnabled) {
//             preloadARModel(item.id).catch(console.error);
//           }
//         });
        
//       } catch (error) {
//         console.error('Error loading restaurant:', error);
//         setError('Failed to load restaurant data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadRestaurant();

//     // Load saved data from localStorage
//     const savedTheme = localStorage.getItem('restaurant-theme');
//     if (savedTheme) {
//       setThemeState(savedTheme);
//     }

//     const savedFavorites = localStorage.getItem('restaurant-favorites');
//     if (savedFavorites) {
//       try {
//         setFavorites(JSON.parse(savedFavorites));
//       } catch (error) {
//         console.error('Failed to parse saved favorites:', error);
//         localStorage.removeItem('restaurant-favorites');
//       }
//     }

//     const savedRecentlyViewed = localStorage.getItem('restaurant-recently-viewed');
//     if (savedRecentlyViewed) {
//       try {
//         setRecentlyViewed(JSON.parse(savedRecentlyViewed));
//       } catch (error) {
//         console.error('Failed to parse recently viewed:', error);
//         localStorage.removeItem('restaurant-recently-viewed');
//       }
//     }

//     const savedCart = localStorage.getItem('restaurant-cart');
//     if (savedCart) {
//       try {
//         setCart(JSON.parse(savedCart));
//       } catch (error) {
//         console.error('Failed to parse saved cart:', error);
//         localStorage.removeItem('restaurant-cart');
//       }
//     }
//   }, [preloadARModel]);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     try {
//       localStorage.setItem('restaurant-cart', JSON.stringify(cart));
//     } catch (error) {
//       console.error('Failed to save cart to localStorage:', error);
//     }
//   }, [cart]);

//   // Auto-save other preferences
//   useEffect(() => {
//     try {
//       localStorage.setItem('restaurant-favorites', JSON.stringify(favorites));
//     } catch (error) {
//       console.error('Failed to save favorites:', error);
//     }
//   }, [favorites]);

//   useEffect(() => {
//     try {
//       localStorage.setItem('restaurant-recently-viewed', JSON.stringify(recentlyViewed));
//     } catch (error) {
//       console.error('Failed to save recently viewed:', error);
//     }
//   }, [recentlyViewed]);

//   return (
//     <RestaurantContext.Provider value={{
//       // Core data
//       restaurant,
//       menuItems,
//       categories,
//       loading,
//       error,
      
//       // Theme
//       theme,
//       setTheme,
      
//       // AR functionality
//       getARModel,
//       trackARUsage: trackARUsageSession,
//       createARSession: createARSessionForItem,
//       isARAvailableForItem,
//       preloadARModel,
      
//       // Search and filtering
//       searchQuery,
//       setSearchQuery,
//       filteredItems,
//       activeCategory,
//       setActiveCategory,
//       activeFilter,
//       setActiveFilter,
      
//       // Cart functionality
//       cart,
//       addToCart,
//       removeFromCart,
//       updateCartItemQuantity,
//       clearCart,
//       cartTotal,
//       cartItemCount,
      
//       // Favorites
//       favorites,
//       toggleFavorite,
//       isFavorite,
      
//       // Recent views
//       recentlyViewed,
//       addToRecentlyViewed,
      
//       // Menu utilities
//       refreshMenu,
//       getItemsByCategory,
//       getFeaturedItems,
//       getPopularItems,
//       getItemById,
      
//       // Analytics
//       trackItemView,
//       trackAddToCart,
      
//       // Enhanced features
//       // getRecommendations,
//       // getNutritionalInfo,
//       // checkItemAvailability,
//     }}>
//       {children}
//     </RestaurantContext.Provider>
//   );
// };