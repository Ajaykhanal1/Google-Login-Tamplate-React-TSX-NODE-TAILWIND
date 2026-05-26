 
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    name: String,
    email: String,
    picture: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);