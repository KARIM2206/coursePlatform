const fs = require('fs');
const path = require('path');
const Course = require("../models/coursesModel");
const errorHandler = require("../utils/error");
const jwt =require('jsonwebtoken')

const addCourse = async (req, res, next) => {
  const { title, price, description } = req.body;

  try {
    const fileDirName = path.join(__dirname, '../uploads/courses');
    if (!fs.existsSync(fileDirName)) {
      fs.mkdirSync(fileDirName, { recursive: true }); // Recursive to make sure path is created
    }

    let fileName;
    if (req.file) {
      fileName = Date.now() + path.extname(req.file.originalname);
      const filePath = path.join(fileDirName, fileName);
      fs.writeFileSync(filePath, req.file.buffer);
    }

    const course = await Course.create({
      title,
      price,
      description,
      teacher: req.user.id,
      image: req.file ? `uploads/courses/${fileName}` : null,
      // if you want to attach playlists initially
      // playLists: playLists || []
    });
const courseToken=jwt.sign({id:course._id},process.env.JWT_SECRET,{expiresIn:'7d'})
    res.status(200).json({ success: true, course , courseToken:courseToken });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const getAllCourses = async (req, res, next) => {
  try {
    const { keyword } = req.query;
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
          const totalCourses = await Course.countDocuments(query);
      const courses = await Course.find(query)
      .skip((page - 1) * limit)
      .limit(limit)

  res.status(200).json({
      success: true,
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
    res.status(200).json({ success: true, course });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
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
    res.status(200).json({ success: true, courses });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
}
module.exports = { addCourse, getAllCourses, getSingleCourse, updateCourse, deleteCourse, getTeacherCourses };
