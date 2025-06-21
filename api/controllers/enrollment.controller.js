const Course = require('../models/coursesModel');
const Enrollment = require('../models/enrollmentModel');
const errorHandler = require('../utils/error');


// تسجيل طالب في كورس
const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // تحقق إذا كان الطالب مسجل بالفعل
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(200).json({
        success: false,
        message: 'You are already enrolled in this course.'
      });
    }

    const enrollment = await Enrollment.create({ userId, courseId });
    // استخدم $addToSet لتجنب مشاكل الحقول المطلوبة
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { subscribers: userId } }
    );

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};

// جلب كل الكورسات التي اشترك فيها طالب
const getStudentEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const enrollments = await Enrollment.find({ userId }).populate('courseId');
    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    next(error);
  }
};

// إلغاء اشتراك طالب في كورس
const cancelEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }
    res.status(200).json({ success: true, message: 'Enrollment cancelled.' });
  } catch (error) {
    next(error);
  }
};
const getEnrollmenCourset = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }
    res.status(200).json({ success: true, message: 'Enrollment getting successfully.', enrollment });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};

module.exports = {
  enrollInCourse,
  getStudentEnrollments,
  cancelEnrollment,
  getEnrollmenCourset
};