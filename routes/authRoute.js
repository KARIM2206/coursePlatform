const express = require('express');
const router = express.Router();
const {uploadUserAvatar}=require("../middleware/uploads")
const isAuth=require("../middleware/auth")
const {signup,signin, upload_avatar}=require('../controllers/auth.controllers');
const allowedTo = require('../middleware/allowedTo');
router.post('/signup',signup)
router.post('/signin',signin)
router.post('/uploads',isAuth,uploadUserAvatar.single('avatar'),upload_avatar)
module.exports=router
