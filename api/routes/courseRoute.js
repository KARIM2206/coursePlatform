const express = require('express');
const router = express.Router();
const isAuth=require('../middleware/auth')
const {addCourse, updateCourse, getAllCourses,
     getSingleCourse, deleteCourse, getTeacherCourses,
      getteacherSingleCourse,
      ratingCourse,
      getEnrolledCoursesToStudent,
      getRating,
      getAvrageRating,
      getStudentRating}=require('../controllers/course.controllers')
const allowedTo = require('../middleware/allowedTo');
const { uploadCourseAvatar } = require('../middleware/uploads');
router.post('/create',isAuth,allowedTo('teacher'),
uploadCourseAvatar.single('image'),addCourse)
router.patch('/:id/update',isAuth,allowedTo('teacher'),
uploadCourseAvatar.single('image'),updateCourse)
router.get('/all',getAllCourses)
router.get('/:id',getSingleCourse)
router.get('/teacher/courses',isAuth,allowedTo('teacher'),getTeacherCourses)
router.get('/student/courses',isAuth,allowedTo('student'),getEnrolledCoursesToStudent)
router.get('/teacher/:id',isAuth,allowedTo('teacher'),getteacherSingleCourse)
router.delete('/:id/delete',isAuth,allowedTo('teacher'),deleteCourse)
router.post('/:id/rating',isAuth,ratingCourse)
router.get('/:courseId/avrRating',getAvrageRating)
router.get('/:courseId/ratingStudent',isAuth,getStudentRating)
module.exports=router