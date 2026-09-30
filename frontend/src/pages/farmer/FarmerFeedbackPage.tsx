import React, { useState } from 'react';
import { api } from '../../services/api';
import { MessageSquare, Star, CheckCircle } from 'lucide-react';

export const FarmerFeedbackPage: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('Advisory Feasibility');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await api.submitFarmerFeedback(rating, comment, category);
      setSubmitted(true);
      setComment('');
    } catch (err) {
      alert('Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">Advisory Feedback</h1>
        <p className="text-xs text-stone-500 mt-1">
          Share your field execution experience with CropCompaz agronomy recommendations.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-emerald-900">Thank you for your feedback!</h3>
          <p className="text-xs text-emerald-800">Your comments help agronomists optimize resource-constrained recommendations.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-[#163B2F] text-white text-xs font-bold rounded-xl"
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Was this recommendation feasible & useful?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition ${
                    rating >= num ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${rating >= num ? 'fill-amber-400 text-amber-500' : ''}`} />
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none"
            >
              <option value="Advisory Feasibility">Advisory Feasibility & Cost</option>
              <option value="Resource Constraints">Resource & Equipment Fit</option>
              <option value="Input Availability">Input Material Availability</option>
              <option value="Crop Quality Outcome">Crop Quality Outcome</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Your Observations / Field Experience
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. The Neem Oil spray prevented thrips and stayed well within my budget."
              className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#163B2F] hover:bg-[#1B4D3E] text-white font-bold text-xs rounded-xl transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Advisory Feedback'}
          </button>
        </form>
      )}
    </div>
  );
};
