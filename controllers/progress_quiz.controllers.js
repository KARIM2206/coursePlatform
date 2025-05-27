const PlayList = require("../models/playlistModel");
const Progress = require("../models/progressModel");
const Quiz = require("../models/quizModel");
const errorHandler = require("../utils/error");
const sendCertificate = require("../utils/sendCertificate");

const progressQuiz=async(req,res,next) =>{
    try {
        const {quizId} = req.params;
       const { answers } = req.body;
    const userId = req.user.id; 
        // Find the quiz by ID
        const existing = await Progress.findOne({ userId, quizId });
if (existing) return res.status(400).json({ message: "You already submitted this quiz." });

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return next(errorHandler("Quiz not found", 404));

        }

let correctAnswer=quiz.questions.map((question) => {
    return question.correctAnswer;
}
);
console.log("correctAnswer", correctAnswer);
let score = 0;
for (let i = 0; i < correctAnswer.length; i++) {
    if (correctAnswer[i] === answers[i]) {
        score++;
    }
}
console.log("score", score);
  let total = quiz.questions.length;
 const passed = score >= Math.ceil(total / 2); // Assuming passing is at least 50% correct  
const playListId = quiz.playList;
const playlist = await PlayList.findById(playListId);
if (!playlist) {
    return next(errorHandler("Playlist not found", 404));
}
console.log("playlist", playlist);

const courseId = playlist.course || null;
console.log("courseId", courseId);

const progress = await Progress.create({
    userId,
    courseId: courseId,
    playlistId: playListId,
    quizId: quiz._id,
    score,
    total,
    passed
});
        await progress.save();

  res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      progress
    });
    } catch (error) {
        return next(errorHandler(error, 500));
    }
}

const sendCertificateController = async (req, res) => {
  try {
    const { email, name, course } = req.body;

    // 1. التحقق الصارم من المدخلات
    if (!email || !name || !course) {
      return res.status(400).json({ 
        success: false,
        message: "جميع الحقول مطلوبة: البريد الإلكتروني، الاسم، اسم الدورة"
      });
    }

    // 2. تنظيف المدخلات
    const cleanEmail = email.toString().trim();
    const cleanName = name.toString().trim();
    const cleanCourse = course.toString().trim();

    // 3. تحقق إضافي من صحة البيانات
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return res.status(400).json({
        success: false,
        message: "بريد إلكتروني غير صالح"
      });
    }

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "الاسم يجب أن يحتوي على حرفين على الأقل"
      });
    }

    if (cleanCourse.length < 2) {
      return res.status(400).json({
        success: false,
        message: "اسم الدورة يجب أن يحتوي على حرفين على الأقل"
      });
    }

    console.log('بيانات الإدخال:', {
      email: cleanEmail,
      name: cleanName,
      course: cleanCourse
    });

    // 4. إرسال الشهادة
    await sendCertificate(cleanEmail, cleanName, cleanCourse);
    console.log("تم إرسال الشهادة إلى:", cleanEmail);

    // 5. الرد الناجح
    return res.status(200).json({ 
      success: true,
      message: "تم إرسال الشهادة بنجاح",
      data: {
        email: cleanEmail,
        name: cleanName,
        course: cleanCourse
      }
    });

  } catch (error) {
    console.error("خطأ في إرسال الشهادة:", error);
    return res.status(500).json({ 
      success: false,
      message: "فشل في إرسال الشهادة",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports={progressQuiz,sendCertificateController}