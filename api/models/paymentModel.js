const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
   
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;