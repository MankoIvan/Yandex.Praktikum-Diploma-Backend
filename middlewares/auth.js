const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../errors/unauthorized-error");

const { NODE_ENV, JWT_SECRET } = process.env;

const extractToken = (header) => header.replace("jwt=", "");

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  console.log(cookie);

  if (!cookie || !cookie.startsWith("jwt=")) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  const token = extractToken(cookie);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret");
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  req.user = payload;

  next();
};
