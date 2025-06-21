const express = require('express');
const router = express.Router();
const isAuth=require('../middleware/auth')
const {addVideo, editVideo, getVideo, deleteVideo}=require('../controllers/video.controllers')
const allowedTo = require('../middleware/allowedTo');


const {uploadMiddleware}=require('../middleware/uploads')
const {getAllVideosInPlaylist}=require('../controllers/video.controllers')  
router.post('/upload',isAuth,allowedTo('teacher')

,uploadMiddleware,addVideo)
router.put('/:id/update',isAuth,allowedTo('teacher')
,uploadMiddleware,editVideo)
router.get('/:id',isAuth,getVideo)
router.delete('/:videoId/delete',isAuth,allowedTo('teacher') ,deleteVideo)
router.get('/playlist/:id/videos',isAuth,getAllVideosInPlaylist)
module.exports=router
