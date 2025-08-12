'use client';
import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getStudentRating, submitRating } from '../lib/server';
import { toast } from 'react-toastify';
import { Context } from '../CONTEXT/ContextProvider';

const StarRating = ({ initialRating = 0, onRatingChange = () => {}, courseId }) => {
  const { token } = useContext(Context);

  const [hoverRating, setHoverRating] = useState(0);
  const [ratingValue, setRatingValue] = useState(0); // value from backend
  const [loading, setLoading] = useState(false);

  // Handle missing credentials
  if (!token) {
    return <div className="text-red-500">Please login to rate this course</div>;
  }

  if (!courseId) {
    return <div className="text-red-500">Course ID is missing</div>;
  }

  // Fetch student's rating from backend
  const handleGetStudentRating = async () => {
    try {
      const data = await getStudentRating(courseId, token);
      if (data.ok) {
        setRatingValue(data.rateValue);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch rating');
    }
  };

  // Submit rating
  const handleRatingSubmit = async (selectedRating) => {
    try {
      setLoading(true);
      console.log(token);
      
      const data = await submitRating(courseId, selectedRating, token);
      if (!data.ok) {
        toast.error(data.message || 'Failed to submit rating');
        return;
      }

      toast.success(data.message || 'Rating submitted successfully');
      setRatingValue(selectedRating);
      onRatingChange(selectedRating);
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    handleGetStudentRating();
  }, [token, courseId]);

  // UI Handlers
  const handleMouseEnter = (value) => setHoverRating(value);
  const handleMouseLeave = () => setHoverRating(0);
  const handleClick = (value) => {
    if (!loading) {
      handleRatingSubmit(value);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || ratingValue);

        return (
          <motion.button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.9 }}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            disabled={loading}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFilled ? "#fbbf24" : "none"}
              stroke="#fbbf24"
              strokeWidth="1.5"
              className="w-6 h-6 md:w-8 md:h-8"
              initial={{ scale: 1 }}
              animate={{ scale: hoverRating === star ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </motion.svg>
          </motion.button>
        );
      })}

      <motion.span
        className="ml-2 text-gray-700 dark:text-gray-300 text-sm md:text-base whitespace-nowrap"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {ratingValue > 0 ? `${ratingValue} star${ratingValue !== 1 ? 's' : ''}` : 'No rating yet'}
      </motion.span>
    </div>
  );
};

export default StarRating;
