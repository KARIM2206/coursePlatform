// models/Quiz.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswer: String
});

const quizSchema = new mongoose.Schema({
  title: String,
  playList: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz
