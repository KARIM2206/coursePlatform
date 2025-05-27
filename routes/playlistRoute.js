const express = require('express');
const router = express.Router();
const isAuth=require('../middleware/auth')
const {createPlayList, getAllPlaylistsInSingleCourse}=require('../controllers/playlist.controllers')
const allowedTo = require('../middleware/allowedTo');
const courseAuth = require('../middleware/courseAuth');
const { uploadPlaylistAvatar } = require('../middleware/uploads');
router.post('/create',isAuth,allowedTo('teacher'),uploadPlaylistAvatar.single('poster'),createPlayList)
router.get('/course/:id/playlists', isAuth, allowedTo('teacher'),getAllPlaylistsInSingleCourse);

// router.put('/:id',isAuth,allowedTo('teacher'),updatePlaylist)
// router.delete('/:id',isAuth,allowedTo('teacher'),deletePlaylist)
module.exports=router