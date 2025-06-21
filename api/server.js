const express = require('express'); 
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoute = require('./routes/authRoute');
const playlistRoute = require('./routes/playlistRoute');
const videoRoute = require('./routes/videoRoute');
const courseRoute = require('./routes/courseRoute');
const quizRoute=require('./routes/quizRoute')
const questionRoute=require('./routes/questionRoute')
const progressRoute=require('./routes/progressRoute')
const categoryRoute = require('./routes/categoryRoute');

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/uploads',express.static('uploads'));

app.use('/api/auth',authRoute);
app.use('/api/playlist',playlistRoute);
app.use('/api/course',courseRoute);
app.use('/api/video',videoRoute);
app.use('/api/quiz',quizRoute);
app.use('/api/questions',questionRoute)
app.use('/api/progress',progressRoute);
app.use('/api/category', categoryRoute);
app.use('/api/enrollment', require('./routes/enrollmentRoute'));
// // Error handler (should be after all routes)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//     errors: err.errors || []
//   });
// });
app.use(errorMiddleware);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


