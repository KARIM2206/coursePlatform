const path = require("path");
const fs = require("fs");
const errorHandler = require("../utils/error");
const Video = require("../models/videoModel");

const addVideo = async (req, res, next) => {
  const {title,playList}=req.body
  try {
    const videoFile = req.files?.video?.[0];
    const posterFile = req.files?.poster?.[0];
if (!playList) {
  return next(errorHandler("Required playlist id", 400));
}
    if (!videoFile) {
      return next(errorHandler("Required upload video", 400));
    }

    const videoDir = path.join(__dirname, "../uploads/courses/videos");
    const posterDir = path.join(__dirname, "../uploads/courses/posters");

    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
    if (posterFile && !fs.existsSync(posterDir)) fs.mkdirSync(posterDir, { recursive: true });

    const videoName = Date.now() + path.extname(videoFile.originalname);
    const videoPath = path.join(videoDir, videoName);
    fs.writeFileSync(videoPath, videoFile.buffer);

    let savedPosterPath = null;
    if (posterFile) {
      const posterName = Date.now() + path.extname(posterFile.originalname);
      const posterPath = path.join(posterDir, posterName);
      fs.writeFileSync(posterPath, posterFile.buffer);
      savedPosterPath = `../uploads/courses/posters/${posterName}`;
    }
const videoCourse=await Video.create({title,url:`../uploads/courses/videos/${videoName}`
  ,poster:savedPosterPath,playList})
  
res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
     videoCourse,
     
    });
  } catch (error) {
    return next(errorHandler(error.message || "Upload failed", 500));
  }
};

const getAllVideosInPlaylist = async (req, res, next) => {
  try {
    let {id} =req.params
    const videos = await Video.find({playList:id});

    
    res.status(200).json({ success: true, videos });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
}
;
module.exports = { addVideo ,getAllVideosInPlaylist};
