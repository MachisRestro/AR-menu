// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Lock, User, Shield } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface AdminLoginProps {
//   onLogin: () => void;
// }

// const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Simulate authentication
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       if (credentials.username === 'admin' && credentials.password === 'admin123') {
//         toast.success('Login successful!');
//         onLogin();
//       } else {
//         toast.error('Invalid credentials. Use admin/admin123 for demo.');
//       }
//     } catch (error) {
//       toast.error('Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
//       >
//         {/* Header */}
//         <div className="text-center mb-8">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
//           >
//             <Shield className="w-8 h-8 text-white" />
//           </motion.div>
//           <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
//           <p className="text-blue-200">Secure access to management dashboard</p>
//         </div>

//         {/* Demo Credentials */}
//         <div className="bg-blue-500/20 rounded-xl p-4 mb-6 border border-blue-400/30">
//           <p className="text-blue-100 text-sm text-center">
//             <strong>Demo Credentials:</strong><br />
//             Username: admin<br />
//             Password: admin123
//           </p>
//         </div>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-white text-sm font-medium mb-2">
//               Username
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 value={credentials.username}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//                 className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
//                 placeholder="Enter username"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-white text-sm font-medium mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="password"
//                 value={credentials.password}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//                 className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
//                 placeholder="Enter password"
//                 required
//               />
//             </div>
//           </div>

//           <motion.button
//             type="submit"
//             disabled={isLoading}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 <span>Authenticating...</span>
//               </>
//             ) : (
//               <>
//                 <Shield className="w-5 h-5" />
//                 <span>Access Dashboard</span>
//               </>
//             )}
//           </motion.button>
//         </form>

//         {/* Footer */}
//         <div className="mt-8 text-center">
//           <p className="text-blue-200 text-sm">
//             Secure authentication powered by advanced encryption
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AdminLogin;