const userRouter = require("express").Router();

const { getUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

userRouter.get("/users/me", auth, getUser);

module.exports = userRouter;
