const mongoose = require("mongoose");
const validator = require("validator");

const articleSchema = new mongoose.Schema({
  keyword: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  text: {
    required: true,
    type: String,
  },
  date: {
    required: true,
    type: String,
  },
  source: {
    required: true,
    type: String,
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator: (l) => validator.isURL(l),
      message: "Ссылка сломалась",
    },
  },
  image: {
    required: true,
    type: String,
    match: /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|svg|png)/,
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("article", articleSchema);
