const PlayList = require("../models/playlistModel");
const Progress = require("../models/progressModel");
const Video = require("../models/videoModel");
const Quiz = require("../models/quizModel");
const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/coursesModel');

// const videoProgress = require("../models/videoProgress");
const videoProgress = require("../models/videoProgress");
const errorHandler = require("../utils/error");
 
 const progressVideo=async(req,res,next) =>{
    try {
      const {videoId}=req.params
    const userId = req.user.id; 
    const {  playlistId, courseId, watchedTime, duration } = req.body;

    const isCompleted = (watchedTime / duration) >= 0.9;
   const watchedPercent = duration > 0 ? (watchedTime / duration) * 100 : 0;
    const existing = await videoProgress.findOne({ userId, videoId });

  
    if (existing && existing.watchedPercent >= 90) {
      return res.status(200).json({ 
        message: "Already completed, progress not updated again.", 
        progress: existing 
      });
    }
    const progress = await videoProgress.findOneAndUpdate(
      { userId, videoId },
      {
        watchedTime,
        duration,
        playlistId,
        courseId,
        isCompleted,
      watchedPercent, 
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Video progress saved", progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update video progress" });
  }
}
const getAllVideoProgressInPlaylist=async(req,res,next)=>{
  try {
    const {playlistId}=req.params
    const progress=await videoProgress.find({playlistId:playlistId})
    res.status(200).json({success:true,progress})
  } catch (error) {
    
  }
}


const getStudentStatsPerCourse = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // جميع الكورسات المشترك فيها الطالب مع اسم الكورس
    const enrollments = await Enrollment.find({ userId: studentId }).populate('courseId');

    const stats = [];

    for (const enrollment of enrollments) {
      const courseId = enrollment.courseId._id;
      const courseTitle = enrollment.courseId.title;

      // جميع البلالست في الكورس
      const playlists = await PlayList.find({ course: courseId });

      // إحصائيات كل بلالست
      const playlistsStats = [];

      for (const playlist of playlists) {
        // جميع فيديوهات البلالست
        const playlistVideos = await Video.find({ playList: playlist._id });
        const totalVideos = playlistVideos.length;

        // عدد الفيديوهات التي شاهدها الطالب في هذه البلالست
        const watchedVideos = await videoProgress.countDocuments({
          userId: studentId,
          isCompleted: true,
          playlistId: playlist._id
        });
        const watchedPercent = totalVideos > 0 ? (watchedVideos / totalVideos) * 100 : 0;

        // جميع الكويزات في هذه البلالست
        const quizzes = await Quiz.find({ playList: playlist._id });
        const quizIds = quizzes.map(q => q._id);

        // جميع الكويزات التي دخلها الطالب في هذه البلالست
        const quizProgresses = await Progress.find({
          userId: studentId,
          quizId: { $in: quizIds }
        });

        // نسبة الكويزات التي دخلها الطالب
        const quizzesEnteredCount = quizProgresses.length;
        const quizzesPercent = quizzes.length > 0 ? (quizzesEnteredCount / quizzes.length) * 100 : 0;

        // درجة كل كويز ومتوسط الدرجات
        const quizzesStats = quizzes.map(qz => {
          const progress = quizProgresses.find(qp => String(qp.quizId) === String(qz._id));
          return {
            quizId: qz._id,
            quizTitle: qz.title,
            score: progress ? progress.score : 0,
            total: progress ? progress.total : 0,
            percent: progress && progress.total > 0 ? (progress.score / progress.total) * 100 : 0
          };
        });

        const avgQuizDegree = quizzesStats.length
          ? quizzesStats.reduce((sum, q) => sum + q.percent, 0) / quizzesStats.length
          : 0;

        playlistsStats.push({
          playlistId: playlist._id,
          playlistTitle: playlist.title,
          totalVideos,
          watchedVideos,
          watchedPercent,
          quizzesCount: quizzes.length,
          quizzesPercent,
          quizzes: quizzesStats,
          avgQuizDegree
        });
      }

      stats.push({
        courseId,
        courseTitle,
        playlistsCount: playlists.length,
        playlistsStats // ← إحصائيات كل بلالست
      });
    }

    res.json({ stats });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};


module.exports={progressVideo,getAllVideoProgressInPlaylist,getStudentStatsPerCourse}