export interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  theme: 'modern' | 'classic' | 'elegant' | 'vibrant';
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

// Enhanced MenuItem interface with AR support and additional features
export interface MenuItem {
  // id: string;
  // name: string;
  // description: string;
  // price: number;
  // image: string;
  // category: string;
  // dietary_type: 'veg' | 'non-veg' | 'vegan';
  // rating: number;
  // tags: string[];
  // isPopular?: boolean;

  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  image: string;
  category: string;
  dietary_type: 'veg' | 'non-veg' | 'vegan';
  nutritional_info: NutritionalInfo;
  is_available: boolean;
  is_featured: boolean;
  rating: number;
  tags: string[];
  isPopular?: boolean;
  created_at: string;
  updated_at: string;
  
  // New AR-related fields
  has3DModel?: boolean;
  modelPath?: string ,
  modelUrl?: string;
  modelUrlUSDZ?: string; // iOS-specific USDZ format
  arEnabled?: boolean;
  
  // Enhanced nutritional and detail fields
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
  
  // Additional metadata
  prepTime?: number; // in minutes
  servingSize?: string;
  allergens?: string[];
  ingredients?: string[];
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'very-hot';
  
  // Status flags
  isNew?: boolean;
  isSpicy?: boolean;
  isChefSpecial?: boolean;
  isLimitedTime?: boolean;
  isAvailable?: boolean;
  
  // Customization options
  customizations?: CustomizationOption[];
  
  // Additional metadata for better user experience
  preparationMethod?: string;
  origin?: string;
  pairsWith?: string[];
  nutritionalBenefits?: string[];
  
  // Business-related fields
  cost?: number; // internal cost for profit calculation
  margin?: number;
  salesCount?: number;
  averageRating?: number;
  reviewCount?: number;
  
  // Time-based availability
  availableFrom?: string; // time in HH:MM format
  availableTo?: string; // time in HH:MM format
  availableDays?: string[]; // days of week
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

// Customization options for menu items
export interface CustomizationOption {
  id: string;
  name: string;
  type: 'single' | 'multiple' | 'text';
  required: boolean;
  options: CustomizationChoice[];
  maxSelections?: number;
  additionalCost?: number;
}

export interface CustomizationChoice {
  id: string;
  name: string;
  additionalCost: number;
  isDefault?: boolean;
  isAvailable?: boolean;
}

// AR-specific interfaces
export interface ARModel {
  id: string;
  itemId: string;
  glbUrl: string;
  usdzUrl?: string;
  thumbnailUrl?: string;
  fileSize: number; // in bytes
  lastUpdated: Date;
  version: string;
}

export interface ARSession {
  id: string;
  itemId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  deviceType: 'ios' | 'android' | 'desktop';
  arMode: 'webxr' | 'quicklook' | 'sceneviewer';
  success: boolean;
  interactionCount?: number;
  duration?:number;
}

// Enhanced restaurant context types
export interface RestaurantContextType {
  menuItems: MenuItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  
  // AR-specific methods
  getARModel: (itemId: string) => Promise<ARModel | null>;
  trackARUsage: (session: Partial<ARSession>) => void;
  
  // Filtering and search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredItems: MenuItem[];
  
  // Cart functionality
  cart: CartItem[];
  addToCart: (item: MenuItem, customizations?: CustomizationChoice[]) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (itemId: string) => void;
  
  // Recent views
  recentlyViewed: string[];
  addToRecentlyViewed: (itemId: string) => void;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: CustomizationChoice[];
  totalPrice: number;
  specialInstructions?: string;
  addedAt: Date;
}

// Notification types for AR experiences
export interface ARNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

// Analytics events for AR tracking
export interface ARAnalyticsEvent {
  event: 'ar_view_started' | 'ar_view_ended' | 'ar_model_loaded' | 'ar_model_error' | 'ar_interaction';
  itemId: string;
  itemName: string;
  timestamp: Date;
  deviceInfo: {
    userAgent: string;
    platform: string;
    isARSupported: boolean;
    arModes: string[];
  };
  sessionData?: {
    duration: number;
    interactions: number;
    completedSuccessfully: boolean;
  };
}


export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  loyalty_points: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id?: string;
  restaurant_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  created_at: string;
}

export interface OrderItem {
  menu_item_id: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  restaurant_id: string;
  date: string;
  views: number;
  orders: number;
  revenue: number;
  popular_items: string[];
}

export interface WaiterCall {
  id: string;
  restaurant_id: string;
  table_number: string;
  message: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  created_at: string;
}