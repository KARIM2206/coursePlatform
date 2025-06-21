const mongoose = require('mongoose');

const playListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: false
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false
  },
  order: {
    type: Number,
    required: false
  },

  videos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Video',
    required: false
  },
  quizzes: [  // ✅ تعديل هنا: array بدل واحد
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: false
    }

  ]
  ,
    studentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }


});

const PlayList = mongoose.model('PlayList', playListSchema);
module.exports = PlayList;
