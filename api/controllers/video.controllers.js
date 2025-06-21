const path = require("path");
const fs = require("fs");
const errorHandler = require("../utils/error");
const Video = require("../models/videoModel");
const PlayList = require("../models/playlistModel");

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
const playListExist=await PlayList.findById(playList)
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
  playListExist?.videos?.push(videoCourse._id)
  if (!playListExist?.videos) {
    playListExist.videos = [];
  }
  
  await playListExist.save()
    // Return success response
res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
     videoCourse,
     
    });
  } catch (error) {
    return next(errorHandler(error || "Upload failed", 500));
  }
};

const getVideo=async (req, res, next) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id).populate("playList", "title");
    if (!video) {
      return next(errorHandler("Video not found", 404));
    }
    res.status(200).json({
      ok: true,
      video
    });
  }
  catch(error){ console.error(error)
    return next(errorHandler(error || "Failed to fetch video", 500));
   
  }
}
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
const editVideo = async (req, res, next) => {
  const { id } = req.params;
  try {
    const posterFile = req.files?.poster?.[0];
    const { title, playList } = req.body;

    // Prepare update fields
    let updateFields = {};
    if (title) updateFields.title = title;
    if (playList) updateFields.playList = playList;

    // Handle poster upload if provided
    if (posterFile) {
      const posterDir = path.join(__dirname, "../uploads/courses/posters");
      if (!fs.existsSync(posterDir)) fs.mkdirSync(posterDir, { recursive: true });
      const posterName = Date.now() + path.extname(posterFile.originalname);
      const posterPath = path.join(posterDir, posterName);
      fs.writeFileSync(posterPath, posterFile.buffer);
      updateFields.poster = `../uploads/courses/posters/${posterName}`;
    }

    // Update video document
    const videoCourse = await Video.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    // Optionally, update playlist.videos array if playList changed (not required if only updating title/poster)
    // You can add logic here if you want to move the video to another playlist

    res.status(200).json({
      ok: true,
      message: "Video updated successfully",
      videoCourse,
    });
  } catch (error) {
    return next(errorHandler(error || "edit failed", 500));
  }
};
const deleteVideo=async(req,res,next)=>{
  try {
    const {videoId}=req.params
    const video=await Video.findById(videoId)
    if (!video) {
      return next(errorHandler("Video not found", 404));
      
    }
     await Video.findByIdAndDelete(videoId)
  
    res.status(200).json({success:true,message:"video deleted"})
  } catch (error) {
    return (next(errorHandler(error,500)))
  }
}
module.exports = { addVideo ,getAllVideosInPlaylist,editVideo,getVideo,deleteVideo};
