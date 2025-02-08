import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
  placeName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  placeName,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, reviewText);
    setRating(0);
    setReviewText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg transform transition-all">
        <div className="relative">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Rate your experience
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Share your thoughts about {placeName}
          </p>

          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                type="button"
                onMouseEnter={() => setHoverRating(index)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(index)}
                className="relative group"
              >
                <Star
                  className={`w-8 h-8 transition-all duration-200 ${
                    index <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400 scale-110'
                      : 'text-gray-300'
                  }`}
                />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sm text-gray-600">
                  {['Poor', 'Fair', 'Good', 'Great', 'Excellent'][index - 1]}
                </span>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!rating || !reviewText.trim()}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;