const Article = require("../models/article");

const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.status(201).send(article))
    .catch(next);
};

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .then((article) => {
      if (article) {
        if (article.owner.toString() === req.user._id) {
          Article.findByIdAndRemove(articleId)
            .then((deletedArticle) => res.send(deletedArticle))
            .catch(next);
        } else {
          throw new ForbiddenError("Вы не можете удалять чужие карточки");
        }
      } else {
        throw new NotFoundError("Эта карточка не найдена");
      }
    })
    .catch(next);
};
