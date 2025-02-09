'use client'
import React, { useState } from 'react';
import {
  MapPin, Star, Heart, MessageSquare, Share2, Phone, Globe,
  ChevronDown, ChevronUp, Truck, Users, Utensils, ShoppingBag,
  Clock, Camera, Bookmark, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewModal from './ReviewModal';

// ... (keeping the same interfaces)

const RestaurantCard: React.FC<RestaurantProps> = ({
  name,
  image,
  rating,
  total_ratings,
  address,
  accessibility_score,
  pet_friendly,
  features,
  reviews,
  latitude,
  longitude,
  types,
  phone_number,
  website,
  price_level,
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const handleShare = async () => {
    try {
      await navigator.share({
        title: name,
        text: `Check out ${name}!`,
        url: getGoogleMapsUrl(latitude, longitude),
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleReviewSubmit = (rating: number, text: string) => {
    // Here you would typically send this to your backend
    console.log('New review:', { rating, text });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Star
              className={`w-4 h-4 ${
                index < Math.floor(rating)
                  ? 'text-amber-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive 
        ? 'bg-gradient-to-r from-primary to-yellow-400 text-white shadow-lg'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      
      }`}
    >
      {label}
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative">
        <motion.div
          className="relative h-80 cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsImageExpanded(!isImageExpanded)}
        >
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <motion.div
            className="absolute bottom-6 left-6 right-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-3">{name}</h2>
            <div className="flex flex-wrap items-center gap-2">
              {types.map((type, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white"
                >
                  {type.replace(/_/g, ' ')}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div className="absolute top-4 right-4 flex space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex space-x-2"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className={`p-3 rounded-full backdrop-blur-md transition-all ${
                  isLiked
                    ? 'bg-red-500/90 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSaved(!isSaved);
                }}
                className={`p-3 rounded-full backdrop-blur-md transition-all ${
                  isSaved
                    ? 'bg-violet-500/90 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6 overflow-x-hidden pb-2 ">
          <TabButton
            label="Overview"
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            label="Reviews"
            isActive={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          />
          <TabButton
            label="Features"
            isActive={activeTab === 'features'}
            onClick={() => setActiveTab('features')}
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {renderStars(rating)}
                  <span className="text-sm text-gray-600">
                    {rating} • {total_ratings} reviews
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  {price_level}
                </span>
              </div>

              <div className="flex flex-col space-y-3">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center text-gray-600"
                >
                  <MapPin className="w-5 h-5 mr-2 text-violet-500" />
                  <span>{address}</span>
                </motion.div>
                {phone_number !== 'Unknown' && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center text-gray-600"
                  >
                    <Phone className="w-5 h-5 mr-2 text-violet-500" />
                    <span>{phone_number}</span>
                  </motion.div>
                )}
                {website !== 'Unknown' && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center text-gray-600"
                  >
                    <Globe className="w-5 h-5 mr-2 text-violet-500" />
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:text-violet-700 hover:underline"
                    >
                      Visit Website
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <button
  onClick={() => setIsReviewModalOpen(true)}
  className="w-full px-4 py-3 bg-gradient-to-r from-primary to-yellow-400 text-white rounded-xl font-medium hover:from-primary-dark hover:to-yellow-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
>

                <MessageSquare className="w-5 h-5 mr-2" />
                Write a Review
              </button>

              <div className="space-y-4">
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 font-medium text-gray-700">{review.author}</span>
                      </div>
                      <span className="text-sm text-gray-500">{review.time}</span>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </motion.div>
                ))}
              </div>

              {reviews.length > 3 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full py-2 text-violet-600 hover:text-violet-700 flex items-center justify-center"
                >
                  {showAllReviews ? (
                    <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
                  ) : (
                    <>Show All Reviews <ChevronDown className="w-4 h-4 ml-1" /></>
                  )}
                </motion.button>
              )}
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-4"
            >
              {Object.entries(features).map(([key, value]) => {
                if (!value) return null;
                const icon = {
                  delivery: <Truck className="w-5 h-5" />,
                  takeout: <ShoppingBag className="w-5 h-5" />,
                  dine_in: <Utensils className="w-5 h-5" />,
                  good_for_groups: <Users className="w-5 h-5" />,
                }[key];

                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="p-2 bg-violet-100 rounded-lg text-violet-600 mr-3">
                      {icon}
                    </span>
                    <span className="text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-xl font-medium text-center hover:from-yellow-600 hover:to-yellow-500 transition-all flex items-center justify-center"


          >
            <MapPin className="w-5 h-5 mr-2" />
            View on Map
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // onClick={handleShare}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        placeName={name}
      />
    </motion.div>
  );
};

export default RestaurantCard;