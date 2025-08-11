// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Users, MessageCircle, Phone, X } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface CallWaiterProps {
//   onClose: () => void;
// }

// const CallWaiter: React.FC<CallWaiterProps> = ({ onClose }) => {
//   const [tableNumber, setTableNumber] = useState('');
//   const [message, setMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       toast.success('Waiter has been notified!');
//       onClose();
//     } catch (error) {
//       toast.error('Failed to call waiter. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const quickMessages = [
//     'Need assistance with the menu',
//     'Ready to place order',
//     'Request for water refill',
//     'Need extra napkins',
//     'Check please',
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <Users className="w-6 h-6" />
//               <div>
//                 <h2 className="text-xl font-bold">Call Waiter</h2>
//                 <p className="text-blue-100 text-sm">We'll notify your server immediately</p>
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

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6">
//           {/* Table Number */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Table Number
//             </label>
//             <input
//               type="text"
//               value={tableNumber}
//               onChange={(e) => setTableNumber(e.target.value)}
//               placeholder="Enter your table number"
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>

//           {/* Quick Messages */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Quick Messages
//             </label>
//             <div className="space-y-2">
//               {quickMessages.map((quickMessage) => (
//                 <motion.button
//                   key={quickMessage}
//                   type="button"
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setMessage(quickMessage)}
//                   className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
//                     message === quickMessage
//                       ? 'border-blue-500 bg-blue-50 text-blue-700'
//                       : 'border-gray-200 hover:border-gray-300 text-gray-700'
//                   }`}
//                 >
//                   {quickMessage}
//                 </motion.button>
//               ))}
//             </div>
//           </div>

//           {/* Custom Message */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Custom Message (Optional)
//             </label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your custom message here..."
//               rows={4}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//           </div>

//           {/* Submit Button */}
//           <motion.button
//             type="submit"
//             disabled={isSubmitting || !tableNumber}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 <span>Calling Waiter...</span>
//               </>
//             ) : (
//               <>
//                 <Phone className="w-5 h-5" />
//                 <span>Call Waiter</span>
//               </>
//             )}
//           </motion.button>
//         </form>

//         {/* Footer */}
//         <div className="px-6 pb-6">
//           <div className="bg-gray-50 rounded-xl p-4">
//             <div className="flex items-center space-x-2 mb-2">
//               <MessageCircle className="w-5 h-5 text-blue-600" />
//               <span className="font-medium text-gray-900">Response Time</span>
//             </div>
//             <p className="text-sm text-gray-600">
//               Our staff typically responds within 2-3 minutes. Your request will be sent immediately.
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default CallWaiter;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Phone, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CallWaiterProps {
  onClose: () => void;
}

const CallWaiter: React.FC<CallWaiterProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      username,
      email,
      mobile,
      message,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.result === "Success") {
        toast.success('Form submitted successfully!');
        onClose();
      } else {
        toast.success('Thanks for the Feedback');
      }
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickMessages = [
    'Good Hospitality',
    'Great Menu and Wonderful 3D Integration',
    'Nice Environment',
    'Proper Hygiene',
    'Will surely visit again',
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
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Give Feedback</h2>
                <p className="text-blue-100 text-sm">We'll love to hear from Our Customers</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Quick Messages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Messages
            </label>
            <div className="space-y-2">
              {quickMessages.map((quickMessage) => (
                <motion.button
                  key={quickMessage}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMessage(quickMessage)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                    message === quickMessage
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {quickMessage}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your custom message here..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !username || !email || !mobile}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calling Waiter...</span>
              </>
            ) : (
              <>
                <Phone className="w-5 h-5" />
                <span>Give Feedback</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Thank you for Visting</span>
            </div>
            <p className="text-sm text-gray-600">
              Hope you enjoyed your time here.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CallWaiter;
