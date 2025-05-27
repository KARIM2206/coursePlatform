const express = require('express');
const router = express.Router();
const isAuth=require('../middleware/auth')
const {addVideo}=require('../controllers/video.controllers')
const allowedTo = require('../middleware/allowedTo');


const {uploadMiddleware}=require('../middleware/uploads')
const {getAllVideosInPlaylist}=require('../controllers/video.controllers')  
router.post('/upload',isAuth,allowedTo('teacher')

,uploadMiddleware,addVideo)
router.get('/playlist/:id/videos',isAuth,allowedTo('teacher'),getAllVideosInPlaylist)
module.exports=router
