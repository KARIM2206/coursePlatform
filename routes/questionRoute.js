const express=require('express')
const router=express.Router()
const isAuth=require('../middleware/auth')
const {createQuizQestion,updateQestionInQuiz, getQestionInQuiz, deleteQestionInQuiz}=require('../controllers/quetions.controllers')
const allowedTo = require('../middleware/allowedTo');
router.post('/create/:quizId/questions',isAuth,allowedTo('teacher'),createQuizQestion)
router.patch('/update/:quizId/questions/:questionId',isAuth,allowedTo('teacher'),updateQestionInQuiz)
router.get('/get/:quizId/questions/:questionId',isAuth,allowedTo('teacher'),getQestionInQuiz)
router.delete('/delete/:quizId/questions/:questionId',isAuth,allowedTo('teacher'),deleteQestionInQuiz)
module.exports=router