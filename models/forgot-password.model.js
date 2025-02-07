const mongoose = require("mongoose");
const generate = require("../helpers/generate.js")
const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: { 
        type: Date,  
        expires: 180
    },
  },
  {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
  }
);

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;
