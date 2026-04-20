import React from 'react';
import type { Review } from '../../types';
import StarRating from '../reviews/StarRating';

interface RecentReviewsProps {
  reviews: Review[];
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ reviews }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-gray-900 font-bold mb-6">Recent Feedback</h3>
      
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center text-gray-400 text-sm italic py-4">No reviews yet.</div>
        ) : (
          reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="group pb-6 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stellar/5 flex items-center justify-center text-stellar font-bold text-xs">
                    {review.reviewerName[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{review.reviewerName}</div>
                    <div className="text-[10px] text-gray-400">{review.date}</div>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 italic">"{review.comment}"</p>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-6 py-3 text-xs font-bold text-gray-400 hover:text-stellar border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
        View All Reviews
      </button>
    </div>
  );
};

export default RecentReviews;
