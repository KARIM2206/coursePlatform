const express = require('express');
const router = express.Router();
const {uploadUserAvatar}=require("../middleware/uploads")
const isAuth=require("../middleware/auth")
const {signup,signin, upload_avatar, getUser, updateAvatar, updateUser}=require('../controllers/auth.controllers');
const allowedTo = require('../middleware/allowedTo');
router.post('/signup',signup)
router.post('/signin',signin)
router.post('/uploads',isAuth,uploadUserAvatar.single('avatar'),upload_avatar)
router.get('/user',isAuth,getUser)
router.put('/updateAvatar',isAuth,uploadUserAvatar.single('avatar'),updateAvatar)
router.put('/update',isAuth,updateUser)
module.exports=router
