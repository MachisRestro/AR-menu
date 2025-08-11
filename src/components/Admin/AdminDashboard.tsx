import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";

interface Submission {
  Username: string;
  Email: string;
  Mobile: number;
  Message: string;
  Timestamp: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15; // pagination limit
  const SHEET_API_URL = "/submit"; // your backend API endpoint

  useEffect(() => {
    let interval: NodeJS.Timeout;
  
    if (activeTab === "submissions") {
      const fetchData = () => {
        setLoading(true);
        fetch(SHEET_API_URL)
          .then((res) => res.json())
          .then((data) => {
            setSubmissions(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setError("Failed to fetch submissions.");
            setLoading(false);
          });
      };
  
      // First fetch immediately
      fetchData();
  
      // Poll every 5 seconds
      interval = setInterval(fetchData, 60000);
    }
  
    // Cleanup on tab change or unmount
    return () => clearInterval(interval);
  }, [activeTab]);

  // Stats for dashboard
  const stats = [
    {
      title: "Total Submissions",
      value: submissions.length,
      change: "+5%",
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      title: "New Today",
      value: submissions.filter((s) => {
        const today = new Date();
        const date = new Date(s.Timestamp);
        return date.toDateString() === today.toDateString();
      }).length,
      change: "+2%",
      icon: TrendingUp,
      color: "bg-green-500",
    },
  ];

  // Search filter
  const filteredSubmissions = submissions.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.Username?.toLowerCase().includes(q) ||
      s.Email?.toLowerCase().includes(q) ||
      String(s.Mobile).includes(q) ||
      s.Message?.toLowerCase().includes(q)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  const getStatusColor = (status : string) => {
    switch (status) {
      case "New":
        return "bg-green-100 text-green-700";
      case "Reviewed":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => console.log("Logout")}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "submissions"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300"
            }`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </button>
        </div>

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-green-600">
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Submissions View */}
        {activeTab === "submissions" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Submissions
              </h2>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              />
            </div>
            <div className="p-6 space-y-4">
              {loading ? (
                <p>Loading submissions...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : currentItems.length === 0 ? (
                <p>No submissions found.</p>
              ) : (
                currentItems.map((s, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{s.Username}</p>
                        <p className="text-sm text-gray-600">
                          {s.Email} • {s.Mobile}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-900">
                        {s.Message || "-"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          "New"
                        )}`}
                      >
                        New
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(s.Timestamp).toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 p-4 border-t border-gray-200">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;






// -----------------------------------


// import React, { useState, useEffect } from 'react';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Replace this with your actual Google Apps Script Web App URL
//   const SHEET_API_URL = '/submit'

//   useEffect(() => {
//     if (activeTab === 'submissions') {
//       setLoading(true);
//       fetch(SHEET_API_URL)
//         .then((res) => res.json())
//         .then((data) => {
//           setSubmissions(data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error(err);
//           setError('Failed to fetch submissions.');
//           setLoading(false);
//         });
//     }
//   }, [activeTab]);

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

//       <div className="flex justify-center gap-4 mb-6">
//         <button
//           className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
//           onClick={() => setActiveTab('dashboard')}
//         >
//           Dashboard
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${activeTab === 'submissions' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
//           onClick={() => setActiveTab('submissions')}
//         >
//           Submissions
//         </button>
//       </div>

//       {activeTab === 'dashboard' && (
//         <div className="text-center text-xl font-medium">
//           Welcome to the Admin Dashboard
//         </div>
//       )}

//       {activeTab === 'submissions' && (
//         <div>
//           {loading ? (
//             <p className="text-center">Loading submissions...</p>
//           ) : error ? (
//             <p className="text-center text-red-500">{error}</p>
//           ) : submissions.length === 0 ? (
//             <p className="text-center">No submissions yet.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border border-gray-200">
//                 <thead className="bg-gray-200">
//                   <tr>
//                     <th className="px-4 py-2 border">Username</th>
//                     <th className="px-4 py-2 border">Email</th>
//                     <th className="px-4 py-2 border">Mobile</th>
//                     <th className="px-4 py-2 border">Message</th>
//                     <th className="px-4 py-2 border">Timestamp</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {submissions.map((s, index) => (
//                     <tr key={index} className="hover:bg-gray-100">
//                       <td className="px-4 py-2 border">{s['Username']}</td>
//                       <td className="px-4 py-2 border">{s['Email']}</td>
//                       <td className="px-4 py-2 border">{s['Mobile']}</td>
//                       <td className="px-4 py-2 border">{s['Message'] || '-'}</td>
//                       <td className="px-4 py-2 border">{new Date(s['Timestamp']).toLocaleString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
