const express = require('express');
const router = express.Router();
const isAuth=require('../middleware/auth')
const {addCourse, updateCourse, getAllCourses, getSingleCourse, deleteCourse, getTeacherCourses}=require('../controllers/course.controllers')
const allowedTo = require('../middleware/allowedTo');
const { uploadCourseAvatar } = require('../middleware/uploads');
router.post('/create',isAuth,allowedTo('teacher'),
uploadCourseAvatar.single('image'),addCourse)
router.patch('/:id/update',isAuth,allowedTo('teacher'),
uploadCourseAvatar.single('image'),updateCourse)
router.get('/all',getAllCourses)
router.get('/:id',getSingleCourse)
router.get('/teacher/:id',isAuth,allowedTo('teacher'),getTeacherCourses)
router.delete('/:id',isAuth,allowedTo('teacher'),deleteCourse)
module.exports=router