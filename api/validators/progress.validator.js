const { body, param, validationResult } = require('express-validator');
const errorHandler = require('../utils/error');

exports.validateProgressSubmission = [
  // Validate quiz ID parameter
  param('quizId')
    .isMongoId()
    .withMessage('Invalid quiz ID format'),
    
  // Validate answers array in body
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be an array with at least one answer'),
    
  // Validate each answer in the array
  body('answers.*')
    .notEmpty()
    .withMessage('Each answer must not be empty')
    .isString()
    .withMessage('Each answer must be a string'),
    
  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errorHandler(errors.array(), 400));
    }
    next();
  }
];

exports.validateProgressId = [
  param('progressId')
    .isMongoId()
    .withMessage('Invalid progress ID format'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errorHandler(errors.array(), 400));
    }
    next();
  }
];