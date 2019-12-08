const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../errors/unauthorized-error");

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace("Bearer ", "");

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret");
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  req.user = payload;

  next();
};
