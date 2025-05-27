const multer = require('multer');

const uploadUserAvatar = multer({
  storage: multer.memoryStorage(), // الصورة تُخزن مؤقتًا في الذاكرة
  limits: { fileSize: 5 * 1024 * 1024 }, // حجم أقصى 5MB
});
const uploadCourseAvatar = multer({
  storage: multer.memoryStorage(), // الصورة تُخزن مؤقتًا في الذاكرة
  limits: { fileSize: 5 * 1024 * 1024 }, // حجم أقصى 5MB
});
const uploadPlaylistAvatar = multer({
  storage: multer.memoryStorage(), // الصورة تُخزن مؤقتًا في الذاكرة
  limits: { fileSize: 5 * 1024 * 1024 }, // حجم أقصى 5MB
});


const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    // ✅ السماح فقط بـ video mimetypes
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed in "video" field'), false);
    }
  } else if (file.fieldname === 'poster') {
    // ✅ السماح فقط بالصور
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed in "poster" field'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter
});

// Upload middleware for both fields
const uploadMiddleware = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'poster', maxCount: 1 }
]);

module.exports = { uploadMiddleware ,uploadCourseAvatar,uploadPlaylistAvatar,uploadUserAvatar };
