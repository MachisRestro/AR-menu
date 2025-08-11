import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Share2 } from 'lucide-react';
import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
  url: string;
  onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ url, onClose }) => {
  const handleDownload = () => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const data = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'menu-qr-code.png';
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(data);
    }
  };

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
            <h2 className="text-xl font-bold text-gray-900">QR Code</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Scan to access the digital menu</p>
        </div>

        {/* QR Code */}
        <div className="p-6 flex flex-col items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <QRCode
              id="qr-code"
              value={url}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 200 200`}
            />
          </div>

          <p className="text-sm text-gray-600 text-center mb-6 max-w-xs">
            Point your camera at this QR code to instantly access our digital menu
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-3 w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigator.share({ url })}
              className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRCodeGenerator;