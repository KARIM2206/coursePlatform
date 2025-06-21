const mongoose = require("mongoose");

const videoProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  playlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  watchedTime: {
    type: Number,
    required: true,
    default: 0,
  },
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
   watchedPercent: {
    type: Number,
    default: 0,
    
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// تأكد من وجود سجل واحد فقط لكل طالب وفيديو
videoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model("VideoProgress", videoProgressSchema);
