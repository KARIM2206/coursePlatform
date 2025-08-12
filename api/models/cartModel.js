const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      addedAt: {
        type: Date,
        default: Date.now
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
