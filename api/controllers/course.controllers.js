const fs = require('fs');
const path = require('path');
const Course = require("../models/coursesModel");
const errorHandler = require("../utils/error");
const jwt =require('jsonwebtoken')

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
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } }
          ]
        }
      : {};
       if (tag) {
      // If slug is a string, this regex will match the tag as a whole word
      query.slug = { $regex: new RegExp(`\\b${tag}\\b`, 'i') };
      // If slug is a comma-separated string, this regex will match the tag as a whole word
    }
          const totalCourses = await Course.countDocuments(query);
      const courses = await Course.find(query).where('isPublished', true)
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
const ratingCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, message: "Invalid rating value" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ ok: false, message: "Course not found" });
    }

    // اجعل المستخدم يستطيع التقييم مرة واحدة فقط (تحديث التقييم إذا كان موجود)
    if (!course.rating) course.rating = [];
    if (!Array.isArray(course.rating)) course.rating = [];

    const existing = course.rating.find(r => r.user?.toString() === req.user.id);
    if (existing) {
      existing.value = rating;
    } else {
      course.rating.push({ user: req.user.id, value: rating });
    }

    // احسب المتوسط الجديد
    const avg =
      course.rating.length > 0
        ? course.rating.reduce((acc, r) => acc + r.value, 0) / course.rating.length
        : 0;

    course.rate = Number(avg.toFixed(2));
    await course.save();

    res.status(200).json({ ok: true, message: "Rating added successfully", course });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
module.exports = { addCourse, getAllCourses,getteacherSingleCourse,ratingCourse, getSingleCourse, updateCourse, deleteCourse, getTeacherCourses };
