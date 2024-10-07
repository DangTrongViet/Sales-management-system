const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: String,
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
  }
);

const Account = mongoose.model('Account', accountSchema, "accounts");

module.exports = Account;
