
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

