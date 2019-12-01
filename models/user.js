const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    required: true,
    type: String,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
