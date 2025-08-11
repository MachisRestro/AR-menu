// import { useState, useEffect } from 'react';

// // Hook to detect AR capabilities
// export const useARSupport = () => {
//   const [isARSupported, setIsARSupported] = useState(false);
//   const [isWebXRSupported, setIsWebXRSupported] = useState(false);
//   const [isQuickLookSupported, setIsQuickLookSupported] = useState(false);
//   const [isSceneViewerSupported, setIsSceneViewerSupported] = useState(false);

//   useEffect(() => {
//     const checkARSupport = async () => {
//       // Check for WebXR support (Android Chrome, etc.)
//       if ('xr' in navigator) {
//         try {
//           const xr = (navigator as any).xr;
//           if (xr) {
//             const isSupported = await xr.isSessionSupported('immersive-ar');
//             setIsWebXRSupported(isSupported);
//           }
//         } catch (error) {
//           console.log('WebXR not supported');
//         }
//       }

//       // Check for iOS Quick Look support
//       const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//       const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent);
//       setIsQuickLookSupported(isIOSSafari);

//       // Check for Android Scene Viewer support
//       const isAndroid = /Android/.test(navigator.userAgent);
//       const hasSceneViewer = isAndroid && 'share' in navigator;
//       setIsSceneViewerSupported(hasSceneViewer);

//       // Set overall AR support
//       setIsARSupported(isWebXRSupported || isIOSSafari || hasSceneViewer);
//     };

//     checkARSupport();
//   }, []);

//   return {
//     isARSupported,
//     isWebXRSupported,
//     isQuickLookSupported,
//     isSceneViewerSupported
//   };
// };

// // Utility function to get appropriate AR modes based on device
// export const getARModes = () => {
//   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//   const isAndroid = /Android/.test(navigator.userAgent);
  
//   if (isIOS) {
//     return 'quick-look';
//   } else if (isAndroid) {
//     return 'scene-viewer webxr';
//   } else {
//     return 'webxr scene-viewer quick-look';
//   }
// };

// // Utility function to check if device supports AR
// export const checkARCapabilities = async () => {
//   const capabilities = {
//     webxr: false,
//     quicklook: false,
//     sceneviewer: false
//   };

//   // Check WebXR
//   if ('xr' in navigator) {
//     try {
//       const xr = (navigator as any).xr;
//       if (xr && xr.isSessionSupported) {
//         capabilities.webxr = await xr.isSessionSupported('immersive-ar');
//       }
//     } catch (error) {
//       console.log('WebXR check failed:', error);
//     }
//   }

//   // Check iOS Quick Look
//   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
//   const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent);
//   capabilities.quicklook = isIOSSafari;

//   // Check Android Scene Viewer
//   const isAndroid = /Android/.test(navigator.userAgent);
//   capabilities.sceneviewer = isAndroid;

//   return capabilities;
// };

// // AR Toast messages
// export const ARMessages = {
//   loading: 'Loading AR experience...',
//   notSupported: 'AR is not supported on this device',
//   modelNotFound: '3D model not available for this item',
//   error: 'Failed to load AR experience',
//   success: 'AR view ready! Tap "View in AR" to start',
//   instructions: {
//     ios: 'Tap the AR button to view in your space using Quick Look',
//     android: 'Tap the AR button to view using Scene Viewer',
//     desktop: 'Use mouse to rotate and scroll to zoom the 3D model'
//   }
// };

// // Mock 3D model mappings - in production, this would come from your backend
// export const modelMappings: { [key: string]: { glb: string; usdz?: string } } = {
//   // Burgers & Sandwiches
//   'burger': {
//     glb: '/Users/himanshurawat/Downloads/project/public/dish1.glb',
//     usdz: '/Users/himanshurawat/Downloads/project/public/dish1.glb'
//   },
//   'sandwich': {
//     glb: '/Users/himanshurawat/Downloads/project/public/dish1.glb',
//     usdz: '/Users/himanshurawat/Downloads/project/public/dish1.glb'
//   },
  
//   // Pizza
//   'pizza': {
//     glb: 'https://modelviewer.dev/shared-assets/models/reflectivity.glb', // Placeholder
//   },
  
//   // Beverages
//   'coffee': {
//     glb: 'https://modelviewer.dev/shared-assets/models/reflectivity.glb', // Placeholder
//   },
//   'drink': {
//     glb: 'https://modelviewer.dev/shared-assets/models/reflectivity.glb', // Placeholder
//   },
  
//   // Desserts
//   'cake': {
//     glb: 'https://modelviewer.dev/shared-assets/models/reflectivity.glb', // Placeholder
//   },
//   'dessert': {
//     glb: 'https://modelviewer.dev/shared-assets/models/reflectivity.glb', // Placeholder
//   },
  
//   // Default fallback
//   'default': {
//     glb: '/Users/himanshurawat/Downloads/project/public/dish1.glb',
//     usdz: '/Users/himanshurawat/Downloads/project/public/dish1.glb'
//   }
// };

// // Function to get model URL based on item name
// export const getModelUrl = (itemName: string, preferUSDZ: boolean = false) => {
//   const itemNameLower = itemName.toLowerCase();
  
//   // Find matching model
//   for (const [key, urls] of Object.entries(modelMappings)) {
//     if (itemNameLower.includes(key)) {
//       if (preferUSDZ && urls.usdz) {
//         return urls.usdz;
//       }
//       return urls.glb;
//     }
//   }
  
//   // Return default model
//   const defaultModel = modelMappings.default;
//   if (preferUSDZ && defaultModel.usdz) {
//     return defaultModel.usdz;
//   }
//   return defaultModel.glb;
// };

// // AR Analytics utility (for tracking AR usage)
// export const trackARUsage = (event: string, itemName: string, deviceType: string) => {
//   // In production, you would send this to your analytics service
//   console.log('AR Analytics:', {
//     event,
//     itemName,
//     deviceType,
//     timestamp: new Date().toISOString(),
//     userAgent: navigator.userAgent
//   });
// };

// export default {
//   useARSupport,
//   getARModes,
//   checkARCapabilities,
//   ARMessages,
//   modelMappings,
//   getModelUrl,
//   trackARUsage
// };



//--------------------------
import { useState, useEffect } from 'react';
import { MenuItem } from '../types';

// Hook to detect AR capabilities
export const useARSupport = () => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isWebXRSupported, setIsWebXRSupported] = useState(false);
  const [isQuickLookSupported, setIsQuickLookSupported] = useState(false);
  const [isSceneViewerSupported, setIsSceneViewerSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkARSupport = async () => {
      setIsLoading(true);
      
      try {
        // Check for WebXR support (Android Chrome, etc.)
        if ('xr' in navigator) {
          try {
            const xr = (navigator as any).xr;
            if (xr && xr.isSessionSupported) {
              const isSupported = await xr.isSessionSupported('immersive-ar');
              setIsWebXRSupported(isSupported);
            }
          } catch (error) {
            console.log('WebXR not supported:', error);
            setIsWebXRSupported(false);
          }
        }

        // Check for iOS Quick Look support
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent);
        setIsQuickLookSupported(isIOSSafari);

        // Check for Android Scene Viewer support
        const isAndroid = /Android/.test(navigator.userAgent);
        const hasSceneViewer = isAndroid && 'share' in navigator;
        setIsSceneViewerSupported(hasSceneViewer);

        // Set overall AR support
        const hasARSupport = isWebXRSupported || isIOSSafari || hasSceneViewer;
        setIsARSupported(hasARSupport);
        
        console.log('AR Support Check:', {
          isARSupported: hasARSupport,
          isWebXRSupported,
          isQuickLookSupported: isIOSSafari,
          isSceneViewerSupported: hasSceneViewer,
          userAgent: navigator.userAgent
        });
      } catch (error) {
        console.error('Error checking AR support:', error);
        setIsARSupported(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkARSupport();
  }, []);

  return {
    isARSupported,
    isWebXRSupported,
    isQuickLookSupported,
    isSceneViewerSupported,
    isLoading
  };
};

// Utility function to get appropriate AR modes based on device
export const getARModes = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  if (isIOS) {
    return 'quick-look';
  } else if (isAndroid) {
    return 'scene-viewer webxr';
  } else {
    return 'webxr scene-viewer quick-look';
  }
};

// Enhanced AR capabilities check
export const checkARCapabilities = async () => {
  const capabilities = {
    webxr: false,
    quicklook: false,
    sceneviewer: false,
    modelViewer: false
  };

  // Check WebXR
  if ('xr' in navigator) {
    try {
      const xr = (navigator as any).xr;
      if (xr && xr.isSessionSupported) {
        capabilities.webxr = await xr.isSessionSupported('immersive-ar');
      }
    } catch (error) {
      console.log('WebXR check failed:', error);
    }
  }

  // Check iOS Quick Look
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isIOSSafari = isIOS && /Safari/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent);
  capabilities.quicklook = isIOSSafari;

  // Check Android Scene Viewer
  const isAndroid = /Android/.test(navigator.userAgent);
  capabilities.sceneviewer = isAndroid;

  // Check if model-viewer is supported
  capabilities.modelViewer = 'customElements' in window;

  return capabilities;
};

// AR Toast messages
export const ARMessages = {
  loading: 'Loading AR experience...',
  notSupported: 'AR is not supported on this device',
  modelNotFound: '3D model not available for this item',
  error: 'Failed to load AR experience',
  success: 'AR view ready! Tap "View in AR" to start',
  loadingModel: 'Loading 3D model...',
  modelReady: '3D model loaded successfully',
  instructions: {
    ios: 'Tap the AR button to view in your space using Quick Look',
    android: 'Tap the AR button to view using Scene Viewer',
    desktop: 'Use mouse to rotate and scroll to zoom the 3D model',
    mobile: 'Drag to rotate, pinch to zoom'
  }
};

// Enhanced 3D model mappings with proper paths
export const modelMappings: { [key: string]: { glb: string; usdz?: string; thumbnail?: string } } = {
  // Burgers & Sandwiches
  'burger': {
    glb: '/models/burgers/classic-burger.glb',
    usdz: '/models/burgers/classic-burger.usdz',
    thumbnail: '/models/thumbnails/burger.jpg'
  },
  'cheeseburger': {
    glb: '/models/burgers/cheeseburger.glb',
    usdz: '/models/burgers/cheeseburger.usdz',
    thumbnail: '/models/thumbnails/cheeseburger.jpg'
  },
  'sandwich': {
    glb: '/models/sandwiches/club-sandwich.glb',
    usdz: '/models/sandwiches/club-sandwich.usdz',
    thumbnail: '/models/thumbnails/sandwich.jpg'
  },
  'club sandwich': {
    glb: '/models/sandwiches/club-sandwich.glb',
    usdz: '/models/sandwiches/club-sandwich.usdz',
    thumbnail: '/models/thumbnails/club-sandwich.jpg'
  },
  
  // Pizza
  'pizza': {
    glb: '/models/pizza/margherita.glb',
    usdz: '/models/pizza/margherita.usdz',
    thumbnail: '/models/thumbnails/pizza.jpg'
  },
  'margherita': {
    glb: '/models/pizza/margherita.glb',
    usdz: '/models/pizza/margherita.usdz',
    thumbnail: '/models/thumbnails/margherita.jpg'
  },
  'pepperoni': {
    glb: '/models/pizza/pepperoni.glb',
    usdz: '/models/pizza/pepperoni.usdz',
    thumbnail: '/models/thumbnails/pepperoni.jpg'
  },
  
  // Pasta
  'pasta': {
    glb: '/models/pasta/spaghetti.glb',
    usdz: '/models/pasta/spaghetti.usdz',
    thumbnail: '/models/thumbnails/pasta.jpg'
  },
  'truffle pasta': {
    glb: '/models/pasta/truffle-pasta.glb',
    usdz: '/models/pasta/truffle-pasta.usdz',
    thumbnail: '/models/thumbnails/truffle-pasta.jpg'
  },
  'spaghetti': {
    glb: '/models/pasta/spaghetti.glb',
    usdz: '/models/pasta/spaghetti.usdz',
    thumbnail: '/models/thumbnails/spaghetti.jpg'
  },
  
  // Main Courses
  'salmon': {
    glb: '/models/mains/grilled-salmon.glb',
    usdz: '/models/mains/grilled-salmon.usdz',
    thumbnail: '/models/thumbnails/salmon.jpg'
  },
  'grilled salmon': {
    glb: '/models/mains/grilled-salmon.glb',
    usdz: '/models/mains/grilled-salmon.usdz',
    thumbnail: '/models/thumbnails/grilled-salmon.jpg'
  },
  'steak': {
    glb: '/models/mains/grilled-steak.glb',
    usdz: '/models/mains/grilled-steak.usdz',
    thumbnail: '/models/thumbnails/steak.jpg'
  },
  'chicken': {
    glb: '/models/mains/grilled-chicken.glb',
    usdz: '/models/mains/grilled-chicken.usdz',
    thumbnail: '/models/thumbnails/chicken.jpg'
  },
  
  // Curries
  'curry': {
    glb: '/models/curries/thai-curry.glb',
    usdz: '/models/curries/thai-curry.usdz',
    thumbnail: '/models/thumbnails/curry.jpg'
  },
  'thai curry': {
    glb: '/models/curries/thai-curry.glb',
    usdz: '/models/curries/thai-curry.usdz',
    thumbnail: '/models/thumbnails/thai-curry.jpg'
  },
  'spicy thai curry': {
    glb: '/models/curries/spicy-thai-curry.glb',
    usdz: '/models/curries/spicy-thai-curry.usdz',
    thumbnail: '/models/thumbnails/spicy-thai-curry.jpg'
  },
  
  // Desserts
  'soufflé': {
    glb: '/models/desserts/chocolate-souffle.glb',
    usdz: '/models/desserts/chocolate-souffle.usdz',
    thumbnail: '/models/thumbnails/souffle.jpg'
  },
  'chocolate soufflé': {
    glb: '/models/desserts/chocolate-souffle.glb',
    usdz: '/models/desserts/chocolate-souffle.usdz',
    thumbnail: '/models/thumbnails/chocolate-souffle.jpg'
  },
  'cake': {
    glb: '/models/desserts/chocolate-cake.glb',
    usdz: '/models/desserts/chocolate-cake.usdz',
    thumbnail: '/models/thumbnails/cake.jpg'
  },
  'ice cream': {
    glb: '/models/desserts/ice-cream.glb',
    usdz: '/models/desserts/ice-cream.usdz',
    thumbnail: '/models/thumbnails/ice-cream.jpg'
  },
  'tiramisu': {
    glb: '/models/desserts/tiramisu.glb',
    usdz: '/models/desserts/tiramisu.usdz',
    thumbnail: '/models/thumbnails/tiramisu.jpg'
  },
  
  // Beverages
  'coffee': {
    glb: '/models/drinks/coffee-cup.glb',
    usdz: '/models/drinks/coffee-cup.usdz',
    thumbnail: '/models/thumbnails/coffee.jpg'
  },
  'latte': {
    glb: '/models/drinks/latte.glb',
    usdz: '/models/drinks/latte.usdz',
    thumbnail: '/models/thumbnails/latte.jpg'
  },
  'cappuccino': {
    glb: '/models/drinks/cappuccino.glb',
    usdz: '/models/drinks/cappuccino.usdz',
    thumbnail: '/models/thumbnails/cappuccino.jpg'
  },
  'tea': {
    glb: '/models/drinks/tea-cup.glb',
    usdz: '/models/drinks/tea-cup.usdz',
    thumbnail: '/models/thumbnails/tea.jpg'
  },
  'juice': {
    glb: '/models/drinks/juice-glass.glb',
    usdz: '/models/drinks/juice-glass.usdz',
    thumbnail: '/models/thumbnails/juice.jpg'
  },
  'smoothie': {
    glb: '/models/drinks/smoothie.glb',
    usdz: '/models/drinks/smoothie.usdz',
    thumbnail: '/models/thumbnails/smoothie.jpg'
  },
  
  // Salads
  'salad': {
    glb: '/models/salads/garden-salad.glb',
    usdz: '/models/salads/garden-salad.usdz',
    thumbnail: '/models/thumbnails/salad.jpg'
  },
  'caesar': {
    glb: '/models/salads/caesar-salad.glb',
    usdz: '/models/salads/caesar-salad.usdz',
    thumbnail: '/models/thumbnails/caesar.jpg'
  },
  'greek salad': {
    glb: '/models/salads/greek-salad.glb',
    usdz: '/models/salads/greek-salad.usdz',
    thumbnail: '/models/thumbnails/greek-salad.jpg'
  },
  
  // Appetizers
  'nachos': {
    glb: '/models/appetizers/nachos.glb',
    usdz: '/models/appetizers/nachos.usdz',
    thumbnail: '/models/thumbnails/nachos.jpg'
  },
  'wings': {
    glb: '/models/appetizers/chicken-wings.glb',
    usdz: '/models/appetizers/chicken-wings.usdz',
    thumbnail: '/models/thumbnails/wings.jpg'
  },
  'fries': {
    glb: '/models/appetizers/french-fries.glb',
    usdz: '/models/appetizers/french-fries.usdz',
    thumbnail: '/models/thumbnails/fries.jpg'
  },
  
  // Default fallback - using a proper model URL
  'default': {
    glb: '/Users/himanshurawat/Downloads/project/public/dish1.glb',
    usdz: '/Users/himanshurawat/Downloads/project/public/dish1.glb',
    thumbnail: '/models/thumbnails/default.jpg'
  }
};

// Enhanced function to get model URL based on item name or MenuItem object
export const getModelUrl = (itemInput: string | MenuItem, preferUSDZ: boolean = false): string => {
  let itemName: string;
  let modelPath: string | undefined;

  // Handle both string and MenuItem inputs
  if (typeof itemInput === 'string') {
    itemName = itemInput;
  } else {
    itemName = itemInput.name;
    modelPath = itemInput.modelPath;
  }

  // If item has a specific model path, use it
  if (modelPath) {
    return `/Users/himanshurawat/Downloads/project/public/${modelPath}`;
  }

  const itemNameLower = itemName.toLowerCase();
  
  // Find matching model - prioritize exact matches first
  for (const [key, urls] of Object.entries(modelMappings)) {
    if (itemNameLower === key || itemNameLower.includes(key)) {
      if (preferUSDZ && urls.usdz) {
        return urls.usdz;
      }
      return urls.glb;
    }
  }
  
  // Return default model
  const defaultModel = modelMappings.default;
  if (preferUSDZ && defaultModel.usdz) {
    return defaultModel.usdz;
  }
  return defaultModel.glb;
};

// Function to get model thumbnail
export const getModelThumbnail = (itemInput: string | MenuItem): string => {
  let itemName: string;

  if (typeof itemInput === 'string') {
    itemName = itemInput;
  } else {
    itemName = itemInput.name;
  }

  const itemNameLower = itemName.toLowerCase();
  
  for (const [key, urls] of Object.entries(modelMappings)) {
    if (itemNameLower === key || itemNameLower.includes(key)) {
      return urls.thumbnail || '/models/thumbnails/default.jpg';
    }
  }
  
  return '/models/thumbnails/default.jpg';
};

// Enhanced AR Analytics utility
export const trackARUsage = (event: string, itemName: string, deviceType: string, additionalData?: any) => {
  const analyticsData = {
    event,
    itemName,
    deviceType,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ...additionalData
  };

  // In production, send this to your analytics service
  console.log('AR Analytics:', analyticsData);

  // Store locally for offline analytics
  try {
    const existingAnalytics = JSON.parse(localStorage.getItem('ar-analytics') || '[]');
    existingAnalytics.push(analyticsData);
    
    // Keep only last 1000 events
    const trimmedAnalytics = existingAnalytics.slice(-1000);
    localStorage.setItem('ar-analytics', JSON.stringify(trimmedAnalytics));
  } catch (error) {
    console.error('Failed to store AR analytics:', error);
  }
};

// AR session management
export const createARSession = (itemId: string, userId?: string) => {
  const sessionId = `ar-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const session = {
    id: sessionId,
    itemId,
    userId,
    startTime: new Date(),
    deviceType: getDeviceType(),
    arMode: getARModes(),
    userAgent: navigator.userAgent,
    interactions: 0
  };

  trackARUsage('ar_session_start', itemId, session.deviceType, session);
  
  return session;
};

// Get device type for analytics
export const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  
  if (/iPad/.test(userAgent)) return 'tablet';
  if (/iPhone|iPod/.test(userAgent)) return 'mobile';
  if (/Android/.test(userAgent)) {
    return /Mobile/.test(userAgent) ? 'mobile' : 'tablet';
  }
  return 'desktop';
};

// Validate model URL
export const validateModelUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Model validation failed:', error);
    return false;
  }
};

// Preload AR models for better performance
export const preloadARModel = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = url;
    link.crossOrigin = 'anonymous';
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload model: ${url}`));
    
    document.head.appendChild(link);
  });
};

// AR Error handling
export const handleARError = (error: any, itemName: string) => {
  const errorMessage = error?.message || 'Unknown AR error';
  
  trackARUsage('ar_error', itemName, getDeviceType(), {
    error: errorMessage,
    stack: error?.stack
  });

  console.error('AR Error:', errorMessage, error);
  
  // Return user-friendly error message
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error: Please check your connection and try again.';
  }
  
  if (errorMessage.includes('model') || errorMessage.includes('load')) {
    return 'Model loading error: This 3D model is temporarily unavailable.';
  }
  
  return 'AR experience unavailable: Please try again later.';
};

// Check if AR is available for specific item
export const isARAvailable = (item: MenuItem): boolean => {
  return !!(item.has3DModel && item.arEnabled);
};

// Get AR capabilities summary
export const getARCapabilitiesSummary = async () => {
  const capabilities = await checkARCapabilities();
  const support = useARSupport();
  
  return {
    ...capabilities,
    ...support,
    deviceType: getDeviceType(),
    recommendedMode: getARModes(),
    totalModelsAvailable: Object.keys(modelMappings).length
  };
};

export default {
  useARSupport,
  getARModes,
  checkARCapabilities,
  ARMessages,
  modelMappings,
  getModelUrl,
  getModelThumbnail,
  trackARUsage,
  createARSession,
  getDeviceType,
  validateModelUrl,
  preloadARModel,
  handleARError,
  isARAvailable,
  getARCapabilitiesSummary
};