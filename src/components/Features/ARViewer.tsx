// import React from 'react';
// import { motion } from 'framer-motion';
// import { X, RotateCcw, ZoomIn, Move3D } from 'lucide-react';
// import { MenuItem } from '../../types';

// interface ARViewerProps {
//   item: MenuItem;
//   onClose: () => void;
// }

// const ARViewer: React.FC<ARViewerProps> = ({ item, onClose }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <Move3D className="w-6 h-6" />
//               <div>
//                 <h2 className="text-xl font-bold">360° View</h2>
//                 <p className="text-blue-100 text-sm">{item.name}</p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* AR Viewer Content */}
//         <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
//           {/* Simulated 3D View */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <motion.div
//               animate={{ rotateY: 360 }}
//               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//               className="relative"
//             >
//               <img
//                 src={item.image_url}
//                 alt={item.name}
//                 className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
//               />
              
//               {/* 3D Effect Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 rounded-2xl"></div>
//             </motion.div>
//           </div>

//           {/* AR Controls */}
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//             <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-md rounded-full px-6 py-3">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
//               >
//                 <RotateCcw className="w-5 h-5" />
//               </motion.button>
              
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
//               >
//                 <ZoomIn className="w-5 h-5" />
//               </motion.button>
              
//               <span className="text-white text-sm font-medium">Drag to rotate</span>
//             </div>
//           </div>

//           {/* Info Panel */}
//           <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-xl p-4 text-white max-w-xs">
//             <h3 className="font-bold mb-2">{item.name}</h3>
//             <p className="text-sm text-gray-200 mb-3">{item.description}</p>
//             <div className="flex items-center justify-between">
//               <span className="text-2xl font-bold">${item.price}</span>
//               <div className="flex items-center space-x-1 text-sm">
//                 <span>{item.nutritional_info.calories}</span>
//                 <span>cal</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Features Panel */}
//         <div className="p-4 bg-gray-50">
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <div>
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <Move3D className="w-6 h-6 text-blue-600" />
//               </div>
//               <p className="text-sm font-medium text-gray-900">360° Rotation</p>
//               <p className="text-xs text-gray-600">View from all angles</p>
//             </div>
            
//             <div>
//               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <ZoomIn className="w-6 h-6 text-purple-600" />
//               </div>
//               <p className="text-sm font-medium text-gray-900">Zoom Details</p>
//               <p className="text-xs text-gray-600">Inspect closely</p>
//             </div>
            
//             <div>
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <RotateCcw className="w-6 h-6 text-green-600" />
//               </div>
//               <p className="text-sm font-medium text-gray-900">Real Size</p>
//               <p className="text-xs text-gray-600">True proportions</p>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ARViewer;






// ------------------------------------------------



import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw, ZoomIn, ZoomOut, Info, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../../types';

interface ARViewerProps {
  item: MenuItem;
  onClose: () => void;
}

// Declare model-viewer element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

const ARViewer: React.FC<ARViewerProps> = ({ item, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Mock 3D model URL - in a real app, this would come from your MenuItem data
  const getModelUrl = (itemName: string) => {
    // You would map your food items to their corresponding 3D model URLs
    // For demo purposes, using generic food models
    const modelMappings: { [key: string]: string } = {
      'burger': 'https://modelviewer.dev/shared-assets/models/Hamburger.glb',
      'pizza': 'https://modelviewer.dev/shared-assets/models/Pizza.glb',
      'coffee': 'https://modelviewer.dev/shared-assets/models/Coffee.glb',
      'cake': 'https://modelviewer.dev/shared-assets/models/Cake.glb',
      'default': 'https://modelviewer.dev/shared-assets/models/Hamburger.glb'
    };

    const itemNameLower = itemName.toLowerCase();
    for (const [key, url] of Object.entries(modelMappings)) {
      if (itemNameLower.includes(key)) {
        return url;
      }
    }
    return modelMappings.default;
  };

  const modelUrl = getModelUrl(item.name);

  useEffect(() => {
    // Prevent body scroll when AR viewer is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleModelLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleModelError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
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
      src="public/7112734.webp" // replace with your actual filename in /public
      alt="AR Icon"
      className="w-3 h-3"
    />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                <p className="text-gray-600">AR View Experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Info className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>

          {/* AR Viewer Container */}
          <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading 3D model...</p>
                </div>
              </div>
            )}

            {error && (
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
                    onClick={onClose}
                    className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            )}

            {!error && (
              <model-viewer
                src={modelUrl}
                alt={`3D model of ${item.name}`}
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
                onLoad={handleModelLoad}
                onError={handleModelError}
              >
                {/* AR Button */}
                <button
                  slot="ar-button"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-purple-700 transition-colors shadow-lg"
                >
                  {/* <Camera className="w-5 h-5" /> */}
                  <img
      src="public/7112734.webp" // replace with your actual filename in /public
      alt="AR Icon"
      className="w-3 h-3"
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
            {!isLoading && !error && (
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
            {showInfo && (
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
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag, index) => (
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
                          <span className="text-2xl font-bold text-purple-600">${item.price}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-600">Rating</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="font-medium">{item.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-600">Type</span>
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${
                              item.dietary_type === 'veg' ? 'bg-green-500' :
                              item.dietary_type === 'vegan' ? 'bg-green-600' :
                              'bg-red-500'
                            }`}></span>
                            <span className="capitalize font-medium">{item.dietary_type}</span>
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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

export default ARViewer;