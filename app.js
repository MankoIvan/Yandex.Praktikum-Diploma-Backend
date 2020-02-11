require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors, celebrate, Joi } = require("celebrate");

const { PORT = 3000 } = process.env;

const cors = require("cors")
const usersRouter = require("./routes/users");
const articleRouter = require("./routes/articles");
const { createUser, login } = require("./controllers/users");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/not-found-error");

const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/newsapi-db", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(requestLogger);

app.use("/", usersRouter);
app.use("/", articleRouter);
app.use("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.use("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.use(() => {
  throw new NotFoundError("Запрашиваемый ресурс не найден");
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? "На сервере произошла ошибка"
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
