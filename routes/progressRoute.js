
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth');
const { progressQuiz, sendCertificateController } = require('../controllers/progress_quiz.controllers');
// const allowedTo = require('../middleware/allowedTo');

router.post('/:quizId/submit', isAuth, progressQuiz);
router.post("/send-certificate", sendCertificateController);
module.exports = router;