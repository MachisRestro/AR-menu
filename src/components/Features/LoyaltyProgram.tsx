import React from 'react';
import { motion } from 'framer-motion';
import { X, Gift, Star, Trophy, Crown } from 'lucide-react';

interface LoyaltyProgramProps {
  onClose: () => void;
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({ onClose }) => {
  const currentPoints = 1250;
  const nextRewardPoints = 1500;
  const progress = (currentPoints / nextRewardPoints) * 100;

  const rewards = [
    { points: 500, reward: 'Free Appetizer', icon: '🥗', unlocked: true },
    { points: 1000, reward: 'Free Dessert', icon: '🍰', unlocked: true },
    { points: 1500, reward: '10% Off Next Order', icon: '💰', unlocked: false },
    { points: 2000, reward: 'Free Main Course', icon: '🍽️', unlocked: false },
    { points: 3000, reward: 'VIP Experience', icon: '👑', unlocked: false },
  ];

  const tiers = [
    { name: 'Bronze', min: 0, max: 999, color: 'bg-amber-600', icon: Star },
    { name: 'Silver', min: 1000, max: 2499, color: 'bg-gray-500', icon: Trophy },
    { name: 'Gold', min: 2500, max: 4999, color: 'bg-yellow-500', icon: Crown },
    { name: 'Platinum', min: 5000, max: Infinity, color: 'bg-purple-600', icon: Crown },
  ];

  const currentTier = tiers.find(tier => currentPoints >= tier.min && currentPoints <= tier.max) || tiers[0];
  const TierIcon = currentTier.icon;

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
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Loyalty Program</h2>
                <p className="text-purple-100 text-sm">Earn points with every order</p>
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

        {/* Current Status */}
        <div className="p-6">
          {/* Points Balance */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className={`w-8 h-8 ${currentTier.color} rounded-full flex items-center justify-center`}>
                <TierIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">{currentTier.name} Member</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{currentPoints}</div>
            <div className="text-sm text-gray-600">loyalty points</div>
          </div>

          {/* Progress to Next Reward */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress to next reward</span>
              <span className="text-sm text-gray-600">{nextRewardPoints - currentPoints} points to go</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Available Rewards */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h3>
            <div className="space-y-3">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.points}
                  whileHover={{ scale: reward.unlocked ? 1.02 : 1 }}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    reward.unlocked
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <p className={`font-medium ${
                          reward.unlocked ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          {reward.reward}
                        </p>
                        <p className="text-sm text-gray-500">{reward.points} points</p>
                      </div>
                    </div>
                    {reward.unlocked ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Redeem
                      </motion.button>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-800 mb-3">Your {currentTier.name} Benefits</h3>
            <ul className="text-sm text-purple-700 space-y-2">
              <li>• Earn 1 point per $1 spent</li>
              {currentTier.name !== 'Bronze' && <li>• Priority customer support</li>}
              {currentTier.name === 'Gold' && <li>• 15% bonus points on orders</li>}
              {currentTier.name === 'Platinum' && <li>• Exclusive menu items access</li>}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoyaltyProgram;