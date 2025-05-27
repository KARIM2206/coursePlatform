const PlayList = require("../models/playlistModel")
const jwt=require('jsonwebtoken')
const errorHandler = require("../utils/error");
const fs=require('fs')
const path=require('path');
const { get } = require("http");
const createPlayList=async(req,res,next) =>{
    const {title,description,course}=req.body
    try {
    const fileDirName=path.join(__dirname,'../uploads/courses')
    if(!fs.existsSync(fileDirName)){
        fs.mkdirSync(fileDirName,{recursive:true})
    }
    let fileName;
    let poster = null;
    
    if (req.file) {
      fileName = Date.now() + path.extname(req.file.originalname);
      const filePath = path.join(fileDirName, fileName);
      fs.writeFileSync(filePath, req.file.buffer);
    
      // Use the generated filename here:
      poster = `../uploads/courses/${fileName}`;
    }
        console.log(req.file);
        
        const playlist=await PlayList.create({title,description,poster,
            teacher:req.user.id,course})
       const token =jwt.sign({id:playlist._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.status(200).json({success:true,playlist,playlistToken:token})
    } catch (error) {
        return next(errorHandler(error,500))
    }
    }
    const getAllPlaylistsInSingleCourse=async(req,res,next) =>{
        try {
            let {id}=req.params
            const playLists=await PlayList.find({course:id})
            res.status(200).json({success:true,playLists})
        } catch (error) {
            return next(errorHandler(error,500))
        }
    }
module.exports={createPlayList,getAllPlaylistsInSingleCourse}