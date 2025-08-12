const Course = require('../models/coursesModel');
const Payment = require('../models/paymentModel');
const { User } = require('../models/userModels');
const Stripe = require('stripe');
const Enrollment = require('../models/enrollmentModel');
const Cart = require('../models/cartModel');
const errorHandler = require('../utils/error');
const mongoose = require('mongoose');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ تدعم كورس واحد أو كذا كورس من الـ body
const getCheckoutSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const locale = 'en';

    // دعم كورس واحد أو عدة كورسات
    const courseIds = req.body.courseIds || [req.params.courseId];

    const courses = await Course.find({ _id: { $in: courseIds } });
 
    const courseCheckedSubscribers = courses.map(course => course.subscribers.includes(user._id));
       console.log('Courses for checkout:', courseCheckedSubscribers);
    if (courseCheckedSubscribers.includes(true)) {
      return next(errorHandler(`You have already enrolled in this course`, 400));
    }
    if (!courses || courses.length === 0) {
      return next(errorHandler(`No valid courses found`, 404));
    }

    const line_items = courses.map(course => ({
      price_data: {
        currency: 'usd',
        unit_amount: course.price * 100,
        product_data: {
          name: course.title,
          images: [course.image],
        },
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: user.email,
success_url: `${process.env.CLIENT_SITE_URL}/${locale}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_SITE_URL}/${locale}/cart`,
      metadata: {
        userId: user._id.toString(),
        courseIds: courseIds.join(','),
      },
    });

    // حفظ كل الكورسات كـ مدفوعات معلقة
    for (let course of courses) {
      await Payment.create({
        courseId: course._id,
        userId: user._id,
        paymentId: session.id,
        amount: course.price,
        status: 'pending',
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Stripe session created',
      url: session.url,
    });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};


// ✅ Webhook تدعم multi-course checkout
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Stripe Webhook Signature Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ فقط نعالج نوع الـ event المناسب
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).send('Event type not handled');
  }

  const session = event.data.object;
  const userId = session.metadata.userId;
  const courseIdsRaw = session.metadata.courseIds
    ?.split(',')
    .map(id => id.trim())
    .filter(Boolean) || [];

  // ✅ إزالة التكرارات
  const courseIds = [...new Set(courseIdsRaw)];

  if (!userId || courseIds.length === 0) {
    console.warn(`⚠️ Missing userId or courseIds in session ${session.id}`);
    return res.status(400).send('Missing metadata');
  }

  try {
    // ✅ 1. تحديث أو إنشاء سجل الدفع + التسجيل في الكورس
    for (const courseId of courseIds) {
      const objectCourseId = new mongoose.Types.ObjectId(courseId);
      const objectUserId = new mongoose.Types.ObjectId(userId);

      // تحديث حالة الدفع أو إنشاء سجل جديد
      let payment = await Payment.findOne({ paymentId: session.id, courseId: objectCourseId });

      if (payment) {
        payment.status = 'completed';
        await payment.save();
      } else {
        await Payment.create({
          courseId: objectCourseId,
          userId: objectUserId,
          paymentId: session.id,
          amount: (session.amount_total || 0) / 100,
          status: 'completed',
        });
      }

      // تسجيل المستخدم في الكورس
      const alreadyEnrolled = await Enrollment.findOne({
        userId: objectUserId,
        courseId: objectCourseId
      });

      if (!alreadyEnrolled) {
        await Enrollment.create({
          userId: objectUserId,
          courseId: objectCourseId,
          status: 'active',
          enrolledAt: Date.now()
        });

        await Course.findByIdAndUpdate(
          objectCourseId,
          { $addToSet: { subscribers: objectUserId } },
          { new: true }
        );
      }
    }

    // ✅ 2. حذف الكورسات المدفوعة من السلة
    try {
      const objectUserId = new mongoose.Types.ObjectId(userId);
      const objectCourseIds = courseIds.map(id => new mongoose.Types.ObjectId(id));

      console.log('🧾 Deleting from cart:', { userId, courseIds });

      await Cart.updateOne(
        { userId: objectUserId },
        {
          $pull: {
            courses: {
              courseId: { $in: objectCourseIds }
            }
          }
        }
      );

      const updatedCart = await Cart.findOne({ userId: objectUserId });
      if (!updatedCart || updatedCart.courses.length === 0) {
        await Cart.deleteOne({ userId: objectUserId });
      }
    } catch (cartErr) {
      console.error('⚠️ Error while removing items from cart:', cartErr);
    }

    // ✅ 3. رجع نجاح الـ webhook
    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('❌ Webhook internal logic error:', err);
    return res.status(500).send('Internal Server Error');
  }
};




module.exports = { getCheckoutSession, stripeWebhook };
