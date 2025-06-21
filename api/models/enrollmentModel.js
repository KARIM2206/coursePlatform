
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  // يمكنك إضافة حقول إضافية مثل حالة الدفع أو نوع الاشتراك
  status: {
    type: String,
    enum: ['active', 'pending', 'cancelled'],
    default: 'active'
  }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;