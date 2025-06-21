'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PercentageCircle = ({ 
  value = 0, 
  size = 120, 
  strokeWidth = 12,
  primaryColor = '#3b82f6',
  secondaryColor = '#e5e7eb',
  textColor = '#1f2937',
  showLabel = true,
  label = 'Completion',
  animationDuration = 1.2
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const fontSize = size * 0.2;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
      >
        <motion.svg
          width={size}
          height={size}
          className="rotate-[-90deg] drop-shadow-sm"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeOpacity={0.3}
          />

          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ 
              duration: animationDuration, 
              ease: [0.65, 0, 0.35, 1],
              delay: 0.2
            }}
          />
        </motion.svg>

        {/* Center text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: animationDuration * 0.7 }}
        >
          <span 
            className="font-medium"
            style={{ 
              color: textColor,
              fontSize: `${fontSize}px`
            }}
          >
            {Math.round(value)}%
          </span>
        </motion.div>
      </motion.div>

      {/* Optional label */}
      {showLabel && (
        <motion.p 
          className="text-sm font-medium text-gray-600 mt-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animationDuration * 0.9 }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
};

export default PercentageCircle;