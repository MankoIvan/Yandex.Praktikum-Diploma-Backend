const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((e) => {
      if (e) {
        throw new ConflictError("Пользователь с этим e-mail уже существует");
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({ name, email, password: hash }))
          .then((user) => {
            res.status(201).send({
              _id: user._id,
              email: user.email,
            });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret", { expiresIn: "7d" });
      res.cookie("jwt", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ answer: "cookie" });
      /* .end(); */
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send({ name: user.name, email: user.email });
      } else {
        throw new NotFoundError(`Нет пользователя с таким id: ${id}`);
      }
    })
    .catch(next);
};
