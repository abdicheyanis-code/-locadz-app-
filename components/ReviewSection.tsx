
import React, { useState, useEffect } from 'react';
import { Review, UserProfile } from '../types';
import { reviewService } from '../services/reviewService';

interface ReviewSectionProps {
  propertyId: string;
  currentUser: UserProfile | null;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ propertyId, currentUser }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    const data = await reviewService.getReviewsForProperty(propertyId);
    setReviews(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !comment.trim()) return;

    setIsSubmitting(true);
    const newReview = await reviewService.addReview({
      property_id: propertyId,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      user_avatar: currentUser.avatar_url,
      rating,
      comment
    });

    if (newReview) {
      setReviews([newReview, ...reviews]);
      setComment('');
      setRating(5);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-indigo-50 pb-6">
        <h3 className="text-3xl font-black italic text-indigo-950 tracking-tighter">
          Avis Voyageurs
          <span className="ml-3 inline-flex items-center justify-center bg-indigo-100 text-indigo-600 text-sm font-black w-8 h-8 rounded-full not-italic">
            {reviews.length}
          </span>
        </h3>
        <div className="flex items-center gap-2">
           <span className="text-amber-500 text-xl">★</span>
           <span className="text-xl font-black text-indigo-950">
             {reviews.length > 0 
               ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
               : "Nouveau"}
           </span>
        </div>
      </div>

      {currentUser && (
        <form onSubmit={handleSubmit} className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 shadow-inner space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">Partagez votre expérience</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-all hover:scale-125 ${star <= rating ? 'text-amber-500' : 'text-gray-300 opacity-50'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment s'est passé votre séjour ?"
            className="w-full h-32 bg-white border border-indigo-50 rounded-3xl p-6 text-indigo-950 font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none shadow-sm"
            required
          />
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95"
            >
              {isSubmitting ? "PUBLICATION..." : "PUBLIER L'AVIS"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={review.user_avatar} alt={review.user_name} className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-50" />
                  <div>
                    <p className="font-black text-indigo-950 italic">{review.user_name}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString('fr-DZ', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <span className="text-amber-500 text-sm">★</span>
                  <span className="text-sm font-black text-amber-700">{review.rating}</span>
                </div>
              </div>
              <p className="text-indigo-900/80 font-medium leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-16 opacity-30">
            <div className="text-5xl mb-4">💬</div>
            <p className="font-black uppercase text-xs tracking-[0.3em]">Aucun avis pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};
