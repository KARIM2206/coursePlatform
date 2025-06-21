const express = require('express');
const router = express.Router();
const { enrollInCourse, getStudentEnrollments, cancelEnrollment, getEnrollmenCourset } = require('../controllers/enrollment.controller');
 // تأكد أن لديك ميدل وير تحقق المستخدم
const isAuth = require('../middleware/auth');

// تسجيل طالب في كورس
router.post('/course', isAuth, enrollInCourse);

// جلب كل الكورسات التي اشترك فيها الطالب
router.get('/get', isAuth, getStudentEnrollments);
router.get('/course/:courseId/get', isAuth, getEnrollmenCourset);

// إلغاء اشتراك طالب في كورس
router.delete('/cancel', isAuth, cancelEnrollment);

module.exports = router;