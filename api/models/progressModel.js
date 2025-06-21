const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: false,
  },
  playlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
    unique: true // يضمن إدخالاً واحداً لكل اختبار لكل مستخدم
  },
  answers: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0; // التأكد من وجود إجابات
      },
      message: "Answers array cannot be empty"
    }
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(value) {
        return value <= this.total; // التأكد أن النتيجة لا تتجاوز الإجمالي
      },
      message: "Score cannot exceed total questions"
    }
  },
  total: {
    type: Number,
    required: true,
    min: 1
  },
  passed: {
    type: Boolean,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    immutable: true // لا يمكن تعديله بعد الإدخال
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    set: function(value) {
      return Math.round(value * 100) / 100; // تقريب النسبة المئوية
    }
  }
}, {
  timestamps: true
});

// لمنع إدخال أكثر من محاولة لنفس الاختبار لنفس المستخدم
progressSchema.index({ userId: 1, quizId: 1 }, { unique: true });

// Middleware للتحقق قبل الحفظ
progressSchema.pre('save', function(next) {
  if (this.isNew) {
    this.percentage = (this.score / this.total) * 100;
    this.passed = this.percentage >= 50; // افتراضيًا النجاح عند 50%
  }
  next();
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;