const express = require('express');
const router = express.Router();
const isAuth=require('../middleware/auth')
const {createPlayList, getAllPlaylistsInSingleCourse, deletePlaylist, updatePlayList, getPlaylist}=require('../controllers/playlist.controllers')
const allowedTo = require('../middleware/allowedTo');
const courseAuth = require('../middleware/courseAuth');
const { uploadPlaylistAvatar } = require('../middleware/uploads');
router.post('/create',isAuth,allowedTo('teacher'),uploadPlaylistAvatar.single('poster'),createPlayList)

router.get('/course/:id/playlists', isAuth,getAllPlaylistsInSingleCourse);
router.get('/:id', isAuth, allowedTo('teacher'),getPlaylist);

router.put('/:id/update',isAuth,allowedTo('teacher'),uploadPlaylistAvatar.single('poster'),updatePlayList)
router.delete('/:id/delete',isAuth,allowedTo('teacher'),deletePlaylist)
module.exports=router