const articleRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { getArticles, createArticle, deleteArticle } = require("../controllers/articles");
const auth = require("../middlewares/auth");

articleRouter.get("/articles", celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().regex(/^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|svg|png)/),
  }),
}), auth, getArticles);
articleRouter.post("/articles", auth, createArticle);
articleRouter.delete("/articles/:articleId", auth, deleteArticle);

module.exports = articleRouter;
