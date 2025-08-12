const express = require('express');
const router = express.Router();
const {uploadUserAvatar}=require("../middleware/uploads")
const isAuth=require("../middleware/auth")
const {signup,signin, upload_avatar, getUser, updateAvatar, updateUser, logSession, getSessionStats}=require('../controllers/auth.controllers');
const allowedTo = require('../middleware/allowedTo');
router.post('/signup',signup)
router.post('/signin',signin)
router.post('/uploads',isAuth,uploadUserAvatar.single('avatar'),upload_avatar)
router.get('/user',isAuth,getUser)
router.put('/updateAvatar',isAuth,uploadUserAvatar.single('avatar'),updateAvatar)
router.put('/update',isAuth,updateUser)
router.post('/log-session', isAuth, logSession);
router.get('/session-stats', isAuth,getSessionStats);
module.exports=router
