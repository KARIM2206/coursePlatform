const fs = require('fs');
const path = require('path');
const Course = require("../models/coursesModel");
const Enrollment = require("../models/enrollmentModel");
const errorHandler = require("../utils/error");
const jwt =require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const addCourse = async (req, res, next) => {
  // اجمع كل الحقول من body
  const fields = { ...req.body };
  try {
    const fileDirName = path.join(__dirname, '../uploads/courses');
    if (!fs.existsSync(fileDirName)) {
      fs.mkdirSync(fileDirName, { recursive: true });
    }

    let fileName;
    if (req.file) {
      fileName = Date.now() + path.extname(req.file.originalname);
      const filePath = path.join(fileDirName, fileName);
      fs.writeFileSync(filePath, req.file.buffer);
      fields.image = `uploads/courses/${fileName}`;
    }

    // أضف teacher إذا كان موجودًا في req.user
    if (req.user && req.user.id) {
      fields.teacher = req.user.id;
    }

    // أنشئ الكورس بكل الحقول (حتى لو بعضها غير موجود)
    const course = await Course.create(fields);

    const courseToken = jwt.sign({ id: course._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ ok: true, message: "Course added successfully", course, courseToken });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const getAllCourses = async (req, res, next) => {
  try {
    const { keyword ,tag} = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
     const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } }
          ]
        }
      : {};
       if (tag) {
      // If slug is a string, this regex will match the tag as a whole word
      query.slug = { $regex: new RegExp(`\\b${tag}\\b`, 'i') };
      // If slug is a comma-separated string, this regex will match the tag as a whole word
    }
          const totalCourses = await Course.countDocuments(query);
      const courses = await Course.find(query).where('isPublished', true).where('category', { $ne: null })
      .skip((page - 1) * limit)
      .limit(limit)

  res.status(200).json({
      ok: true,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      courses,
    });    }

  catch (error) {
    return next(errorHandler(error, 500));
  }
}

const getSingleCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    res.status(200).json({ success: true,massage:"course found" ,course });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const getteacherSingleCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    res.status(200).json({ ok: true,massage:"course found" ,course });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let fileName;
    let updateFields = { ...req.body };
    const fileDirName = path.join(__dirname, '../uploads/courses');
    if (!fs.existsSync(fileDirName)) {
      fs.mkdirSync(fileDirName, { recursive: true }); // Recursive to make sure path is created
    }


    if (req.file) {
      fileName = Date.now() + path.extname(req.file.originalname);
      const filePath = path.join(fileDirName, fileName);
      fs.writeFileSync(filePath, req.file.buffer);
      updateFields.image= req.file ? `uploads/courses/${fileName}`: null
    }

    const course = await Course.findByIdAndUpdate(id,  {$set:updateFields}, { new: true });
    res.status(200).json({ success: true, course });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    res.status(200).json({ success: true, course });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const getTeacherCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ teacher: req.user.id });
    res.status(200).json({ ok: true, courses });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
}
const getEnrolledCoursesToStudent = async (req, res, next) => {
  try {
const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');


const courses = enrollments
  .map(e => e.courseId)
//   // .filter(course => course && course._id);
//   console.log('courses', courses);
  
res.status(200).json({ ok: true,courses });;
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const ratingCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    // التحقق من صلاحية قيمة التقييم
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, message: "Invalid rating value. Must be between 1 and 5." });
    }

    // البحث عن الكورس
    const course = await Course.findById(id);
    if (!course) {
      return next(errorHandler("Course not found", 404)); // ✅ لازم return next
    }

    // التحقق من وجود category في الكورس (قبل أي تعديل)
    if (!course.category) {
      return res.status(400).json({ ok: false, message: "Course missing category. Please fix course data." });
    }

    // تحديث أو إضافة التقييم
    const existingIndex = course.rating.findIndex(r => r.user.toString() === req.user.id);
    if (existingIndex !== -1) {
      course.rating[existingIndex].value = rating;
    } else {
      course.rating.push({ user: req.user.id, value: rating });
    }

    // حساب المتوسط الجديد
    const totalRatings = course.rating.reduce((acc, r) => acc + r.value, 0);
    const avg = course.rating.length > 0 ? totalRatings / course.rating.length : 0;

    course.rate = Number.isNaN(avg) ? 0 : Number(avg.toFixed(2));

    await course.save();

    res.status(200).json({
      ok: true,
      message: "Rating added/updated successfully",
      course,
    });

  } catch (error) {
    return next(errorHandler(error, 500));
  }
};

const getStudentRating= async (req, res, next) => {
  try {
    const {courseId}=req.params;
const course = await Course.findById(courseId);

if (!course || !Array.isArray(course.rating) || course.rating.length === 0) {
  return next(errorHandler("Course not found or no ratings yet", 404));
}

const rating = course.rating.find(r => r.user.toString() === req.user.id);
const rateValue=rating?.value || 0
res.status(200).json({ ok: true, rateValue });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
}
const getAvrageRating = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    let ratingAvg = 0;
    if (!course || !Array.isArray(course.rating) ){
      return res.status(404).json({ ok: false, message: "Course not found or no ratings yet" });
    }
if (course.rating.length === 0) {
      ratingAvg = 0;
    }
    ratingAvg = course.rating.reduce((acc, r) => acc + (r.value || 0), 0) / course.rating.length;

    res.status(200).json({ ok: true, ratingAvg: Number(ratingAvg.toFixed(2)) });
  } catch (error) {
    next(errorHandler(error, 500));
  }
};
module.exports = { addCourse, getAllCourses,getteacherSingleCourse,ratingCourse, getStudentRating, getAvrageRating,
  getEnrolledCoursesToStudent, getSingleCourse, updateCourse, deleteCourse, getTeacherCourses };
