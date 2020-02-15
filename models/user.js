const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../errors/unauthorized-error");

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

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Неправильные почта или пароль");/*
        return Promise.reject(new Error("Неправильные почта или пароль")); */
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError("Неправильные почта или пароль");/*
            return Promise.reject(new Error("Неправильные почта или пароль")); */
          }
          return user;
        });
    })
    .catch(next);
};

module.exports = mongoose.model("user", userSchema);
