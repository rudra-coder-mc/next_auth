import mongoose from "mongoose";

const userSchems = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "please provide a username"],
    unique: [true, "username already existe"],
  },

  email: {
    type: String,
    require: [true, "please provide a email"],
    unique: [true, "email already existe"],
  },

  password: {
    type: String,
    require: [true, "please provide a email"],
  },

  isVerfied: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchems);

export default User;
