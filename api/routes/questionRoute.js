const express=require('express')
const router=express.Router()
const isAuth=require('../middleware/auth')
const {createQuizQestion,updateQestionInQuiz, getQestionInQuiz, deleteQestionInQuiz, getAllQestionsInQuiz}=require('../controllers/quetions.controllers')
const allowedTo = require('../middleware/allowedTo');
router.post('/quiz/:quizId/create',isAuth,allowedTo('teacher'),createQuizQestion)
router.put('/:questionId/edit',isAuth,allowedTo('teacher'),updateQestionInQuiz)
router.get('/:questionId/get',isAuth,allowedTo('teacher'),getQestionInQuiz)
router.get('/quiz/:quizId/all',isAuth,allowedTo('teacher'),getAllQestionsInQuiz)
router.delete('/:questionId/delete',isAuth,allowedTo('teacher'),deleteQestionInQuiz)
module.exports=router