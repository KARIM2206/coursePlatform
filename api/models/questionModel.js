const { default: mongoose } = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],

  correctAnswer: String,
 quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Question = mongoose.model('Question', questionSchema);

module.exports = Question ;