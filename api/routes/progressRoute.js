
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');
const { progressQuiz, sendCertificateController, getProgress } = require('../controllers/progress_quiz.controllers');
const { progressVideo, getStudentStatsPerCourse } = require('../controllers/progress_video.controller');
// const allowedTo = require('../middleware/allowedTo');


router.post('/:quizId/submit', isAuth, progressQuiz);
router.get('/:progressId/get', isAuth, getProgress);

router.post("/send-certificate", sendCertificateController);

// progress video
router.post('/video/:videoId/submit', isAuth, progressVideo);
router.get('/student/:studentId/get', isAuth, getStudentStatsPerCourse);
module.exports = router;