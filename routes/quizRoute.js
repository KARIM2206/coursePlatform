
const express=require('express')
const { createQuiz, getQuiz, deleteQuiz, updateQuiz, getAllQuizsInPlaylist } = require('../controllers/quiz.controllers')
const isAuth = require('../middleware/auth')
const allowedTo = require('../middleware/allowedTo')
const router=express.Router()
router.post('/playlists/:playlistId/create',isAuth,allowedTo('teacher'),createQuiz)

router.get('/:quizId/get',isAuth,allowedTo('teacher'),getQuiz)
router.get('/playlists/:playlistId/getAll',isAuth,allowedTo('teacher'),getAllQuizsInPlaylist)
router.patch("/:quizId/update",isAuth,allowedTo('teacher'),updateQuiz)
router.delete("/:quizId/delete",isAuth,allowedTo('teacher'),deleteQuiz)
module.exports=router