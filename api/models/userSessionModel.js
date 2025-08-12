const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  action: {
    type: String,
    enum: ['login', 'logout'],
    required: true
  },
  deviceType: String,
  browser: String,
  os: String,
  deviceName: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});
const UserSession = mongoose.model('UserSession', UserSessionSchema);
module.exports =UserSession