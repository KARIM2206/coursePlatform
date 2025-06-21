// models/Quiz.js
const mongoose = require('mongoose');



const quizSchema = new mongoose.Schema({
  title: String,
  playList: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
  question: { type: [mongoose.Schema.Types.ObjectId], ref: 'Question' },
  progress:{ type: mongoose.Schema.Types.ObjectId, ref: 'Progress',default:null}, 
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports =Quiz
