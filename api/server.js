const express = require('express'); 
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoute = require('./routes/authRoute');
const playlistRoute = require('./routes/playlistRoute');
const videoRoute = require('./routes/videoRoute');
const courseRoute = require('./routes/courseRoute');
const quizRoute = require('./routes/quizRoute');
const questionRoute = require('./routes/questionRoute');
const progressRoute = require('./routes/progressRoute');
const categoryRoute = require('./routes/categoryRoute');
const paymentRoute = require('./routes/paymentRoute');
const { stripeWebhook } = require('./controllers/payment.controller');
const cartRoute = require('./routes/cartRoute');
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

// ✅ Stripe webhook route (قبل express.json)
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// ✅ بعدين json parsing
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoute);
app.use('/api/playlist', playlistRoute);
app.use('/api/course', courseRoute);
app.use('/api/video', videoRoute);
app.use('/api/quiz', quizRoute);
app.use('/api/questions', questionRoute);
app.use('/api/progress', progressRoute);
app.use('/api/category', categoryRoute);
app.use('/api/payment', paymentRoute); // باقي راوتات الدفع
app.use('/api/enrollment', require('./routes/enrollmentRoute'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
